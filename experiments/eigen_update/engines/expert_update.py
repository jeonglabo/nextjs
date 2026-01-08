"""
専門化版の更新ロジック（RAGではなく、DB参照型）。
コメントを受け取り、知識 DB から関連テキストを選び、補足セクションを生成する。
"""

from __future__ import annotations

import json
import os
import re
import urllib.request
import time
from dataclasses import asdict, dataclass, field
from typing import Dict, List, Optional, Tuple
from datetime import datetime, timezone


@dataclass(frozen=True)
class CommentSample:
    id: str
    targetPage: str
    category: str
    level: str
    difficulty: int
    comment: str
    expected_gap: Optional[str] = None


@dataclass(frozen=True)
class KnowledgeChunk:
    id: str
    url: str
    title: str
    text: str
    sourceIndex: int
    chunkIndex: int
    embedding: Optional[List[float]] = None


@dataclass(frozen=True)
class Patch:
    id: str
    targetPage: str
    targetSectionId: str
    operation: str
    content: str
    rationale: str
    citations: List[str] = field(default_factory=list)
    retrievalLog: List[str] = field(default_factory=list)


def normalize(text: str) -> str:
    lowered = text.lower()
    cleaned = re.sub(r"[^\wぁ-んァ-ン一-龥]+", " ", lowered)
    return re.sub(r"\s+", " ", cleaned).strip()


def is_domain_relevant(chunk: KnowledgeChunk) -> bool:
    """固有値・対角化に関係するページだけを優先する簡易フィルタ。"""
    text = normalize(chunk.title + " " + chunk.text)
    keywords = [
        "固有値",
        "固有ベクトル",
        "固有方程式",
        "特性方程式",
        "固有空間",
        "固有多項式",
        "対角化",
        "ジョルダン",
        "スペクトル",
        "レイリー",
        "直交",
        "トレース",
        "行列式",
        "eigenvalue",
        "eigenvector",
    ]
    return any(k.lower() in text for k in keywords)


def tokenize(text: str) -> List[str]:
    return [t for t in normalize(text).split(" ") if t]


def score_chunk(tokens: List[str], chunk: KnowledgeChunk) -> Tuple[int, int]:
    haystack = normalize(chunk.title + " " + chunk.text)
    hits = sum(1 for t in tokens if t in haystack)
    uniq_hits = len(set(t for t in tokens if t in haystack))
    return hits, uniq_hits


def select_chunks(
    comment: CommentSample, chunks: List[KnowledgeChunk], top_k: int = 2
) -> List[KnowledgeChunk]:
    tokens = tokenize(comment.comment)
    scored = []
    for chunk in chunks:
        if not is_domain_relevant(chunk):
            continue
        hits, uniq_hits = score_chunk(tokens, chunk)
        score = hits + uniq_hits * 2
        scored.append((score, chunk))
    scored.sort(key=lambda x: x[0], reverse=True)
    return [c for s, c in scored[:top_k] if s > 0]


def extract_key_sentences(text: str, tokens: List[str], max_sentences: int = 2) -> List[str]:
    sentences = re.split(r"(?<=[。．.!?！？])\s+", text)
    picked = []
    for sentence in sentences:
        if any(t in sentence for t in tokens):
            picked.append(sentence.strip())
        if len(picked) >= max_sentences:
            break
    if not picked and sentences:
        picked = [sentences[0].strip()]
    return [s for s in picked if s]


def category_to_section(category: str, target_page: str) -> str:
    mapping: Dict[str, str] = {
        "beginner_question": "definition",
        "misconception": "definition",
        "definition_check": "definition",
        "procedure_stuck": "char_poly",
        "example_request": "worked_example",
        "property_deepdive": "spectral_overview",
        "expert_probe": "diagonalization_condition",
    }
    return mapping.get(category, "definition") if target_page == "eigen_solve" else mapping.get(category, "spectral_overview")


def build_patch(
    comment: CommentSample, selected: List[KnowledgeChunk], api_key: Optional[str]
) -> Patch:
    tokens = tokenize(comment.comment)
    snippets = []
    citations = []
    retrieval_log = []
    for chunk in selected:
        sentences = extract_key_sentences(chunk.text, tokens)
        snippets.append(" / ".join(sentences))
        citations.append(chunk.url)
        retrieval_log.append(f"{chunk.id}: {chunk.title}")

    if snippets:
        content = build_llm_summary(comment, snippets, api_key)
    else:
        content = "【専門的補足】\n- 該当する参照文が見つかりませんでした。\n【出典】\n"

    # 出典は出力しない方針のため、本文への追記は行わない。

    return Patch(
        id=f"patch-{comment.id}",
        targetPage=comment.targetPage,
        targetSectionId=category_to_section(comment.category, comment.targetPage),
        operation="insert",
        content=content,
        rationale=build_rationale(comment),
        citations=[],
        retrievalLog=[],
    )


def build_rationale(comment: CommentSample) -> str:
    mapping = {
        "beginner_question": "定義の明確化と図形的意味の補強を目的とする。",
        "misconception": "行列式との誤解を解消し、固有値の位置づけを整理する。",
        "definition_check": "定義の条件と固有空間の扱いを明確化する。",
        "procedure_stuck": "特性方程式の展開手順と検算観点を補足する。",
        "property_deepdive": "実対称行列の実数性と直交対角化の根拠を補強する。",
        "expert_probe": "重複度と対角化条件の整理、ジョルダン標準形の位置づけを示す。",
    }
    return mapping.get(comment.category, "DB 参照による補足を追加し、専門的背景を補強する。")


