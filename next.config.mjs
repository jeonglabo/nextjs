/** @type {import('next').NextConfig} */
const isStaticExport = process.env.STATIC_EXPORT === "true";

// STATIC_EXPORT を true にした場合は静的書き出し用の設定を有効化する。
// RAG API など動的機能を使うときは環境変数を指定せずに通常の実行にする。
const nextConfig = {
  ...(isStaticExport ? { output: "export" } : {}),
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
