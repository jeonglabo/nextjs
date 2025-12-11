import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { metadata as linearMetadata } from "@/app/linear_algebra/metadata";
import { metadata as machineMetadata } from "@/app/machine_learning/metadata";

// 静的書き出しを回避し、実行時に処理する
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// RAGで扱うページ情報
type RawDocument = {
  id: string;
  topic: string;
  slug: string;
  title: string;
  description: string;
  text: string;
  keywords: string[];
};

type EmbeddedDocument = RawDocument & {
  embedding: number[];
};

type ScoredDoc = {
  doc: EmbeddedDocument;
  embedScore: number;
  keywordScore: number;
  totalScore: number;
  tokenHits: number;
  synonymHits: number;
};

class ChatApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

let cachedDocuments: EmbeddedDocument[] | null = null;
let loadingPromise: Promise<EmbeddedDocument[]> | null = null;

// JSXをざっくりテキストにする簡易パーサー
function extractTextFromTsx(content: string): string {
  const withoutImports = content.replace(/import[^\n;]+;?/g, " ");
  const withoutComments = withoutImports
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/\/\/.*$/gm, " ");
  const mathExtracted = withoutComments.replace(/math="([^"]+)"/g, "$1");
  const withoutTags = mathExtracted.replace(/<[^>]+>/g, " ");
  const withoutBraces = withoutTags.replace(/[{}\[\]]/g, " ");
  return withoutBraces.replace(/\s+/g, " ").trim();
}

function loadRawDocuments(): RawDocument[] {
  const roots = [
    {
      topic: "linear_algebra",
      dir: path.join(process.cwd(), "app/linear_algebra/contents"),
      meta: linearMetadata,
    },
    {
      topic: "machine_learning",
      dir: path.join(process.cwd(), "app/machine_learning/contents"),
      meta: machineMetadata,
    },
  ];

  const docs: RawDocument[] = [];

  roots.forEach(({ topic, dir, meta }) => {
    if (!fs.existsSync(dir)) return;

    fs.readdirSync(dir)
      .filter((file) => file.endsWith(".tsx"))
      .forEach((file) => {
        const slug = file.replace(".tsx", "");
        const fullPath = path.join(dir, file);
        const rawContent = fs.readFileSync(fullPath, "utf8");
        const cleaned = extractTextFromTsx(rawContent).slice(0, 4000);
        const metaData = meta[slug];

        docs.push({
          id: `${topic}/${slug}`,
          topic,
          slug,
          title: metaData?.title ?? slug,
          description: metaData?.description ?? "",
          keywords: metaData?.keywords ?? [],
          text: `${metaData?.title ?? ""} ${metaData?.description ?? ""} ${cleaned}`,
        });
      });
  });

  return docs;
}

async function fetchEmbeddings(
  apiKey: string,
  inputs: string[]
): Promise<number[][]> {
  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:batchEmbedContents?key=" +
      apiKey,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requests: inputs.map((text) => ({
          model: "models/text-embedding-004",
          content: {
            parts: [{ text }],
          },
        })),
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Embedding API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  if (!data.embeddings || !Array.isArray(data.embeddings)) {
    throw new Error("Embedding API response is invalid.");
  }

  return data.embeddings.map(
    (item: { values: number[] }) => item.values ?? []
  );
}

async function prepareDocuments(apiKey: string): Promise<EmbeddedDocument[]> {
  const docs = loadRawDocuments();
  if (docs.length === 0) {
    throw new Error("対象ページが見つかりませんでした。");
  }

  const embeddings = await fetchEmbeddings(
    apiKey,
    docs.map((doc) => doc.text)
  );

  return docs.map((doc, idx) => ({
    ...doc,
    embedding: embeddings[idx],
  }));
}

async function getEmbeddedDocuments(apiKey: string): Promise<EmbeddedDocument[]> {
  if (cachedDocuments) return cachedDocuments;
  if (!loadingPromise) {
    loadingPromise = prepareDocuments(apiKey).then((docs) => {
      cachedDocuments = docs;
      return docs;
    });
  }
  return loadingPromise;
}

function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, val, idx) => sum + val * b[idx], 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  if (normA === 0 || normB === 0) return 0;
  return dot / (normA * normB);
}