def build_expert_run(
    comments: List[CommentSample], chunks: List[KnowledgeChunk], api_key: Optional[str]
) -> List[Patch]:
    patches: List[Patch] = []
    for comment in comments:
        if api_key and any(c.embedding for c in chunks):
            selected = select_chunks_by_embedding(comment, chunks, api_key)
            if not selected:
                selected = select_chunks(comment, chunks)
        else:
            selected = select_chunks(comment, chunks)
        patches.append(build_patch(comment, selected, api_key))
    return patches


def load_chunks(path: str) -> List[KnowledgeChunk]:
    chunks: List[KnowledgeChunk] = []
    with open(path, "r", encoding="utf-8") as f:
        if path.endswith(".jsonl"):
            for line in f:
                row = json.loads(line)
                chunks.append(
                    KnowledgeChunk(
                        id=row["id"],
                        url=row["url"],
                        title=row["title"],
                        text=row["text"],
                        sourceIndex=row.get("sourceIndex", 0),
                        chunkIndex=row.get("chunkIndex", 0),
                    )
                )
        else:
            data = json.load(f)
            for row in data:
                chunks.append(
                    KnowledgeChunk(
                        id=row["id"],
                        url=row["url"],
                        title=row["title"],
                        text=row["text"],
                        sourceIndex=row.get("sourceIndex", 0),
                        chunkIndex=row.get("chunkIndex", 0),
                        embedding=row.get("embedding"),
                    )
                )
    return chunks


def load_comments(path: str) -> List[CommentSample]:
    with open(path, "r", encoding="utf-8") as f:
        raw = json.load(f)
    comments = []
    for item in raw:
        comments.append(
            CommentSample(
                id=item["id"],
                targetPage=item["targetPage"],
                category=item["category"],
                level=item["level"],
                difficulty=int(item["difficulty"]),
                comment=item["comment"],
                expected_gap=item.get("expected_gap"),
            )
        )
    return comments


def run_expert_pipeline(
    comments_path: str,
    knowledge_path: str,
    output_path: str,
    api_key: Optional[str] = None,
) -> None:
    comments = load_comments(comments_path)
    chunks = load_chunks(knowledge_path)
    patches = build_expert_run(comments, chunks, api_key)

    payload = {
        "mode": "expert",
        "generatedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "sourceComments": [c.id for c in comments],
        "meta": {"engineVersion": "0.1-expert-db", "note": "db-referenced update"},
        "patches": [asdict(p) for p in patches],
    }

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    print(f"✅ 専門版パッチを保存しました: {output_path}")


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
        url,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=60) as response:
        raw = response.read().decode("utf-8", errors="ignore")
    result = json.loads(raw)
    embeddings = result.get("embeddings", [])
    if not embeddings:
        raise ValueError("埋め込みが取得できませんでした。")
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


def select_chunks_by_embedding(
    comment: CommentSample, chunks: List[KnowledgeChunk], api_key: str, top_k: int = 3
) -> List[KnowledgeChunk]:
    query_vec = fetch_embeddings(api_key, [comment.comment])[0]
    scored = []
    for chunk in chunks:
        if not chunk.embedding:
            continue
        if not is_domain_relevant(chunk):
            continue
        score = cosine_similarity(query_vec, chunk.embedding)
        scored.append((score, chunk))
    scored.sort(key=lambda x: x[0], reverse=True)
    return [c for s, c in scored[:top_k]]


def build_llm_summary(
    comment: CommentSample, snippets: List[str], api_key: Optional[str]
) -> str:
    if not api_key:
        bullet = "\n- ".join(snippets)
        trimmed = trim_text(bullet, 400)
        return f"【専門的補足】\n- {trimmed}\n【出典】\n"

    url = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        f"gemini-2.5-flash:generateContent?key={api_key}"
    )
    context = "\n".join(f"- {s}" for s in snippets)
    prompt = (
        "あなたは線形代数の教材編集者です。以下の参照文を根拠に、"
        "コメントに答える短い補足文を日本語で作ってください。"
        "本文は200〜400字、箇条書き可。出典URLは本文に含めないでください。\n\n"
        f"コメント: {comment.comment}\n\n参照文:\n{context}"
    )
    payload = {
        "contents": [
            {"role": "user", "parts": [{"text": prompt}]},
        ],
        "generationConfig": {"temperature": 0.2},
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=60) as response:
                raw = response.read().decode("utf-8", errors="ignore")
            result = json.loads(raw)
            parts = result.get("candidates", [])[0].get("content", {}).get("parts", [])
            text = "".join(p.get("text", "") for p in parts).strip()
            text = re.sub(r"https?://\\S+", "", text).strip()
            text = trim_text(text, 400)
            if not text:
                text = "（要約の生成に失敗しました）"
            return f"【専門的補足】\n{text}\n【出典】\n"
        except Exception:
            time.sleep(1 + attempt)
    bullet = "\n- ".join(snippets)
    trimmed = trim_text(bullet, 400)
    return f"【専門的補足】\n- {trimmed}\n【出典】\n"


def trim_text(text: str, max_chars: int) -> str:
    if len(text) <= max_chars:
        return text
    return text[: max_chars - 1].rstrip() + "…"
