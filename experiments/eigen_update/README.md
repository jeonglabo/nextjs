# experiments/eigen_update スケルトン

固有値ページ（`eigen_solve` / `eigen_property`）向けの新規更新機構を実験するためのスケルトンです。既存のコメント反映スクリプトや RAG チャットとは独立に動かします。

## ディレクトリ構成
- `schema.ts` … コメント・パッチ・実行結果の型定義（参考）。
- `comment_sets/seed_prompts.yaml` … カテゴリ別の生成プロンプト種（雛形）。
- `comment_sets/generated/sample_comments.json` … 少量のサンプルコメント（固定シード想定）。
- `engines/generic_template.ts` … 汎用版（専門知識なし）のテンプレ挿入ロジックのひな型（TS版）。
- `engines/generic_template.py` … 汎用版テンプレ挿入の Python 版。
- `engines/expert_update.py` … 専門版（DB参照型）の更新ロジック。
- `knowledge/` … Web から取得した知識を保存し、DB化するための領域。
- `knowledge/build_knowledge_embeddings.py` … Google AI Studio で埋め込みを作成。
- `pipeline/run_generic.py` … JSON 入力 → パッチ出力の簡易パイプライン（Python）。
- `pipeline/run_expert.py` … 知識 DB を参照したパッチ生成。
- `outputs/generic/*.json` … 汎用版で生成したパッチ例。

## 使い方（現状の手動フロー）
1. `comment_sets/generated/sample_comments.json` を編集して入力セットを決める（固定シードで増減可）。
2. 汎用版: `engines/generic_template.py` を更新し、コメント→パッチの変換ルールを調整する。
3. 専門版: `knowledge/urls.txt` に参照 URL を列挙し、`python experiments/eigen_update/knowledge/build_knowledge_pages.py` を実行して DB を作成する。
4. 専門版: `python experiments/eigen_update/knowledge/build_knowledge_embeddings.py` を実行して埋め込みを作成する（`GOOGLE_API_KEY` が必要）。
5. 汎用版: `python experiments/eigen_update/pipeline/run_generic.py` を実行して `outputs/generic/latest.json` を生成する。
6. 専門版: `PYTHONPATH=. python experiments/eigen_update/pipeline/run_expert.py` を実行して `outputs/expert/latest.json` を生成する。
6. 生成結果の例は `outputs/generic/sample_*.json` を参照。後続の適用やプレビューは別途 UI / スクリプトを実装予定。

## TODO
- Python パイプラインの拡張（入力/出力の引数化、エラーハンドリング強化）。
- 専門版の抽出ロジック（引用抽出の精度改善、章別インデックス）。
- 専門版（外部知識あり）の `expert_update.ts` と、軽量ベクトル検索のユーティリティを追加。
- プレビュー UI を `app/experiments/eigen_update/Preview.tsx` として作成し、元コンテンツとの並列比較を可視化。
