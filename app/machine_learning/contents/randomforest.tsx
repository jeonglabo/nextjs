import { metadata } from "@/app/machine_learning/metadata";
import CustomLink from "@/app/components/CustomLink";

export default function PageContent() {
  const pagename: string = "randomforest"; //ここを変更

  const metaData = metadata[pagename];
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const imagePath = `${basePath}/${metaData.topic}/${pagename}`;
  const notePath = `https://colab.research.google.com/github/jeonglabo/nextjs/blob/main/notebook/${metaData.topic}/${pagename}`;

  return (
    <>
      <h2 className="caption">ランダムフォレストの概要</h2>
      <p>
        ランダムフォレスト（Random Forest）は、機械学習におけるアンサンブル学習の一種で、複数の決定木（Decision Tree）を組み合わせることで予測精度を向上させるモデルです。
        <br />
        特に分類や回帰タスクにおいて高い汎化性能を発揮し、実務でも幅広く利用されています。
        <br />
        決定木については以下のページで詳しく解説しています。
      </p>
      <CustomLink
        href="/machine_learning/decisiontree"
        imageUrl={`${basePath}/machine_learning/decisiontree/thumb.png`}
        altText="決定木のページのサムネ"
        siteName={metadata.decisiontree.title}
        description={metadata.decisiontree.description}
      />
      <p>ランダムフォレストには、以下のような特徴があります。</p>
      <ul>
        <li>高い汎化性能を持ち、過学習を抑制します。</li>
        <li>特徴量の重要度を評価することができます。</li>
        <li>複雑なモデルでありながら、比較的実装が容易です。</li>
      </ul>
      <h2 className="caption">ランダムフォレストの基本原理</h2>
      <p>
        ランダムフォレストは、複数の決定木を組み合わせることで予測精度を向上させる手法です。
        <br />
        以下にその基本的な仕組みを説明します。
      </p>
      <ul>
        <li>
          <b>データのランダムサンプリング</b>
          <p>
            元のデータセットから、ブートストラップサンプリングを用いて部分データセットを作成します。
            <br />
            この方法により、各決定木は異なるデータを基に学習されます。
          </p>
        </li>
        <li>
          <b>決定木の構築</b>
          <p>
            各決定木は、データ分割時に全ての特徴量を使用するのではなく、ランダムに選ばれた一部の特徴量を使用します。
            <br />
            過学習を防ぐために、木の深さや葉の数に制限を設けることが一般的です。
          </p>
        </li>
        <li>
          <b>予測のアンサンブル</b>
          <p>
            分類問題では、全ての決定木の予測結果を多数決で統合します。
            <br />
            回帰問題では、全ての決定木の予測結果を平均して統合します。
            <br />
            これにより、個々の決定木の弱点を補い、安定した予測性能を実現します。
          </p>
        </li>
      </ul>
      <p>
        これにより、個々の決定木の弱点を補い、安定した予測性能を実現します。
      </p>
      <h2 className="caption">ランダムフォレストのアルゴリズム</h2>
      <p>ランダムフォレストのアルゴリズムは、以下の手順で構築されます。</p>
      <ol>
        <li>
          <b>データセットの準備</b>
          <p>
            ランダムなサブセットを作成し、決定木を構築するためのデータセットとします。
          </p>
        </li>
        <li>
          <b>ランダムフォレストの構築</b>
          <p>
            決定木を複数構築し、それぞれの決定木が異なる特徴量やデータで学習するようにします。
          </p>
        </li>
        <li>
          <b>予測の実行</b>
          <p>各決定木の予測結果を集計し、最終的な予測結果を出力します。</p>
        </li>
      </ol>
      <h2 className="caption">メリット</h2>
      <ol>
        <li>
          <b>✔️ 過学習しにくい</b>
          <p>アンサンブルによる分散を削減します。</p>
        </li>
        <li>
          <b>✔️ 汎用性</b>
          <p>分類、回帰、多クラス問題に対応しています。</p>
        </li>
        <li>
          <b>✔️ 特徴量の重要度解析</b>
          <p>特徴選択やデータ解釈に役立ちます。</p>
        </li>
        <li>
          <b>✔️ 頑健性</b>
          <p>ノイズや欠損値に強いです。</p>
        </li>
      </ol>

      <h2 className="caption">デメリット</h2>
      <ol>
        <li>
          <b>❌ 計算コストが高い</b>
          <p>大規模データセットでのトレーニングには時間がかかります。</p>
        </li>
        <li>
          <b>❌ 解釈が難しい</b>
          <p>個々の決定木がブラックボックス化することもあります。</p>
        </li>
        <li>
          <b>❌ スケールに敏感</b>
          <p>特徴量のスケールを揃える必要がある場合があります。</p>
        </li>
      </ol>

      <h2 className="caption">ランダムフォレストの実装</h2>
      <p>
        ランダムフォレストは、Pythonの機械学習ライブラリであるScikit-learnを使用することで簡単に実装することができます。
        <br />
        今回の例では、Irisデータセットを使用し、分類問題を解きます。
      </p>
      <p>
        下記のnotebookは、ランダムフォレストを用いてIrisデータセットを分類するコードを示しています。
      </p>
      <CustomLink
        href={`${notePath}/randomforest.ipynb`}
        imageUrl={`${imagePath}/randomforest.png`}
        altText="ランダムフォレストの結果"
        siteName="ランダムフォレストの実装"
        description="ランダムフォレストの実装を行っているコードを示しています。"
        target="_blank"
      />
    </>
  );
}