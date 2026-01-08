"""
専門版のパイプライン。
knowledge/db/knowledge_chunks.jsonl を参照してパッチを生成する。
"""

from __future__ import annotations

import os
from dotenv import load_dotenv

from experiments.eigen_update.engines.expert_update import run_expert_pipeline


def main() -> None:
    load_dotenv(".env.local")
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    comments_path = os.path.join(
        base_dir, "comment_sets", "generated", "sample_comments.json"
    )
    knowledge_pages_path = os.path.join(
        base_dir, "knowledge", "db", "knowledge_pages.jsonl"
    )
    knowledge_chunks_path = os.path.join(
        base_dir, "knowledge", "db", "knowledge_chunks.jsonl"
    )
    knowledge_embeddings_path = os.path.join(
        base_dir, "knowledge", "db", "knowledge_embeddings.json"
    )
    output_path = os.path.join(base_dir, "outputs", "expert", "latest.json")
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    if os.path.exists(knowledge_embeddings_path):
        knowledge_path = knowledge_embeddings_path
    elif os.path.exists(knowledge_pages_path):
        knowledge_path = knowledge_pages_path
    elif os.path.exists(knowledge_chunks_path):
        knowledge_path = knowledge_chunks_path
    else:
        raise FileNotFoundError(
            "knowledge DB が見つかりません。build_knowledge_pages.py か build_knowledge_db.py を実行してください。"
        )

    api_key = os.getenv("GOOGLE_API_KEY")
    run_expert_pipeline(comments_path, knowledge_path, output_path, api_key=api_key)


if __name__ == "__main__":
    main()
