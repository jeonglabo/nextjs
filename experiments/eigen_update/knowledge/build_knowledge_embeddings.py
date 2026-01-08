"""
knowledge_pages.jsonl を Google AI Studio の埋め込みAPIでベクトル化して保存する。
"""

from __future__ import annotations

import json
import os
import urllib.request
from dotenv import load_dotenv
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from typing import List


@dataclass(frozen=True)
class KnowledgeEmbedding:
    id: str
    url: str
    title: str
    text: str
    embedding: List[float]


def load_pages(path: str) -> List[dict]:
    pages: List[dict] = []
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            if line.strip():
                pages.append(json.loads(line))
    return pages


def fetch_embeddings(api_key: str, texts: List[str]) -> List[List[float]]:
    url = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        f"text-embedding-004:batchEmbedContents?key={api_key}"
    )
    payload = {
        "requests": [
            {
                "model": "models/text-embedding-004",
                "content": {"parts": [{"text": text}]},
            }
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


def main() -> None:
    load_dotenv(".env.local")
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError("GOOGLE_API_KEY が設定されていません。")

    base_dir = os.path.dirname(os.path.abspath(__file__))
    pages_path = os.path.join(base_dir, "db", "knowledge_pages.jsonl")
    output_path = os.path.join(base_dir, "db", "knowledge_embeddings.json")
    meta_path = os.path.join(base_dir, "db", "embeddings_index.json")

    pages = load_pages(pages_path)
    if not pages:
        raise ValueError("knowledge_pages.jsonl が空です。")

    batch_size = 8
    embeddings: List[KnowledgeEmbedding] = []
    for i in range(0, len(pages), batch_size):
        batch = pages[i : i + batch_size]
        texts = [row.get("text", "")[:4000] for row in batch]
        vectors = fetch_embeddings(api_key, texts)
        for row, vector in zip(batch, vectors):
            embeddings.append(
                KnowledgeEmbedding(
                    id=row["id"],
                    url=row["url"],
                    title=row["title"],
                    text=row["text"],
                    embedding=vector,
                )
            )

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump([asdict(e) for e in embeddings], f, ensure_ascii=False, indent=2)

    meta = {
        "generatedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "sourceCount": len(pages),
        "embeddingCount": len(embeddings),
        "note": "Eigen update embeddings (pages)",
    }
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(meta, f, ensure_ascii=False, indent=2)

    print(f"✅ 埋め込みを保存しました: {output_path}")


if __name__ == "__main__":
    main()
