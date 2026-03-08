# ユーザフィードバックに基づくアクティブ AI 教材システムの開発

卒業研究「ユーザフィードバックに基づくアクティブ AI 教材システムの開発」の実装リポジトリです。  
Next.js で学習コンテンツを提供し、コメント収集と AI による改善提案、実験的な更新パイプラインを運用しています。

## 公開サイト

- GitHub Pages: <https://jeonglabo.github.io/nextjs/>

## ドキュメント一覧

- 引き継ぎガイド: [docs/HANDOVER.md](docs/HANDOVER.md)
- 運用者向けメモ: [docs/MAINTAINER.md](docs/MAINTAINER.md)
- 固有値ページ更新実験: [experiments/eigen_update/README.md](experiments/eigen_update/README.md)
- 自動更新スクリプト: [scripts/README.md](scripts/README.md)
- `app` ディレクトリ運用メモ: [app/README.md](app/README.md)

## クイックスタート

### 前提環境

- Node.js 20 系（GitHub Actions と同じ）
- npm
- Python 3.10 以上（`scripts/` / `experiments/` を実行する場合）

### セットアップ

```bash
git clone https://github.com/jeonglabo/nextjs.git
cd nextjs
npm ci
cp .env.local.example .env.local
```

`.env.local` を編集し、必要な API キーを設定してから起動します。

```bash
npm run dev
```

ブラウザで <http://localhost:3000> を開いて確認します。

## 技術概要

### システム全体像

このリポジトリは、主に次の 4 つの機能で構成されています。

1. 教材サイト本体（Next.js App Router）
2. コメント収集に基づく改善提案スクリプト（`scripts/`）
3. サイト内RAG API（`app/api/rag/route.ts`）
4. 固有値ページ更新の実験パイプライン（`experiments/eigen_update/`）

### データフロー（概要）

```text
学習コンテンツ（app/*/contents/*.tsx）
  ├─> Web表示（Next.js）
  ├─> RAG用テキスト化 + 埋め込み生成（Gemini Embedding API）
  │     └─> 問い合わせ応答（Gemini generateContent）
  └─> コメント改善スクリプトで改稿候補を生成（OpenAI API）

外部URL群（experiments/eigen_update/knowledge/urls.txt）
  └─> 知識DB生成 -> 埋め込み生成 -> 更新パッチ生成（generic / expert）
```

### 各機能の役割

- 教材サイト本体:
  `app/linear_algebra/contents/` と `app/machine_learning/contents/` の TSX を中心に教材ページを提供。
- コメント改善スクリプト:
  `scripts/suggest_improvements.py` が Google スプレッドシートからコメントを取得し、修正指示を生成。
  `scripts/apply_modifications.py` が対象 TSX へ反映（確認プロンプト付き）。
- サイト内RAG API:
  `app/api/rag/route.ts` が教材ページを読み取り、埋め込み検索 + キーワード補強で関連ページを抽出し、Geminiで回答生成。
- 固有値更新実験:
  `experiments/eigen_update/` で知識DB作成、埋め込み作成、更新パッチ生成、比較プレビューまでを分離実験。

## 環境変数

| 変数名 | 用途 | 必須タイミング |
| --- | --- | --- |
| `NEXT_PUBLIC_BASE_PATH` | GitHub Pages 配下でのベースパス（例: `/nextjs`） | Pages ビルド時 |
| `STATIC_EXPORT` | `true` で静的書き出し設定 (`output: "export"`) を有効化 | 手動で静的書き出しを検証する時 |
| `GOOGLE_API_KEY` | RAG API (`app/api/rag/route.ts`) と `experiments/eigen_update` の埋め込み生成 | RAG/実験実行時 |
| `OPENAI_API_KEY` | `scripts/` の改善提案・自動反映 | スクリプト実行時 |
| `SPREADSHEET_URL` | Google フォーム回答スプレッドシート公開 URL | `scripts/suggest_improvements.py` 実行時 |
| `ALLOW_INSECURE_SSL` | 知識収集スクリプトの SSL 検証を一時的に無効化 | 必要時のみ |

`.env.local.example` をテンプレートとして使ってください。秘密情報は Git にコミットしない運用です。

## よく使うコマンド

```bash
npm run dev      # 開発サーバー起動
npm run build    # 本番ビルド
npm run lint     # ESLint
```

GitHub Actions の Pages ビルド相当を手元で再現する場合は以下を利用します。

```bash
NEXT_PUBLIC_BASE_PATH=/nextjs npm run build
```

## デプロイ

GitHub Pages への公開は `.github/workflows/nextjs.yml` で自動化しています。

1. `main` への push（または `workflow_dispatch`）で workflow 起動
2. Node.js 20 で依存インストール（`npm ci`）
3. `actions/configure-pages@v5` で Next.js 向け Pages 設定
4. `NEXT_PUBLIC_BASE_PATH=/nextjs` を付与して `next build`
5. `./out` を Pages artifact としてアップロード
6. `actions/deploy-pages@v4` で公開反映

注意:

- workflow では `NEXT_PUBLIC_BASE_PATH=/nextjs` を設定してビルドします（`STATIC_EXPORT` は明示設定していません）。
- 公開先は静的ホスティングのため、`app/api/*` のような動的 API は GitHub Pages 上では実行されません。
- RAG API を使う場合はローカル実行、または Node.js 実行環境のあるホスティング先が必要です。

## ディレクトリ構成（抜粋）

```text
nextjs/
├── app/                       # Next.js App Router 本体
├── public/                    # 画像などの静的アセット
├── scripts/                   # コメント収集と自動更新スクリプト
├── experiments/eigen_update/  # 固有値ページ向け更新実験
├── notebook/                  # 検証ノートブック
└── docs/                      # 運用・引き継ぎドキュメント
```

## 引き継ぎについて

引き継ぎに必要な情報（アカウント設定、GitHub 設定、秘密情報管理、再現手順）は  
[docs/HANDOVER.md](docs/HANDOVER.md) に集約しています。新規参加者はこのドキュメントから開始してください。
