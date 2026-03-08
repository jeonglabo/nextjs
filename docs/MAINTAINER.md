# 運用者向けメモ

このドキュメントは、教授・メンテナなど運用担当者向けの手順をまとめたものです。

## 1. GitHub 招待手順（`@jeongmanyong`）

1. GitHub で Organization `jeonglabo` を開く
2. `People` -> `Invite member` を開く
3. 招待する学生の GitHub ID またはメールアドレスを入力して招待を送る
4. 必要に応じて `Teams` に追加する、または `jeonglabo/nextjs` に直接アクセス権を付与する
5. 権限は原則 `Write`（管理者以外は `Admin` を付与しない）
6. 学生が招待承認後、`jeonglabo/nextjs` の clone/push ができることを確認する

補足:

- Organization 側で SSO や 2FA 必須設定がある場合は、学生側で有効化が必要
- 招待期限切れ時は再送する

## 2. ドキュメント更新ルール

- 運用手順を変更したら、`README.md` と `docs/HANDOVER.md` を同時更新する
- 新しい環境変数を追加したら `.env.local.example` を更新する
- 新しい定期作業が増えたら `docs/HANDOVER.md` の「運用フロー」に追記する
