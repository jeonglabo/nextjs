"""
コメントに応じて該当箇所を自動抽出し、本文を置換する replace パッチを生成する。
DB参照（埋め込み検索）で関連情報も添える。
"""

from __future__ import annotations

import json
import os
import re
import urllib.request
import time
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from typing import Dict, List, Optional, Tuple


@dataclass(frozen=True)
class CommentSample:
    id: str
    targetPage: str
    category: str
    level: str
    difficulty: int
    comment: str


@dataclass(frozen=True)
class KnowledgeEmbedding:
    id: str
    url: str
    title: str
    text: str
    embedding: List[float]


@dataclass(frozen=True)
class ReplacePatch:
    id: str
    targetPage: str
    targetSectionId: str
    targetParagraphIndex: int
    operation: str
    content: str
    rationale: str


def load_env_file(path: str) -> None:
    if not os.path.exists(path):
        return
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def load_comments(path: str) -> List[CommentSample]:
    with open(path, "r", encoding="utf-8") as f:
        raw = json.load(f)
    return [
        CommentSample(
            id=item["id"],
            targetPage=item["targetPage"],
            category=item["category"],
            level=item["level"],
            difficulty=int(item["difficulty"]),
            comment=item["comment"],
        )
        for item in raw
    ]


def fetch_embeddings(api_key: str, texts: List[str]) -> List[List[float]]:
    url = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        f"text-embedding-004:batchEmbedContents?key={api_key}"
    )
    payload = {
        "requests": [
            {"model": "models/text-embedding-004", "content": {"parts": [{"text": text}]}}
            for text in texts
        ]
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url, data=data, headers={"Content-Type": "application/json"}, method="POST"
    )
    with urllib.request.urlopen(req, timeout=60) as response:
        raw = response.read().decode("utf-8", errors="ignore")
    result = json.loads(raw)
    embeddings = result.get("embeddings", [])
    return [item.get("values", []) for item in embeddings]


def cosine_similarity(a: List[float], b: List[float]) -> float:
    if not a or not b or len(a) != len(b):
        return 0.0
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = sum(x * x for x in a) ** 0.5
    norm_b = sum(y * y for y in b) ** 0.5
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)


def load_embeddings(path: str) -> List[KnowledgeEmbedding]:
    data = json.loads(open(path, "r", encoding="utf-8").read())
    return [
        KnowledgeEmbedding(
            id=row["id"],
            url=row["url"],
            title=row["title"],
            text=row["text"],
            embedding=row["embedding"],
        )
        for row in data
    ]


def select_context(
    comment: str, embeddings: List[KnowledgeEmbedding], api_key: str, top_k: int = 3
) -> List[str]:
    query_vec = fetch_embeddings(api_key, [comment])[0]
    scored: List[Tuple[float, KnowledgeEmbedding]] = []
    for row in embeddings:
        score = cosine_similarity(query_vec, row.embedding)
        scored.append((score, row))
    scored.sort(key=lambda x: x[0], reverse=True)
    return [row.text[:800] for _, row in scored[:top_k]]


def extract_sections(tsx: str) -> Dict[str, List[str]]:
    sections: Dict[str, List[str]] = {}
    h2_pattern = re.compile(r'<h2[^>]*id="([^"]+)"[^>]*>(.*?)</h2>', re.S)
    matches = list(h2_pattern.finditer(tsx))
    for idx, match in enumerate(matches):
        section_id = match.group(1)
        start = match.end()
        end = matches[idx + 1].start() if idx + 1 < len(matches) else len(tsx)
        block = tsx[start:end]
        paras = re.findall(r"<p[^>]*>(.*?)</p>", block, re.S)
        cleaned = [re.sub(r"<[^>]+>", " ", p).strip() for p in paras]
        cleaned = [re.sub(r"\s+", " ", p) for p in cleaned if p]
        sections[section_id] = cleaned
    return sections


