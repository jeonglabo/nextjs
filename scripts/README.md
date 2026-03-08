# scripts ディレクトリ

Google フォーム由来のコメントを集約し、教材ページ（`.tsx`）の改善提案を生成・反映するためのスクリプト群です。

## 1. ファイル概要

### `suggest_improvements.py`

- Google スプレッドシートを読み込み、コメントを集約
- OpenAI API で修正指示を生成
- 出力先: `suggest/YYYYMMDD/<directory>/*.txt`

### `apply_modifications.py`

- `suggest/` 配下の最新指示を読み込み
- 対象 `.tsx` の差分を生成
- `Y/N` 確認後にファイル更新し、`metadata.ts` の `lastUpdated` も更新

## 2. 事前準備

### 2.1 Python 依存関係

プロジェクトルートで実行してください。

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install -U pip
pip install python-dotenv pandas openai
```

### 2.2 環境変数（`.env.local`）

`config.py` は使用しません。  
以下をルートの `.env.local` に設定してください。

```dotenv
OPENAI_API_KEY=sk-xxxxx
SPREADSHEET_URL=https://docs.google.com/spreadsheets/d/e/xxxxx/pubhtml
```

### 2.3 Google スプレッドシート側の設定

- Google フォームの回答先スプレッドシートを用意
- スプレッドシートを「ファイル -> 共有 -> ウェブに公開」で公開
- 公開 URL を `SPREADSHEET_URL` に設定

## 3. 実行手順

### 3.1 修正指示の生成

```bash
python scripts/suggest_improvements.py
```

### 3.2 修正内容の反映

```bash
python scripts/apply_modifications.py
```

確認プロンプトで `Y` を選んだ変更のみ反映されます。

## 4. 注意事項

- 実行は必ずプロジェクトルート（`nextjs/`）で行ってください。
- API キーやスプレッドシート URL は Git にコミットしないでください。
