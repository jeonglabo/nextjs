import { siteTitle } from "@/app/metadata";
import { MetadataCollection } from "@/types/metadata";

export const metadata: MetadataCollection = {
  autoencoder: {
    title: "オートエンコーダ",
    tabtitle: `オートエンコーダ - ${siteTitle}`,
    description: "オートエンコーダについて説明しています。",
    lastUpdated: "2024-12-30",
    topic: "machine_learning",
  },
  adam: {
    title: "ADAM",
    tabtitle: `ADAM - ${siteTitle}`,
    description: "最適化手法の1つであるADAMについて説明しています。",
    lastUpdated: "2025-01-05",
    topic: "machine_learning",
  },
  gradient_descent: {
    title: "勾配降下法",
    tabtitle: `勾配降下法 - ${siteTitle}`,
    description: "勾配降下法について説明しています。",
    lastUpdated: "2025-01-05",
    topic: "machine_learning",
  },
  informationentropy: {
    title: "情報エントロピー",
    tabtitle: `情報エントロピー - ${siteTitle}`,
    description: "情報エントロピーについて説明しています。",
    lastUpdated: "2025-01-06",
    topic: "machine_learning",
  },
};