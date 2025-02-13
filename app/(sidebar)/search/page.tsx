"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { metadata } from "@/app/allmetadata";
import CustomLink from "@/app/components/CustomLink";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const filteredResults = Object.entries(metadata)
    .filter(
      ([_, item]) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.keywords?.some((keyword) =>
          keyword.toLowerCase().includes(query.toLowerCase())
        ) ||
        item.description.toLowerCase().includes(query.toLowerCase())
    )
    .map(([path, item]) => ({
      path,
      ...item,
    }));

  return (
    <div style={{ margin: "1rem" }}>
      <h2>「{query}」の検索結果</h2>
      <p style={{ marginLeft: "3%" }}>検索結果: {filteredResults.length}件</p>

      {filteredResults.length > 0 ? (
        <>
          {filteredResults.map((result, index) => (
            <div key={index} className="border p-4 rounded-lg">
              <CustomLink
                href={`/${result.topic}/${result.path}`}
                imageUrl={`${basePath}/${result.topic}/${result.path}/thumb.png`}
                altText={`${result.title}のサムネイル`}
                siteName={result.title}
                description={result.description}
              />
              <br />
            </div>
          ))}
        </>
      ) : (
        <div>検索結果が見つかりませんでした。</div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResults />
    </Suspense>
  );
}
