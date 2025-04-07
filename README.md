# ユーザフィードバックに基づく ​ アクティブ AI 教材システムの開発

## 概要

このプロジェクトは、卒業論文「ユーザフィードバックに基づく ​ アクティブ AI 教材システムの開発」の一環として開発された教育支援システムです。ユーザーの学習状況やフィードバックに基づいて、AI が最適な学習コンテンツを提供する仕組みを実装しています。

### 主な機能

- インタラクティブな学習体験
- ユーザーフィードバックに基づくコンテンツ最適化
- 線形代数などの数学学習コンテンツ
- サイト内検索機能

## デモ

作成したサイトは以下の URL でアクセスできます：  
[https://jeonglabo.github.io/nextjs/](https://jeonglabo.github.io/nextjs/)

## 技術スタック

- **フレームワーク**: Next.js
- **言語**: TypeScript, JavaScript
- **スタイリング**: CSS
- **デプロイ**: GitHub Pages

## セットアップ方法

### 必要条件

- Node.js (バージョン 14 以上)
- npm または yarn

### インストール手順

1. リポジトリをクローン

   ```bash
   git clone https://github.com/jeonglabo/nextjs.git
   cd nextjs
   ```

2. 依存関係のインストール

   ```bash
   npm install
   # または
   yarn install
   ```

3. 開発サーバーの起動
   ```bash
   npm run dev
   # または
   yarn dev
   ```
   ブラウザで `http://localhost:3000` を開くと、アプリケーションにアクセスできます。

## プロジェクト構成

```
nextjs/
├── app/             # アプリケーションコード
│   ├── components/  # 再利用可能なコンポーネント
│   ├── pages/       # ページコンポーネント
│   └── styles/      # スタイルシート
├── public/          # 静的ファイル
├── scripts/         # 自動更新システムプログラム
└── README.md        # このファイル
```

## 保守運用方法

### 新しいディレクトリを作成したいとき

詳細は以下の README を参照してください：  
[新しいディレクトリを作成する方法](app/README.md)

### 新しいページを作成したいとき

詳細は以下の README を参照してください：  
[新しいページを作成する方法](app/README.md)

### デプロイ方法

このプロジェクトは GitHub Pages を使用して自動デプロイされます。`main`ブランチにプッシュすると、GitHub Actions を通じて自動的にデプロイされます。

## 貢献方法

1. このリポジトリをフォークする
2. 新しいブランチを作成する (`git checkout -b feature/amazing-feature`)
3. 変更をコミットする (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュする (`git push origin feature/amazing-feature`)
5. プルリクエストを作成する

## ライセンス

このプロジェクトは卒業論文の成果物であり、論文に記載した実験結果の再現性を担保する目的で公開されています。

## 自動更新機能

自動更新については以下の README を参照してください:
[プログラムについて](scripts/README.md)
