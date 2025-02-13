import { siteTitle } from "@/app/metadata";
import styles from "./process.module.css";
import CustomLink from "@/app/components/CustomLink";
import { metadata as LinearAlgebraMetadata } from "@/app/linear_algebra/metadata";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const metadata = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",

  title: `線形代数の進め方 - ${siteTitle}`,
  description: "線形代数の勉強の進め方が書かれています。",
  openGraph: {
    title: `線形代数の進め方 - ${siteTitle}`,
    description: "線形代数の勉強の進め方が書かれています。",
    url: "https://jeonglabo.github.io/nextjs/process",
    images: [
      {
        url: `${basePath}/icon.png`,
        alt: "本サイトのアイコン",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `線形代数の進め方 - ${siteTitle}`,
    description: "線形代数の勉強の進め方が書かれています。",
    images: [`${basePath}/icon.png`],
  },
};

export default function Page() {
  return (
    <>
      <div style={{ marginTop: "2rem" }}>
        <h1 className="title">線形代数の勉強の進め方</h1>
      </div>
      <div className="lastUpdated">最終更新日: 2025/02/13</div>

      <h2 className="caption">行列の基礎</h2>
      <div className={styles.topicsContainer}>
        <div className={styles.topicSection}>
          <div className={`${styles.difficultyLabel} ${styles.easy}`}>初級</div>
          <details>
            <summary>行列の基本概念</summary>
            <br />
            <CustomLink
              href="/linear_algebra/matrix"
              imageUrl={`${basePath}/linear_algebra/matrix/thumb.png`}
              altText="行列ページのサムネ"
              siteName={LinearAlgebraMetadata.matrix.title}
              description={LinearAlgebraMetadata.matrix.description}
            />
            <br />
            <CustomLink
              href="/linear_algebra/matrix_ope"
              imageUrl={`${basePath}/linear_algebra/matrix_ope/thumb.png`}
              altText="行列の演算ページのサムネ"
              siteName={LinearAlgebraMetadata.matrix_ope.title}
              description={LinearAlgebraMetadata.matrix_ope.description}
            />
            <br />
            <CustomLink
              href="/linear_algebra/eq_matrix"
              imageUrl={`${basePath}/linear_algebra/eq_matrix/thumb.png`}
              altText="連立方程式の行列表現ページのサムネ"
              siteName={LinearAlgebraMetadata.eq_matrix.title}
              description={LinearAlgebraMetadata.eq_matrix.description}
            />
            <br />
          </details>
        </div>

        <div className={styles.topicSection}>
          <div className={`${styles.difficultyLabel} ${styles.intermediate}`}>
            中級
          </div>
          <details>
            <summary>行列の性質と計算</summary>
            <br />
            <CustomLink
              href="/linear_algebra/determinant"
              imageUrl={`${basePath}/linear_algebra/determinant/thumb.png`}
              altText="行列式ページのサムネ"
              siteName={LinearAlgebraMetadata.determinant.title}
              description={LinearAlgebraMetadata.determinant.description}
            />
            <br />
            <CustomLink
              href="/linear_algebra/inverse_matrix"
              imageUrl={`${basePath}/linear_algebra/inverse_matrix/thumb.png`}
              altText="逆行列ページのサムネ"
              siteName={LinearAlgebraMetadata.inverse_matrix.title}
              description={LinearAlgebraMetadata.inverse_matrix.description}
            />
            <br />
            <CustomLink
              href="/linear_algebra/matrix_rank"
              imageUrl={`${basePath}/linear_algebra/matrix_rank/thumb.png`}
              altText="行列のランクページのサムネ"
              siteName={LinearAlgebraMetadata.matrix_rank.title}
              description={LinearAlgebraMetadata.matrix_rank.description}
            />
            <br />
          </details>
        </div>

        <div className={styles.topicSection}>
          <div className={`${styles.difficultyLabel} ${styles.advanced}`}>
            上級
          </div>
          <details>
            <summary>行列の応用計算</summary>
            <br />
            <CustomLink
              href="/linear_algebra/gauss_jordan_elimination"
              imageUrl={`${basePath}/linear_algebra/gauss_jordan_elimination/thumb.png`}
              altText="ガウス・ジョルダン消去法ページのサムネ"
              siteName={LinearAlgebraMetadata.gauss_jordan_elimination.title}
              description={
                LinearAlgebraMetadata.gauss_jordan_elimination.description
              }
            />
            <br />
            <CustomLink
              href="/linear_algebra/cofactor_matrix"
              imageUrl={`${basePath}/linear_algebra/cofactor_matrix/thumb.png`}
              altText="余因子行列と余因子展開ページのサムネ"
              siteName={LinearAlgebraMetadata.cofactor_matrix.title}
              description={LinearAlgebraMetadata.cofactor_matrix.description}
            />
            <br />
          </details>
        </div>
      </div>

      <h2 className="caption">ベクトルと線形空間の基礎</h2>
      <div className={styles.topicsContainer}>
        <div className={styles.topicSection}>
          <div className={`${styles.difficultyLabel} ${styles.easy}`}>初級</div>
          <details>
            <summary>ベクトルの基本操作</summary>
            <br />
            <CustomLink
              href="/linear_algebra/vector"
              imageUrl={`${basePath}/linear_algebra/vector/thumb.png`}
              altText="ベクトルの演算ページのサムネ"
              siteName={LinearAlgebraMetadata.vector.title}
              description={LinearAlgebraMetadata.vector.description}
            />
            <br />
            <CustomLink
              href="/linear_algebra/norm"
              imageUrl={`${basePath}/linear_algebra/norm/thumb.png`}
              altText="ベクトルのノルムページのサムネ"
              siteName={LinearAlgebraMetadata.norm.title}
              description={LinearAlgebraMetadata.norm.description}
            />
            <br />
            <CustomLink
              href="/linear_algebra/dotproduct"
              imageUrl={`${basePath}/linear_algebra/dotproduct/thumb.png`}
              altText="内積とはページのサムネ"
              siteName={LinearAlgebraMetadata.dotproduct.title}
              description={LinearAlgebraMetadata.dotproduct.description}
            />
            <br />
            <CustomLink
              href="/linear_algebra/crossproduct"
              imageUrl={`${basePath}/linear_algebra/crossproduct/thumb.png`}
              altText="外積とはページのサムネ"
              siteName={LinearAlgebraMetadata.crossproduct.title}
              description={LinearAlgebraMetadata.crossproduct.description}
            />
            <br />
          </details>
        </div>

        <div className={styles.topicSection}>
          <div className={`${styles.difficultyLabel} ${styles.intermediate}`}>
            中級
          </div>
          <details>
            <summary>線形空間の基礎概念</summary>
            <br />
            <CustomLink
              href="/linear_algebra/basis"
              imageUrl={`${basePath}/linear_algebra/basis/thumb.png`}
              altText="基底ページのサムネ"
              siteName={LinearAlgebraMetadata.basis.title}
              description={LinearAlgebraMetadata.basis.description}
            />
            <br />
            <CustomLink
              href="/linear_algebra/linear_combination"
              imageUrl={`${basePath}/linear_algebra/linear_combination/thumb.png`}
              altText="線型結合ページのサムネ"
              siteName={LinearAlgebraMetadata.linear_combination.title}
              description={LinearAlgebraMetadata.linear_combination.description}
            />
            <br />
            <CustomLink
              href="/linear_algebra/lin_indep"
              imageUrl={`${basePath}/linear_algebra/lin_indep/thumb.png`}
              altText="線形独立と線形従属ページのサムネ"
              siteName={LinearAlgebraMetadata.lin_indep.title}
              description={LinearAlgebraMetadata.lin_indep.description}
            />
            <br />
          </details>
        </div>
      </div>

      <h2 className="caption">直交化と基底変換</h2>
      <div className={styles.topicsContainer}>
        <div className={styles.topicSection}>
          <div className={`${styles.difficultyLabel} ${styles.advanced}`}>
            上級
          </div>
          <details>
            <summary>直交化の理論と応用</summary>
            <br />
            <CustomLink
              href="/linear_algebra/gram_schmidt"
              imageUrl={`${basePath}/linear_algebra/gram_schmidt/thumb.png`}
              altText="グラム・シュミットの直交化法ページのサムネ"
              siteName={LinearAlgebraMetadata.gram_schmidt.title}
              description={LinearAlgebraMetadata.gram_schmidt.description}
            />
            <br />
          </details>
        </div>
      </div>

      <h2 className="caption">行列の固有値と対角化</h2>
      <div className={styles.topicsContainer}>
        <div className={styles.topicSection}>
          <div className={`${styles.difficultyLabel} ${styles.intermediate}`}>
            中級
          </div>
          <details>
            <summary>固有値の基礎</summary>
            <br />
            <CustomLink
              href="/linear_algebra/eigen_solve"
              imageUrl={`${basePath}/linear_algebra/eigen_solve/thumb.png`}
              altText="固有値と固有ベクトルの求め方ページのサムネ"
              siteName={LinearAlgebraMetadata.eigen_solve.title}
              description={LinearAlgebraMetadata.eigen_solve.description}
            />
            <br />
            <CustomLink
              href="/linear_algebra/eigen_property"
              imageUrl={`${basePath}/linear_algebra/eigen_property/thumb.png`}
              altText="固有値と固有ベクトルの性質ページのサムネ"
              siteName={LinearAlgebraMetadata.eigen_property.title}
              description={LinearAlgebraMetadata.eigen_property.description}
            />
            <br />
          </details>
        </div>

        <div className={styles.topicSection}>
          <div className={`${styles.difficultyLabel} ${styles.advanced}`}>
            上級
          </div>
          <details>
            <summary>対角化と応用</summary>
            <br />
            <CustomLink
              href="/linear_algebra/diagonalization"
              imageUrl={`${basePath}/linear_algebra/diagonalization/thumb.png`}
              altText="行列の対角化ページのサムネ"
              siteName={LinearAlgebraMetadata.diagonalization.title}
              description={LinearAlgebraMetadata.diagonalization.description}
            />
            <br />
            <CustomLink
              href="/linear_algebra/eigen_decomposition"
              imageUrl={`${basePath}/linear_algebra/eigen_decomposition/thumb.png`}
              altText="固有値分解ページのサムネ"
              siteName={LinearAlgebraMetadata.eigen_decomposition.title}
              description={
                LinearAlgebraMetadata.eigen_decomposition.description
              }
            />
            <br />
            <CustomLink
              href="/linear_algebra/eigen_decomposition_trans"
              imageUrl={`${basePath}/linear_algebra/eigen_decomposition_trans/thumb.png`}
              altText="固有値分解と信号の変換ページのサムネ"
              siteName={LinearAlgebraMetadata.eigen_decomposition_trans.title}
              description={
                LinearAlgebraMetadata.eigen_decomposition_trans.description
              }
            />
            <br />
          </details>
        </div>
      </div>

      <h2 className="caption">行列分解の応用</h2>
      <div className={styles.topicsContainer}>
        <div className={styles.topicSection}>
          <div className={`${styles.difficultyLabel} ${styles.advanced}`}>
            上級
          </div>
          <details>
            <summary>様々な行列分解</summary>
            <br />
            <CustomLink
              href="/linear_algebra/lu_decomposition"
              imageUrl={`${basePath}/linear_algebra/lu_decomposition/thumb.png`}
              altText="LU分解ページのサムネ"
              siteName={LinearAlgebraMetadata.lu_decomposition.title}
              description={LinearAlgebraMetadata.lu_decomposition.description}
            />
            <br />
            <CustomLink
              href="/linear_algebra/qr_decomposition"
              imageUrl={`${basePath}/linear_algebra/qr_decomposition/thumb.png`}
              altText="QR分解ページのサムネ"
              siteName={LinearAlgebraMetadata.qr_decomposition.title}
              description={LinearAlgebraMetadata.qr_decomposition.description}
            />
            <br />
            <CustomLink
              href="/linear_algebra/singular_value_decomposition"
              imageUrl={`${basePath}/linear_algebra/singular_value_decomposition/thumb.png`}
              altText="特異値分解ページのサムネ"
              siteName={
                LinearAlgebraMetadata.singular_value_decomposition.title
              }
              description={
                LinearAlgebraMetadata.singular_value_decomposition.description
              }
            />
            <br />
            <CustomLink
              href="/linear_algebra/pseudoinverse"
              imageUrl={`${basePath}/linear_algebra/pseudoinverse/thumb.png`}
              altText="疑似逆行列ページのサムネ"
              siteName={LinearAlgebraMetadata.pseudoinverse.title}
              description={LinearAlgebraMetadata.pseudoinverse.description}
            />
            <br />
          </details>
        </div>
      </div>
    </>
  );
}
