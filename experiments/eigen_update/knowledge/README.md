# knowledge ディレクトリ

Web 上の固有値関連資料を取得・整形して、更新用の参照 DB を作るための領域です。

## 使い方
1. `urls.txt` に参照したい URL を列挙（1行1URL、コメント行は `#` で開始）。
2. ページ単位で取得する場合は `python experiments/eigen_update/knowledge/build_knowledge_pages.py` を実行。
3. `knowledge/db/knowledge_pages.jsonl` が生成されます。
4. チャンク分割を行う場合は `python experiments/eigen_update/knowledge/build_knowledge_db.py` を実行。

## 注意
- 著作権や利用規約に配慮し、公開可能な範囲のテキストのみ使用してください。
- 取得したテキストは引用として使う想定です。必要に応じて要約や短文化を行ってください。
