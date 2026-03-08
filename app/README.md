# app ディレクトリ運用メモ

`app/` 配下の教材コンテンツを追加・更新するときの最小手順です。

## 1. 既存カテゴリに新規ページを追加する

例: 線形代数に `new_topic` ページを追加する場合

1. コンテンツ本体を追加  
   `app/linear_algebra/contents/new_topic.tsx`
2. メタデータを追加  
   `app/linear_algebra/metadata.ts` の `metadata` に `new_topic` エントリを追記
3. サムネイルを追加  
   `public/linear_algebra/new_topic/thumb.png`
4. 検索対象へ反映  
   `app/allmetadata.ts` に該当カテゴリの metadata が含まれていることを確認

補足:

- 一覧ページ（`/linear_algebra` など）は `metadata.ts` のキーを元に自動表示されます。
- 動的ページは `app/<category>/[slug]/page.tsx` が `contents/*.tsx` を自動で読み込みます。

## 2. 新しいカテゴリを追加する

例: `new_category` を追加する場合

1. ディレクトリ作成  
   `app/new_category/contents/`
2. 一覧ページ作成  
   `app/new_category/page.tsx`
3. スラッグページ作成  
   `app/new_category/[slug]/page.tsx`
4. メタデータ作成  
   `app/new_category/metadata.ts`
5. ホームカード追加  
   `app/page.tsx` の `mockData` にカテゴリカードを追加
6. 検索対象追加  
   `app/allmetadata.ts` に `new_category/metadata` を import して merge

## 3. 更新時のチェック項目

- `npm run dev` でページ表示と画像パスが正しいこと
- `npm run lint` が通ること
- `NEXT_PUBLIC_BASE_PATH=/nextjs` 環境でもリンク/画像が崩れないこと
