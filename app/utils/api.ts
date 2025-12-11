// api.ts
// Google AI Studio (Gemini) を利用したチャット呼び出し
const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_CHAT_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// API呼び出し関数
export const sendChatMessage = async (message: string): Promise<string> => {
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GOOGLE_API_KEY が設定されていません。環境変数を確認してください。"
    );
  }

  try {
    const response = await fetch(`${GEMINI_CHAT_URL}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text: "あなたは工学系の専門家です。以下の質問に簡潔に答えてください。なるべく2文以内でお願いします。",
            },
          ],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: message }],
          },
        ],
        generationConfig: {
          temperature: 0.3,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API エラー: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content =
      data?.candidates?.[0]?.content?.parts
        ?.map((part: { text?: string }) => part.text ?? "")
        .join("")
        .trim() ?? "";

    if (!content) {
      throw new Error("Gemini API の応答形式が想定外です。");
    }

    return content;
  } catch (error) {
    console.error("Error fetching API:", error);
    throw new Error("Failed to fetch API response");
  }
};
