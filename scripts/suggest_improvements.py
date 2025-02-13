"""
Googleスプレッドシートからデータを取得し、各対象tsxファイルに対する
修正案（全体の要約および具体的な修正指示）をGPT API で生成するスクリプトです。
"""

import pandas as pd
import openai
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

# .env.localファイルから環境変数を読み込む
load_dotenv(".env.local")

# 環境変数から設定を取得
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
SPREADSHEET_URL = os.getenv("SPREADSHEET_URL")

if not OPENAI_API_KEY:
    raise ValueError(
        "OPENAI_API_KEYが認証できません。.env.localファイルを確認してください。"
    )
elif not SPREADSHEET_URL:
    raise ValueError(
        "SPREADSHEET_URLが設定されていません。.env.localファイルを確認してください。"
    )

# OpenAI API クライアントの初期化
client = openai.Client(api_key=OPENAI_API_KEY)


def load_and_process_spreadsheet(url):
    """Googleスプレッドシートからデータを取得し、不要な行や列を削除する"""
    try:
        dfs = pd.read_html(url, encoding="utf-8")
        df = dfs[0]

        # 列名を設定
        df.columns = [
            "No",
            "Timestamp",
            "Name",
            "Mail",
            "Comments",
            "Path",
            "Flag",
            "display",
        ]

        # 不要な行（ヘッダー情報等）を削除
        df = df.drop([0, 1, 2])

        # 必要な列のみ抽出
        df = df[["Timestamp", "Comments", "Path", "Flag"]].copy()

        # Timestamp を datetime 型に変換
        df["Timestamp"] = pd.to_datetime(
            df["Timestamp"], format="%Y/%m/%d %H:%M:%S", errors="coerce"
        )

        # Flag が "1" の行だけを対象にする
        df = df[df["Flag"] == "1"]

        # 直近3日以内のデータに絞る
        now = datetime.now()
        df = df[df["Timestamp"] > (now - timedelta(days=3))]

        return df

    except Exception as e:
        print(f"エラーが発生しました: {e}")
        return None


def get_gpt_summary_and_instructions(comments):
    """複数のコメントからGPT API を用いて要約と修正指示を取得する"""
    prompt = f"""以下は、Webページの修正案としての複数のコメントです。
これらを踏まえ、全体の要約と、対象のtsxファイルに対してどのような修正を行うべきか、具体的な指示を日本語で示してください。

---
{comments}
---

指示:"""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "あなたはフロントエンド開発の専門家です。",
                },
                {"role": "user", "content": prompt},
            ],
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"GPT APIエラー: {e}")
        return None


def main():
    print("Google Sheets からデータ取得中...")
    df = load_and_process_spreadsheet(SPREADSHEET_URL)
    if df is None or df.empty:
        print("対象データがありません。")
        return

    # 今日の日付を YYYYMMDD 形式で取得
    today = datetime.now().strftime("%Y%m%d")

    # suggestディレクトリが存在しない場合は作成
    suggest_dir = "suggest"
    os.makedirs(suggest_dir, exist_ok=True)

    # Path ごとに Comments を統合
    grouped_data = df.groupby("Path")["Comments"].apply("\n".join).to_dict()

    for file_path, comments in grouped_data.items():
        # ファイルパスに .tsx を付与（すでに付いている場合はそのまま）
        file_path = f"{file_path}.tsx" if not file_path.endswith(".tsx") else file_path
        print(f"\n---\n処理中のファイル: {file_path}")

        # パス名を抽出 (app/の後ろから次の/までの文字列)
        path_match = (
            file_path.split("app/")[-1].split("/")[0]
            if "app/" in file_path
            else "unknown"
        )

        # 保存先ディレクトリのパスを生成
        save_dir = os.path.join(suggest_dir, today, path_match)
        os.makedirs(save_dir, exist_ok=True)

        print("GPT に要約と修正指示を依頼中...")
        instructions = get_gpt_summary_and_instructions(comments)
        if not instructions:
            print("GPTの要約・指示が取得できませんでした。")
            continue

        print("\n取得した修正指示:")
        print(instructions)

        # 指示内容を保存
        base_filename = os.path.basename(file_path).replace(".tsx", ".txt")
        instructions_filename = os.path.join(save_dir, base_filename)
        try:
            with open(instructions_filename, "w", encoding="utf-8") as f:
                f.write(instructions)
            print(f"指示が保存されました: {instructions_filename}")
        except Exception as e:
            print(f"ファイル保存エラー: {e}")


if __name__ == "__main__":
    main()
