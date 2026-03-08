# knowledge ディレクトリ

Web 上の固有値関連資料を取得・整形して、更新用の参照 DB を作るための領域です。

## 使い方
1. `urls.txt` に参照したい URL を列挙（1行1URL、コメント行は `#` で開始）。
2. ページ単位 DB を作る場合:
   `python experiments/eigen_update/knowledge/build_knowledge_pages.py`
3. 生成物:
   `knowledge/db/knowledge_pages.jsonl` / `knowledge/db/pages_index.json`
4. チャンク単位 DB を作る場合:
   `python experiments/eigen_update/knowledge/build_knowledge_db.py`
5. 生成物:
   `knowledge/db/knowledge_chunks.jsonl` / `knowledge/db/index.json`
6. 埋め込み DB を作る場合（`GOOGLE_API_KEY` 必須）:
   `python experiments/eigen_update/knowledge/build_knowledge_embeddings.py`
7. 生成物:
   `knowledge/db/knowledge_embeddings.json` / `knowledge/db/embeddings_index.json`

## 環境変数

- `GOOGLE_API_KEY`: `build_knowledge_embeddings.py` 実行時に必須
- `ALLOW_INSECURE_SSL`: SSL 検証を緩和する必要がある環境のみ `1`（通常 `0`）

## 注意
- 著作権や利用規約に配慮し、公開可能な範囲のテキストのみ使用してください。
- 取得したテキストは引用として使う想定です。必要に応じて要約や短文化を行ってください。
