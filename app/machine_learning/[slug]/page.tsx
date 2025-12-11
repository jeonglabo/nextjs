// app/machine_learning/[slug]/page.tsx
import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import Breadcrumb from "@/app/components/Breadcrumb";
import { metadata as MachineLearningMetadata } from "@/app/machine_learning/metadata";
import GoogleForm from "@/app/components/GoogleForm";
import Image from "next/image";
import { formatDate } from "@/app/components/formatDate";
import Table from "@/app/components/Table";
import Googlecomment from "@/app/components/Googlecomment";

import fs from "fs";
import path from "path";

interface PageProps {
  params: {
    slug: string;
  };
}

// 静的に生成するパスのパラメータを定義
export async function generateStaticParams() {
  const contentsDir = path.join(process.cwd(), "app/machine_learning/contents");
  const files = fs.readdirSync(contentsDir);
  return files
    .filter((file) => file.endsWith(".tsx"))
    .map((file) => ({
      slug: file.replace(".tsx", ""),
    }));
}

export async function generateMetadata({ params }: PageProps) {
  const metaData = MachineLearningMetadata[params.slug];

  if (!metaData) {
    return {
      title: "Not Found",
      description: "Page not found",
    };
  }

  const baseUrl = "https://jeonglabo.github.io/nextjs";

  return {
    title: metaData.tabtitle,
    description: metaData.description,
    openGraph: {
      title: metaData.tabtitle,
      description: metaData.description,
      url: `${baseUrl}/machine_learning/${params.slug}`,
      images: [
        {
          url: `${baseUrl}/machine_learning/${params.slug}/thumb.png`,
          alt: metaData.description,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaData.tabtitle,
      description: metaData.description,
      images: [`${baseUrl}/machine_learning/${params.slug}/thumb.png`],
    },
  };
}

// ページコンポーネントの動的インポート例
export default async function Page(props: PageProps) {
  const { params } = props;
  const { slug } = params;
  const metaData = MachineLearningMetadata[slug];
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  if (!metaData) {
    return notFound();
  }

  let ContentComponent: ComponentType | undefined;
  try {
    ContentComponent = (await import(`../contents/${slug}`))?.default;
  } catch {
    return notFound();
  }

  if (!ContentComponent) {
    return notFound();
  }

  return (
    <>
      <div className="mainContainer">
        <Breadcrumb
          items={[
            { name: "機械学習", href: `/${metaData.topic}` },
            {
              name: metaData.title,
              href: `/${metaData.topic}/${params.slug}`,
            },
          ]}
        />

        <Image
          src={`${basePath}/${metaData.topic}/${params.slug}/thumb.png`}
          alt={metaData.title}
          width={100}
          height={50}
          className="thumbpage"
        />
        <hr />
        <h1 className="title">{metaData.title}</h1>

        <div className="lastUpdated">
          最終更新日: {formatDate(metaData.lastUpdated)}
        </div>
        <p>{metaData.description}</p>

        <Table />

        {/* ページコンテンツ */}
        <ContentComponent />
        <hr />
        <div style={{ margin: "5px" }}>
          <h2 className="commentform">コメントフォーム</h2>
          <div style={{ margin: "0px 10px" }}>
            <GoogleForm
              currentPath={`/machine_learning/${params.slug}`}
              underComment={true}
            />
          </div>
        </div>
        <hr />
        <Googlecomment />
        <div style={{ textAlign: "right", marginRight: "30px" }}>
          <a href="#">ページトップに戻る</a>
        </div>
      </div>
    </>
  );
}
