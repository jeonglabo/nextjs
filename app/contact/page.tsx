import { siteTitle } from "@/app/metadata";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const metadata = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",

  title: `お問い合わせについて - ${siteTitle}`,
  description: "お問い合わせについての概要が書かれています。",
  openGraph: {
    title: `お問い合わせについて - ${siteTitle}`,
    description: "お問い合わせについての概要が書かれています。",
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
    title: `お問い合わせについて - ${siteTitle}`,
    description: "お問い合わせについての概要が書かれています。",
    images: [`${basePath}/icon.png`],
  },
};

export default function Page() {
  return (
    <>
      <div style={{ marginTop: "2rem" }}>
        <h1 className="title">お問い合わせについて</h1>
      </div>

      <div className="lastUpdated">最終更新日: 2025/01/22</div>

      <h2 className="caption">問い合わせ</h2>
      <p>
        本サイトに関する問い合わせは、以下のメールアドレスまでお願いいたします。
        <br />
        <br />
        XXX【at】example.com
        <br />
        (【at】を@に変更してください)
      </p>
    </>
  );
}
