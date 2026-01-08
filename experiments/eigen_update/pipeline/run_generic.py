"""
JSON 入力のコメントから汎用版パッチを生成し、outputs/generic/latest.json に保存する。
"""

from __future__ import annotations

import json
import os
from dataclasses import asdict
from datetime import datetime, timezone
from typing import List

from experiments.eigen_update.engines.generic_template import (
    CommentSample,
    build_generic_run,
)


def load_comments(path: str) -> List[CommentSample]:
    with open(path, "r", encoding="utf-8") as f:
        raw = json.load(f)
    comments: List[CommentSample] = []
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


def main() -> None:
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    input_path = os.path.join(
        base_dir, "comment_sets", "generated", "sample_comments.json"
    )
    output_dir = os.path.join(base_dir, "outputs", "generic")
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "latest.json")

    comments = load_comments(input_path)
    patches = build_generic_run(comments)

    payload = {
        "mode": "generic",
        "generatedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "sourceComments": [c.id for c in comments],
        "meta": {
            "engineVersion": "0.1-generic-template-py",
            "note": "python pipeline run",
        },
        "patches": [asdict(p) for p in patches],
    }

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    print(f"✅ パッチを保存しました: {output_path}")


if __name__ == "__main__":
    main()