async function createAnswer(
  apiKey: string,
  question: string,
  context: string
): Promise<string> {
  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
      apiKey,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text: "あなたは学習サイトのAIアシスタントです。以下のコンテキストはサイト内ページの内容から抽出したものです。コンテキストに基づき、日本語で簡潔に回答してください。わからない場合は「手元のページでは見つかりませんでした」と伝えてください。",
            },
          ],
        },
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `ユーザーの質問: ${question}\n\n参照コンテキスト:\n${context}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
        },
      }),
    }
  );

  if (!response.ok) {
    const rawText = await response.text();
    let apiMessage = rawText;
    try {
      const parsed = JSON.parse(rawText);
      apiMessage =
        parsed?.error?.message ??
        parsed?.error ??
        parsed?.message ??
        rawText;
    } catch {
      // 無視して生テキストを使う
    }

    const friendlyMessage =
      response.status === 429
        ? "外部APIの利用上限に達しました。しばらく待ってから再度お試しください。"
        : `外部APIエラー(${response.status}): ${apiMessage}`;

    throw new ChatApiError(response.status, friendlyMessage);
  }

  const data = await response.json();
  const content =
    data?.candidates?.[0]?.content?.parts
      ?.map((part: { text?: string }) => part.text ?? "")
      .join("")
      .trim() ?? "";

  if (!content) {
    throw new Error("AI応答が空でした。");
  }
  return content;
}

export async function GET(request: Request) {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GOOGLE_API_KEY が設定されていません。環境変数を確認してください。" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || !query.trim()) {
    return NextResponse.json(
      { error: "クエリが空です。質問を指定してください。" },
      { status: 400 }
    );
  }

  try {
    const documents = await getEmbeddedDocuments(apiKey);
    const [queryEmbedding] = await fetchEmbeddings(apiKey, [query]);

    const normalizedQuery = query.toLowerCase();
    const queryTokens = normalizedQuery
      .split(/[\s、。,.!?！？]+/)
      .flatMap((t) => t.split(/について|とは|って|を|教えて/))
      .map((t) => t.trim())
      .filter(Boolean);

    const synonymMap: Record<string, string[]> = {
      内積: ["内積", "ドット積", "スカラー積", "dot product", "inner product"],
      外積: ["外積", "クロス積", "ベクトル積", "cross product"],
    };

    const expandedTerms = new Set<string>([
      normalizedQuery,
      ...queryTokens.map((t) => t.toLowerCase()),
    ]);
    queryTokens.forEach((token) => {
      const syns = synonymMap[token] || [];
      syns.forEach((s) => expandedTerms.add(s.toLowerCase()));
    });

    const keywordResults = documents.map((doc) => {
      const haystack = [
        doc.title,
        doc.description,
        doc.slug,
        doc.keywords.join(" "),
        doc.text.slice(0, 1200),
      ]
        .join(" ")
        .toLowerCase();

      const tokenHits =
        doc.keywords.filter((kw) => {
          const lowerKw = kw.toLowerCase();
          return (
            expandedTerms.has(lowerKw) ||
            normalizedQuery.includes(lowerKw) ||
            haystack.includes(lowerKw)
          );
        }).length +
        queryTokens.filter((t) => haystack.includes(t)).length;

      const synonymHits = 0;

      return { doc, tokenHits, synonymHits, haystack };
    });

    const hasKeywordHit = keywordResults.some(
      ({ tokenHits, synonymHits }) => tokenHits > 0 || synonymHits > 0
    );

    const candidates = hasKeywordHit
      ? keywordResults.filter(
          ({ tokenHits, synonymHits }) => tokenHits > 0 || synonymHits > 0
        )
      : keywordResults;

    const scored: ScoredDoc[] = candidates
      .map(({ doc, tokenHits, synonymHits }) => {
        const embedScore = cosineSimilarity(queryEmbedding, doc.embedding);
        const keywordScore = tokenHits * 1.2 + synonymHits * 0.8;
        const totalScore = embedScore + keywordScore;
        return {
          doc,
          embedScore,
          keywordScore,
          totalScore,
          tokenHits,
          synonymHits,
        };
      })
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 5);

    // スコアが近く、類似ページが複数上がるのを防ぐために slug 単位で重複排除
    const seenSlug = new Set<string>();
    const deduped = scored.filter((item) => {
      if (seenSlug.has(item.doc.slug)) return false;
      seenSlug.add(item.doc.slug);
      return true;
    });

    const minScore = 0.2;
    const filtered = deduped.filter((item) => item.totalScore >= minScore);
    const finalList = filtered.length > 0 ? filtered : deduped;

    const context = finalList
      .map(
        ({ doc }) =>
          `タイトル: ${doc.title}\nパス: /${doc.topic}/${doc.slug}\n内容: ${doc.text.slice(
            0,
            1400
          )}`
      )
      .join("\n---\n");

    const answer =
      filtered.length === 0
        ? "手元のページでは十分なスコアのものが見つかりませんでした。別のキーワードでお試しください。"
        : await createAnswer(apiKey, query, context);

    return NextResponse.json({
      answer,
      sources: finalList.map((item) => ({
        title: item.doc.title,
        path: `/${item.doc.topic}/${item.doc.slug}`,
        description: item.doc.description,
        score: Number(item.totalScore.toFixed(4)),
      })),
    });
  } catch (error) {
    console.error("RAG API error:", error);
    if (error instanceof ChatApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json(
      { error: "回答生成に失敗しました。" },
      { status: 500 }
    );
  }
}
