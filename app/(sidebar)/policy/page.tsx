import { siteTitle } from "@/app/metadata";
import Link from "next/link";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const metadata = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",

  title: `本サイトについて - ${siteTitle}`,
  description: "本サイトの概要が書かれています。",
  openGraph: {
    title: `本サイトについて - ${siteTitle}`,
    description: "本サイトについての概要が書かれています。",
    url: "https://jeonglabo.github.io/nextjs/policy",
    images: [
      {
        url: `${basePath}/icon.png`,
        alt: "本サイトのアイコン",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `本サイトについて - ${siteTitle}`,
    description: "本サイトについての概要が書かれています。",
    images: [`${basePath}/icon.png`],
  },
};

export default function Page() {
  return (
    <>
      <div style={{ marginTop: "2rem" }}>
        <h1 className="title">本サイトについて</h1>
      </div>

      <div className="lastUpdated">最終更新日: 2025/02/13</div>

      <h2 className="caption">掲載内容について</h2>
      <p>
        本サイトは、機械学習、データ分析、プログラミング、数学、物理学などの技術に関する情報を提供する目的で運営しています。
      </p>
      <p>本サイトは、生成AIを使用して内容を作成しています。</p>
      <p>
        また、本サイトは投稿されたコメントをAIで学習し、定期的に内容を更新します（現在開発中）。
      </p>

      <h2 className="caption">頂いたコメントについて</h2>
      <p>
        ご投稿いただいたコメントはAIの学習に使用される場合があります。
        <br />
        本サイトの管理者または運営者が不適切と判断したコメントは、予告なく削除することがあります。
      </p>

      <h2 className="caption">推奨環境</h2>
      <p>本サイトは、以下のブラウザでの閲覧を推奨しています。</p>
      <ul>
        <li>Google Chrome</li>
        <li>Firefox</li>
        <li>Microsoft Edge</li>
      </ul>
      <p>
        また、本サイトはパソコンでの閲覧を前提としているため、スマートフォンやタブレットでは適切に表示されない可能性があります。
      </p>

      <h2 className="caption">問い合わせ</h2>
      <p>本サイトに関する問い合わせは、以下のページをご覧ください。</p>
      <p>
        <Link href="/contact">お問い合わせ</Link>
      </p>
    </>
  );
}
