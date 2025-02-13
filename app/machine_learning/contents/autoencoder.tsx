import { metadata } from "@/app/machine_learning/metadata";
import ImageModal from "@/app/components/ImageModal";
import CustomLink from "@/app/components/CustomLink";

export default function PageContent() {
  const pagename: string = "autoencoder"; //ここを変更

  const metaData = metadata[pagename];
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const imagePath = `${basePath}/${metaData.topic}/${pagename}`;
  const notePath = `https://colab.research.google.com/github/jeonglabo/nextjs/blob/main/notebook/${metaData.topic}/${pagename}`;

  return (
    <>
      <h2 className="caption">オートエンコーダ (AutoEncoder)</h2>
      <p>
        オートエンコーダ（以下オートエンコーダ）は、RBM（Restricted Boltzmann
        Machine）と共に、ディープラーニング理論の構築における基盤となった重要な概念の1つです。
        <br />
        オートエンコーダとRBMは非常に類似した目標を持ち、どちらも入力層（または可視層）のデータに関する隠れた要因（latent
        factors）を隠れ層から取得することを目指しています。
      </p>
      <p>
        オートエンコーダはデータを圧縮し、再び元に戻す（解凍する）プロセスを行うニューラルネットワークです。オートエンコーダの目的は、非線形的な次元削減を行い、高次元のデータを低次元の空間で表現することです。
        <br />
        オートエンコーダの基本構造は以下のようになります。
      </p>

      <ImageModal
        imagePath={`${imagePath}/autoencoder_structure.png`}
        altText="オートエンコーダの基本構造"
      />

      <h2 className="caption">オートエンコーダの構造と役割</h2>
      <h3>圧縮の観点：エンコーダの役割</h3>
      <p>
        データの圧縮は「次元削減」に似ていますが、オートエンコーダは非線形な次元削減を行うため、圧縮という言葉を使います。オートエンコーダはデータを圧縮し、その結果として表現ベクトル（representation
        vector）を生成します。
      </p>

      <h3>解凍の観点：デコーダの役割</h3>
      <p>
        デコーダは、潜在空間内の任意の表現ベクトルを受け取り、それが持つ元の意味を解釈して、元のサイズのデータに復元します。
      </p>

      <h2 className="caption">オートエンコーダの入出力結果</h2>
      <p>
        オートエンコーダの本来の役割は、入力データを出力として再現することです。オートエンコーダが訓練されたモデルが入力を再構成する際の精度は、データの復元能力を測る指標となります。
      </p>

      <h2 className="caption">オートエンコーダとディープラーニングの関係</h2>
      <p>
        ディープラーニングの核は、単に「層が深い」というだけでなく、深くなることでどのような効果が得られるかにあります。オートエンコーダは、データセットの抽象的な特性を学習し、低次元の潜在空間に象徴的な特徴を構成するため、データの抽象化を行っています。
      </p>
      <p>
        オートエンコーダを利用してより深い層を積み重ねたものは「スタックドオートエンコーダ（Stacked
        AutoEncoder）」と呼ばれ、得られた抽象的な特徴を微調整することで、深層ニューラルネットワークを効果的に学習させることが可能となります。
      </p>

      <h2 className="caption">オートエンコーダの利用</h2>
      <p>
        以下のコードはオートエンコーダを利用して、手描き文字の画像を学習しているコードを表しています。
        <br />
        このコードはこのコードは、手書き数字画像（MNIST）をエンコーダで低次元に圧縮し、デコーダで元の画像に復元するAutoencoderを学習し、オリジナル画像と再構成画像を比較して可視化するものです。
      </p>
      <ImageModal
        imagePath={`${imagePath}/result.png`}
        altText="手描き文字の学習結果"
      />
      <CustomLink
        href={`${notePath}/result.ipynb`}
        imageUrl={`${imagePath}/result.png`}
        altText="手描き文字の学習結果"
        siteName="手描き文字の画像を学習"
        description="手描き文字の画像を学習を行っているコードを示しています。"
        target="_blank"
      />

      <p>
        以上の結果を潜在空間上でのデータ分布を3次元グラフとしてプロットします。
        <br />
        この図は学習結果になります。
        <br />
        数字の配置は、類似した特徴を持つ数字同士が潜在空間上で近接して配置されるように設計されています。これにより、データの類似性が視覚的に理解しやすくなります。
      </p>

      <ImageModal
        imagePath={`${imagePath}/MNIST.png`}
        altText="手書き文字の学習結果: この画像はオートエンコーダが手書き文字をどのように学習したかを示しています。"
      />

      <CustomLink
        href={`${notePath}/MNIST.ipynb`}
        imageUrl={`${imagePath}/MNIST.png`}
        altText="手描き文字の学習結果"
        siteName="手描き文字の画像を学習"
        description="手描き文字の画像を学習を行っているコードを示しています。数字の配置は類似した特徴を持つもの同士が近くに配置されています。"
        target="_blank"
      />
    </>
  );
}