def build_prompt(
    comment: str, sections: Dict[str, List[str]], context_snippets: List[str]
) -> str:
    section_lines = []
    for section_id, paras in sections.items():
        for i, para in enumerate(paras):
            section_lines.append(f"[{section_id}#{i}] {para}")
    section_text = "\n".join(section_lines) or "（対象段落なし）"
    context_text = "\n".join(f"- {c}" for c in context_snippets)

    return (
        "あなたは線形代数教材の編集者です。コメントに応じて、"
        "本文のどの段落を修正すべきかを判断し、書き換え案を出してください。\n"
        "以下のルールに従って JSON で回答してください。\n"
        "ルール:\n"
        "- sectionId は提示されたものから選ぶ\n"
        "- paragraphIndex は 0 始まり\n"
        "- rewrittenText は 200〜400字の日本語\n"
        "- できるだけ本文の語調に合わせる\n\n"
        f"コメント: {comment}\n\n"
        f"参照情報:\n{context_text}\n\n"
        f"本文候補:\n{section_text}\n\n"
        "出力形式:\n"
        '{"sectionId":"...","paragraphIndex":0,"rewrittenText":"...","reason":"..."}'
    )


def extract_json(text: str) -> Optional[dict]:
    match = re.search(r"\{.*\}", text, flags=re.S)
    if not match:
        return None
    try:
        return json.loads(match.group(0))
    except Exception:
        return None


def call_gemini(api_key: str, prompt: str) -> str:
    url = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        f"gemini-2.5-flash:generateContent?key={api_key}"
    )
    payload = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.2},
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url, data=data, headers={"Content-Type": "application/json"}, method="POST"
    )
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=60) as response:
                raw = response.read().decode("utf-8", errors="ignore")
            result = json.loads(raw)
            parts = result.get("candidates", [])[0].get("content", {}).get("parts", [])
            return "".join(p.get("text", "") for p in parts).strip()
        except Exception:
            time.sleep(2 + attempt)
    return ""


def main() -> None:
    load_env_file(".env.local")
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError("GOOGLE_API_KEY が設定されていません。")

    pipeline_dir = os.path.dirname(os.path.abspath(__file__))
    eigen_update_dir = os.path.dirname(pipeline_dir)
    experiments_dir = os.path.dirname(eigen_update_dir)
    project_root = os.path.dirname(experiments_dir)
    base_dir = eigen_update_dir
    comments_path = os.path.join(
        base_dir, "comment_sets", "generated", "sample_comments.json"
    )
    embeddings_path = os.path.join(
        base_dir, "knowledge", "db", "knowledge_embeddings.json"
    )

    comments = load_comments(comments_path)
    embeddings = load_embeddings(embeddings_path)

    solve_path = os.path.join(
        project_root, "app/linear_algebra/contents/eigen_solve.tsx"
    )
    property_path = os.path.join(
        project_root, "app/linear_algebra/contents/eigen_property.tsx"
    )

    solve_sections = extract_sections(open(solve_path, "r", encoding="utf-8").read())
    property_sections = extract_sections(
        open(property_path, "r", encoding="utf-8").read()
    )

    patches: List[ReplacePatch] = []
    for comment in comments:
        sections = solve_sections if comment.targetPage == "eigen_solve" else property_sections
        context = select_context(comment.comment, embeddings, api_key)
        prompt = build_prompt(comment.comment, sections, context)
        response = call_gemini(api_key, prompt)
        if not response:
            continue
        parsed = extract_json(response)
        if not parsed:
            continue
        section_id = parsed.get("sectionId")
        paragraph_index = int(parsed.get("paragraphIndex", -1))
        rewritten = parsed.get("rewrittenText", "").strip()
        reason = parsed.get("reason", "コメントに応じた本文修正。")
        if not section_id or paragraph_index < 0 or not rewritten:
            continue
        patches.append(
            ReplacePatch(
                id=f"replace-{comment.id}",
                targetPage=comment.targetPage,
                targetSectionId=section_id,
                targetParagraphIndex=paragraph_index,
                operation="replace",
                content=rewritten,
                rationale=reason,
            )
        )

    payload = {
        "mode": "expert_replace",
        "generatedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "sourceComments": [c.id for c in comments],
        "meta": {"engineVersion": "0.1-replace-auto", "note": "auto select + rewrite"},
        "patches": [asdict(p) for p in patches],
    }

    output_path = os.path.join(base_dir, "outputs", "expert", "latest_replace.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    print(f"✅ replace パッチを保存しました: {output_path}")


if __name__ == "__main__":
    main()
