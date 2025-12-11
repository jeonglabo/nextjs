# コードレビュー

## スコープ
- Next.js の app ディレクトリ（linear_algebra/machine_learning の詳細ページ、問い合わせページ、OpenAI 連携ユーティリティ）を中心に確認。

## 指摘事項
- 【高】app/(sidebar)/contact/page.tsx: 静的ページにもかかわらず params を Promise 前提で参照し、GoogleForm の currentPath が undefined になり得るほか、OGP URL が /policy のまま。不要な async/await も残っており静的 export 時の見通しが悪い。
- 【高】app/linear_algebra/[slug]/page.tsx と app/machine_learning/[slug]/page.tsx: params を Promise 型として扱っており Next.js の props 形と乖離。存在しない slug でも metaData 参照が先に走るため notFound に到達する前にランタイムエラーになり得る。動的 import 失敗時も 500 になってしまう。
- 【中】app/utils/api.ts: API キーの存在チェックがモジュール読み込み時に走るため、キー未設定環境だとコンポーネント import だけでクラッシュする。エラーメッセージも REACT_APP_* を指しており誤誘導。呼び出しごとに検証し、レスポンス構造も確認する形にしたい。

## 今回の対応方針
- 問い合わせページを静的な props 受け取りに戻し、OGP URL と GoogleForm の送信先パスを固定値に修正する。
- 両方の [slug] ページで params 型とエラーハンドリングを整備し、metaData 不在や import 失敗時に確実に notFound を返す。
- OpenAI 連携ユーティリティはモジュールロードで落ちないようにし、キー検証とレスポンスチェックを sendChatMessage 内にまとめる。
