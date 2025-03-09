# それぞれのファイルの解説

## suggest_improvements.py

Google スプレッドシートからコメントを取得し、GPT API から修正案を生成します。
修正指示は「suggest」ディレクトリに保存されます。

## apply_modifications.py

「suggest」ディレクトリにある修正指示を読み込み、既存の .tsx ファイルの内容を GPT で更新します。
差分表示を行い、ユーザー確認後に変更を反映します。

# 実行方法

## config.py の設定

ルートディレクトリに.env.local (@/.env.local)に以下の２つの設定を行って下さい。(XXXXX部分を該当するものに変更して下さい)
```
SPREADSHEET_URL = "https://docs.google.com/spreadsheets/d/e/XXXXX/pubhtml"  # Googleスプレッドシートの共有リンク
OPENAI_API_KEY = "sk-XXXXX" #OpenAI API キーの設定
```

## Google スプレッドシートの設定

google フォームを設定し、そのスプレッドシートを公開する
スプレッドシートを開いて ファイル > 共有 > webに公開 でいけます。

## 実行方法

必ず本プロジェクトの**ルートディレクトリ**で実行をしてください。
(例:@/で実行をする。)
