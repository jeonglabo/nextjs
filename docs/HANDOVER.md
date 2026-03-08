# 引き継ぎガイド

このドキュメントは、新しく本研究を担当する人が最短で運用を再開できるようにするための手順書です。

## 1. 初日チェックリスト

### 1.1 全員必須

- [ ] リポジトリ `jeonglabo/nextjs` にアクセスできる（clone / push / PR）。
- [ ] GitHub Pages のデプロイ結果を確認できる。
- [ ] `.env.local` を作成し、必要な API キーを設定した。
- [ ] `npm ci && npm run dev` が通る。
- [ ] `npm run lint` が通る。

### 1.2 担当者のみ（必要時）

- [ ] `experiments/eigen_update` のパイプラインを 1 回実行した。

## 2. 必要アカウントと権限

| サービス | 用途 | 必要権限 |
| --- | --- | --- |
| GitHub | コード管理、Actions、Pages | 対象リポジトリへの Write 以上 |
| Google AI Studio | Gemini 応答生成・埋め込み | `GOOGLE_API_KEY` 発行 |
| OpenAI Platform | コメント改善スクリプト | `OPENAI_API_KEY` 発行 |
| Google フォーム/スプレッドシート | フィードバック収集 | 回答シート閲覧・Web 公開設定 |

### 2.1 GitHub アクセス依頼（新規参加者向け）

この研究のリポジトリは GitHub Organization `jeonglabo` 配下にあります。  
アクセスがない場合は、研究室の教授（`@jeongmanyong`）に招待依頼してください。

依頼時に伝える内容:

- 自分の GitHub ユーザー名
- 招待先: `jeonglabo` Organization
- 必要リポジトリ: `jeonglabo/nextjs`
- 必要権限: `Write`（開発担当の場合）

招待を受け取ったら:

- GitHub の通知またはメールから Invite を承認する
- `https://github.com/jeonglabo/nextjs` が閲覧できることを確認する
- `git clone https://github.com/jeonglabo/nextjs.git` が成功することを確認する

## 3. ローカルセットアップ

### 3.1 必須ツール

- Node.js 20 系
- npm
- Python 3.10 以上

### 3.2 初期構築

```bash
git clone https://github.com/jeonglabo/nextjs.git
cd nextjs
npm ci
cp .env.local.example .env.local
```

`.env.local` の値を設定後、以下で起動確認します。

```bash
npm run dev
npm run lint
```

### 3.3 Python スクリプト実行準備

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install -U pip
pip install python-dotenv pandas openai certifi
```

## 4. GitHub 設定

管理者（教授・メンテナ）側の招待作業は [docs/MAINTAINER.md](MAINTAINER.md) を参照してください。

### 4.1 SSH 設定（推奨）

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
pbcopy < ~/.ssh/id_ed25519.pub
```

公開鍵を GitHub に登録し、`ssh -T git@github.com` で接続確認します。

### 4.2 リポジトリ設定確認

- `Settings > Pages`: `Source = GitHub Actions`
- `Actions`: `.github/workflows/nextjs.yml` が `main` push で実行される
- 保護ルール（推奨）: `main` 直 push 禁止、PR 必須、レビュー必須

## 5. 環境変数運用

`.env.local` に以下を設定します。

| 変数名 | 主な利用箇所 |
| --- | --- |
| `NEXT_PUBLIC_BASE_PATH` | Pages 配布時のベースパス（通常 `/nextjs`） |
| `STATIC_EXPORT` | 静的書き出し設定を有効化する場合に使用 |
| `GOOGLE_API_KEY` | `app/api/rag/route.ts`, `experiments/eigen_update/*` |
| `OPENAI_API_KEY` | `scripts/suggest_improvements.py`, `scripts/apply_modifications.py` |
| `SPREADSHEET_URL` | `scripts/suggest_improvements.py` |
| `ALLOW_INSECURE_SSL` | 知識収集スクリプトで SSL 検証を緩和する場合のみ使用 |

注意事項:

- API キーを README やコードに直書きしない。
- `config.py` は `.gitignore` 対象だが、ローカルに秘密情報が残る点に注意する。
- 漏えい疑いがある場合は即時ローテーションする。

## 6. 運用フロー

### 6.1 通常の開発

```bash
npm run dev
```

- `app/` 内を編集して動作確認。
- 完了後に `npm run lint`。

### 6.2 コメント反映スクリプト（`scripts/`）

```bash
python scripts/suggest_improvements.py
python scripts/apply_modifications.py
```

- 1本目で Google Sheets から修正指示を生成。
- 2本目で `.tsx` へ反映（対話確認あり）。

### 6.3 固有値ページ更新実験（`experiments/eigen_update/`）

```bash
python experiments/eigen_update/knowledge/build_knowledge_pages.py
python experiments/eigen_update/knowledge/build_knowledge_embeddings.py
python experiments/eigen_update/pipeline/run_generic.py
PYTHONPATH=. python experiments/eigen_update/pipeline/run_expert.py
python experiments/eigen_update/pipeline/run_replace_expert.py
```

生成物:

- `experiments/eigen_update/outputs/generic/latest.json`
- `experiments/eigen_update/outputs/expert/latest.json`
- `experiments/eigen_update/outputs/expert/latest_replace.json`

プレビューは `http://localhost:3000/experiments/eigen_update` で確認できます。

## 7. デプロイ

- `main` に push すると GitHub Actions が実行され、GitHub Pages に反映されます。
- Actions が失敗した場合は、まず `npm run build` をローカルで再現して原因を切り分けます。

## 8. トラブルシューティング

- `GOOGLE_API_KEY が設定されていません`:
  `.env.local` を確認し、起動中プロセスを再起動する。
- `OPENAI_API_KEYが認証できません`:
  キー期限切れ、課金上限、コピー時の空白混入を確認する。
- Pages で画像/リンクが崩れる:
  `NEXT_PUBLIC_BASE_PATH` とパス記述を確認する。
- Python 依存で ImportError:
  `.venv` を有効化し、必要パッケージを再インストールする。
