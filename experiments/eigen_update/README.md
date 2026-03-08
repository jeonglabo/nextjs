# experiments/eigen_update

固有値ページ（`eigen_solve` / `eigen_property`）向けに、コメントから更新パッチを生成する実験ディレクトリです。  
汎用版（テンプレ型）と専門版（外部知識参照型）を比較できます。

## 1. 主要ファイル（最小セット）

実行時に主に触るファイルだけを記載します。

### 入力

- `comment_sets/generated/sample_comments.json`: 実験入力コメント
- `knowledge/urls.txt`: 参照先 URL 一覧

### パイプライン

- `pipeline/run_generic.py`: 汎用版パッチ生成
- `pipeline/run_expert.py`: 専門版（insert）パッチ生成
- `pipeline/run_replace_expert.py`: 専門版（replace）パッチ生成

### 知識 DB 生成

- `knowledge/build_knowledge_pages.py`: ページ単位 DB を生成
- `knowledge/build_knowledge_db.py`: チャンク単位 DB を生成
- `knowledge/build_knowledge_embeddings.py`: 埋め込み DB を生成（`GOOGLE_API_KEY` 必須）

### 出力

- `outputs/generic/latest.json`
- `outputs/expert/latest.json`
- `outputs/expert/latest_replace.json`

## 2. 前提条件

- Python 3.10+
- `.env.local` に `GOOGLE_API_KEY` を設定（専門版 + 埋め込み生成で必須）

必要に応じて以下をインストールしてください。

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install -U pip
pip install python-dotenv certifi
```

## 3. 実行フロー

### 3.1 入力コメントを準備

`comment_sets/generated/sample_comments.json` を編集します。

### 3.2 知識 DB を作成（専門版向け）

```bash
python experiments/eigen_update/knowledge/build_knowledge_pages.py
python experiments/eigen_update/knowledge/build_knowledge_embeddings.py
```

`build_knowledge_db.py` を使うとチャンク型 DB も作成できます。

### 3.3 パッチを生成

```bash
python experiments/eigen_update/pipeline/run_generic.py
PYTHONPATH=. python experiments/eigen_update/pipeline/run_expert.py
python experiments/eigen_update/pipeline/run_replace_expert.py
```

### 3.4 プレビュー確認

Next.js 開発サーバー起動後、以下で比較できます。

- `http://localhost:3000/experiments/eigen_update`

## 4. 出力ファイル

- 汎用版: `outputs/generic/latest.json`
- 専門版（insert）: `outputs/expert/latest.json`
- 専門版（replace）: `outputs/expert/latest_replace.json`

## 5. よくあるエラー

- `GOOGLE_API_KEY が設定されていません`:
  `.env.local` を確認し、シェルを再起動してください。
- `knowledge DB が見つかりません`:
  `build_knowledge_pages.py` または `build_knowledge_db.py` を先に実行してください。

## 6. 関連ドキュメント

- 全体引き継ぎ: `../../docs/HANDOVER.md`
- 知識 DB 作成補足: `knowledge/README.md`
