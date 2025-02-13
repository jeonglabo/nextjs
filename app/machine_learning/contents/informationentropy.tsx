import CenteredEquation from "@/app/components/CenteredEquation";
import { InlineMath } from "react-katex";

export default function PageContent() {
  return (
    <>
      <h2 className="caption">情報とは何か？</h2>
      <p>
        学習を進める中で、多くの用語に行き詰まることがあります。特に私の場合、統計学を学ぶ中で用語に対する壁を感じることが多かったように思います。
        <br />
        例えば、「帰無仮説」という用語は聞き慣れないため、その意味を理解するのに苦労する良い例です。
      </p>
      <p>
        しかし、今回のポストで取り上げる「情報」という言葉は、日常的に非常に頻繁に使用されているため、逆に学習を妨げることがあると言えます。
      </p>
      <p>
        情報とは一体何でしょうか？「情報」はさまざまな視点から解釈されます。例えば、データベースの観点では、情報とはデータを利用しやすく加工したものを指します。
        <br />
        この視点は主にコンピュータサイエンスに基づいたもので、データを使用する側から見た情報の抽象的な概念です。
      </p>
      <p>
        では、統計学では情報は何を意味するのでしょうか？統計学における情報量は「驚きの度合い」と言えるかもしれません。
        <br />
        つまり、驚かされる内容ほど情報量が多いということです。
      </p>
      <p>
        情報量を数式で定義するなら、おそらく確率値に反比例する値として定義するのが適切でしょう。
      </p>
      <CenteredEquation equation="\text{Info} \propto \frac{1}{P(X)}" />

      <h2 className="caption">情報量の定義</h2>
      <p>
        より具体的に言うと、統計学での情報量は次のように定義されます。離散型ランダム変数&nbsp;
        <InlineMath math="X" />
        &nbsp;に対して、
      </p>
      <CenteredEquation equation="I(X) = -\log_b(P(X))" />
      <p>
        このとき、対数の底&nbsp;
        <InlineMath math="b" />
        &nbsp;は用途に応じて異なり、一般的には&nbsp;
        <InlineMath math="b = 2, e, 10" />
        &nbsp;のいずれかが使用されます (それぞれの単位は bit, nit, dit です)。
      </p>
      <p>
        情報量の定義にマイナスが付いているのは、対数が情報量の定義に使用されているためです。
      </p>
      <CenteredEquation equation="\log_b\left(\frac{1}{P(X)}\right) = -\log_b(P(X))" />
      <p>
        情報量を定義する際に対数を使用するのは、以下のような情報の概念を満たす数式でなければならないからです。
      </p>
      <ol>
        <li>確率値（または確率密度値）に反比例する。</li>
        <li>
          二つの出来事の情報量を合算すると、それぞれの情報量を足した値に等しくなる。
        </li>
      </ol>

      <h2 className="caption">エントロピー: 平均情報量</h2>
      <p>
        統計学では、エントロピーとは平均情報量を指します。情報エントロピー（またはシャノンエントロピー）は平均情報量です。
        離散型ランダム変数&nbsp;
        <InlineMath math="X" />
        &nbsp;のサンプル空間が&nbsp;
        <InlineMath math="\{x_1, x_2, \ldots, x_n\}" />
        &nbsp;であるとき、情報エントロピーは以下のように定義されます。
      </p>
      <CenteredEquation equation="H(X) = E[I(X)] = -\sum_{i=1}^{n} P(x_i) \log_b(P(x_i))" />
      <p>
        ここで、
        <InlineMath math="E[\cdot]" />{" "}
        は期待値演算子を意味します。上記の式がなぜ情報量の期待値（つまり平均情報量）を意味するのか疑問を持たれる場合は、次の例を考えてみてください。
      </p>
      <p>
        サイコロ遊びをして、1から6までの目が出たとき、それぞれ100円から600円までを得るとしましょう。このときの期待値は以下のようになります。
      </p>
      <CenteredEquation
        equation="\begin{aligned}
        \frac{1}{6} \times 100 + \frac{1}{6} \times 200 + \ldots + \frac{1}{6} \times 600 = \sum_{i=1}^{6} P(x_i) M(x_i)
        \end{aligned}"
      />
      <p>
        情報エントロピーは、起こりうるすべての出来事の確率&nbsp;
        <InlineMath math="P(x_i)" />
        &nbsp;と&nbsp;情報量の値を合計したものとして計算されます。
      </p>
      <CenteredEquation equation="H(X) = -\sum_{i=1}^{n} P(x_i) \log_b(P(x_i))" />
      <p>この式から情報エントロピーが得られます。</p>
      <p>この数式は対数エントロピーを表しています。</p>
      <p>結果は一貫しています。</p>
    </>
  );
}