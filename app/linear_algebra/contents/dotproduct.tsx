import { metadata } from "@/app/linear_algebra/metadata";
import CenteredEquation from "@/app/components/CenteredEquation";
import { InlineMath } from "react-katex";
import ImageModal from "@/app/components/ImageModal";
import CustomLink from "@/app/components/CustomLink";

export default function PageContent() {
  const pagename: string = "dotproduct"; //ここを変更

  const metaData = metadata[pagename];
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const imagePath = `${basePath}/${metaData.topic}/${pagename}`;
  const notePath = `https://colab.research.google.com/github/jeonglabo/nextjs/blob/main/notebook/${metaData.topic}/${pagename}`;

  const crossmetaData = metadata.crossproduct;

  return (
    <>
      <h2 className="caption">ベクトル積について</h2>
      <p>
        ベクトル積には、内積（Dot Product または Inner Product）と外積（Cross
        Product または Vector Product）の2種類があります。
        <br />
        それぞれの計算結果や意味、応用方法には大きな違いがあります。これをしっかり理解しておくことが重要です。
      </p>
      <p>
        ここでは<b>内積</b>
        について説明します。外積については以下のページをご覧ください。
      </p>

      <CustomLink
        href="/linear_algebra/crossproduct"
        imageUrl={`${basePath}/linear_algebra/crossproduct/thumb.png`}
        altText="外積ページのサムネ"
        siteName={crossmetaData.title}
        description={crossmetaData.description}
      />

      <h2 className="caption">内積とは</h2>

      <p>
        内積は、特に機械学習の分野で非常に重要です。ベクトル同士の類似度を計算する際に使用されるコサイン類似度とも深く関わっています。
        この点を意識しながら、内積の理解を深めていきましょう。
      </p>

      <p>
        任意のベクトル&nbsp;
        <InlineMath math="\bm{a}" />
        &nbsp;と&nbsp;
        <InlineMath math="\bm{b}" />
        &nbsp;の内積は次式のように定義されます。
      </p>

      <CenteredEquation
        equation="\begin{align*}
        \bm{a}\cdot\bm{b} &= \bm{a}^{\bm{T}}\bm{b} = \bm{b}^{\bm{T}}\bm{a} \notag \\
        \bm{a}\cdot\bm{b} &= \|\bm{a}\|\|\bm{b}\|\cos{\theta}
        \end{align*}"
      />

      <p>
        ここで&nbsp;
        <InlineMath math="\bm{a}^{\bm{T}}" />
        &nbsp;は&nbsp;
        <InlineMath math="\bm{a}" />
        &nbsp;の転置を表しています。
      </p>

      <h2 className="caption">具体例</h2>

      <p>
        例を与えて考えてみましょう。ベクトル&nbsp;
        <InlineMath math="\bm{a}" />
        &nbsp;と&nbsp;
        <InlineMath math="\bm{b}" />
        &nbsp;を以下のような数字を与えた2次元ベクトルとします。
      </p>

      <CenteredEquation
        equation="\begin{align*}
        \bm{a} &= \begin{bmatrix} 1 \\ 3 \end{bmatrix} \notag \\
        \bm{b} &= \begin{bmatrix} 5 \\ 1 \end{bmatrix}
        \end{align*}
        "
      />

      <p>
        これらのベクトルはグラフで表すと以下のようになります。赤い矢印がベクトル&nbsp;
        <InlineMath math="\bm{a}" />
        &nbsp;で、青い矢印がベクトル&nbsp;
        <InlineMath math="\bm{b}" />
        &nbsp;です。
      </p>

      <ImageModal
        imagePath={`${imagePath}/vector.png`}
        altText="ベクトルaとベクトルbを表したグラフ"
      />
      <br />
      <br />

      <CustomLink
        href={`${notePath}/vector.ipynb`}
        imageUrl={`${imagePath}/vector.png`}
        altText="ベクトルaとベクトルbを表したグラフ"
        siteName="ベクトルの表示"
        description="ベクトルの表示を行っているコードを示しています。"
        target="_blank"
      />

      <p>これらのベクトルの足し算を式で表すと以下のようになります。</p>

      <CenteredEquation
        equation="\bm{a}+\bm{b}= \begin{bmatrix}
        1 \\ 3 \\
        \end{bmatrix} + \begin{bmatrix}
        5 \\ 1 \\
        \end{bmatrix} = \begin{bmatrix}
        1+5 \\ 3+1 \\
        \end{bmatrix} = \begin{bmatrix}
        6 \\ 4 \\
        \end{bmatrix}"
      />

      <p>
        これらのベクトルの足し算をグラフで表すと以下のようになります。
        <br />
        緑の矢印がベクトルの足し算を表します。
      </p>

      <ImageModal
        imagePath={`${imagePath}/plus.png`}
        altText="ベクトルaとベクトルbの足し算を表したグラフ"
      />
      <br />
      <br />

      <CustomLink
        href={`${notePath}/plus.ipynb`}
        imageUrl={`${imagePath}/plus.png`}
        altText="ベクトルaとベクトルbの足し算を表したグラフ"
        siteName="ベクトルの足し算の表示"
        description="ベクトルの足し算の表示を行っているコードを示しています。"
        target="_blank"
      />

      <p>
        同じように内積でも図解をします。
        <br />
        まず初めに式で表すと以下のようになります。
      </p>

      <CenteredEquation equation="\bm{a}\cdot\bm{b}=\begin{bmatrix} 1 \ 3 \\\end{bmatrix}\begin{bmatrix}  5 \\ 1 \\\end{bmatrix}=1\cdot5+3\cdot1=8" />

      <p>
        これらのベクトルの内積をグラフで表すと以下のようになります。
        <br />
        緑の矢印がベクトルの内積を表します。
      </p>

      <ImageModal
        imagePath={`${imagePath}/dot.png`}
        altText="ベクトルaとベクトルbの内積を表したグラフ"
      />
      <br />
      <br />

      <CustomLink
        href={`${notePath}/dot.ipynb`}
        imageUrl={`${imagePath}/dot.png`}
        altText="ベクトルaとベクトルbの内積を表したグラフ"
        siteName="ベクトルの内積の表示"
        description="ベクトルの内積の表示を行っているコードを示しています。"
        target="_blank"
      />
      <br />
      <h3>解説</h3>
      <p>
        内積は以下のように表されます。
        <br />
        &nbsp;&nbsp;&nbsp;
        <InlineMath math="\bm{a}\cdot\bm{b} = \|\bm{a}\|\|\bm{b}\|\cos{\theta}" />
        <br />
        これを以下のように書き換えます。
        <br />
        &nbsp;&nbsp;&nbsp;
        <InlineMath math="\bm{a}\cdot\bm{b} = \|\bm{a}\|\cos{\theta}\|\bm{b}\|" />
        <br />
        これはベクトル&nbsp;
        <InlineMath math="\bm{a}" />
        &nbsp;をベクトル&nbsp;
        <InlineMath math="\bm{b}" />
        &nbsp;に射影(projection)したものと&nbsp;
        <InlineMath math="\bm{b}" />
        &nbsp;のノルムの積を意味します。
      </p>

      {/* 新たに追加された図とその説明文 */}
      <h3>図による解説 (内積の視覚化)</h3>
      <p>
        下の図は、赤色のベクトル&nbsp;
        <InlineMath math="\bm{a}" />
        と青色のベクトル
        <InlineMath math="\bm{b}" />
        を示しており、両ベクトルのなす角&nbsp;
        <InlineMath math="\theta" />
        が明示されています。
        <br />
        また、緑のベクトルはベクトル&nbsp;
        <InlineMath math="\bm{b}" />
        &nbsp;をベクトル&nbsp;
        <InlineMath math="\bm{a}" />
        &nbsp;に射影したものです。式で表すと&nbsp;
        <InlineMath math="\|\bm{b}\|\cos{\theta}" />
        となります。
        <br />
        このベクトル（緑の射影ベクトル）の長さと、ベクトル&nbsp;
        <InlineMath math="\bm{a}" />
        &nbsp;の大きさを掛けたものが内積になります。
      </p>
      <CenteredEquation equation="\bm{a}\cdot\bm{b} = \|\bm{a}\|\|\bm{b}\|\cos{\theta}" />
      <ImageModal
        imagePath={`${imagePath}/dot_angle.png`}
        altText="内積の視覚化: ベクトルと角度θ"
      />
      <br />
      <br />
    </>
  );
}
