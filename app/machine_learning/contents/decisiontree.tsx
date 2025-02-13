import { metadata } from "@/app/machine_learning/metadata";
import ImageModal from "@/app/components/ImageModal";
import CustomLink from "@/app/components/CustomLink";

export default function PageContent() {
  const pagename: string = "decisiontree"; //ここを変更
  const metaData = metadata[pagename];
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const imagePath = `${basePath}/${metaData.topic}/${pagename}`;

  return (
    <>
      <h2 className="caption">決定木（Decision Tree）</h2>
      <p>
        決定木は、データを木構造で表現し、分類や回帰の問題を解くための機械学習モデルです。
        <br />
        シンプルで解釈しやすいことから、統計学や機械学習の初学者から実務まで幅広く利用されています。
      </p>
      <p>
        また、決定木は分類木と回帰木の2つを総称して決定木といいます。
        <br />
        それぞれについては以下のページらで紹介しています。
      </p>
      <CustomLink
        href="/machine_learning/classification_tree"
        imageUrl={`${basePath}/machine_learning/classification_tree/thumb.png`}
        altText="分類木のページのサムネ"
        siteName={metadata.classification_tree.title}
        description={metadata.classification_tree.description}
      />
      <br />
      <CustomLink
        href="/machine_learning/regression_tree"
        imageUrl={`${basePath}/machine_learning/regression_tree/thumb.png`}
        altText="回帰木ページのサムネ"
        siteName={metadata.regression_tree.title}
        description={metadata.regression_tree.description}
      />

      <h2 className="caption">決定木の名称</h2>
      <p>
        決定木分析の際に使うそれぞれの樹形図内の各箇所の名称を以下に示します。
      </p>
      <ul>
        <li>
          <b>Root Node（ルートノード）</b>
          <p>
            木構造の最上位に位置するノードで、最初にデータを分割するノードです。
          </p>
        </li>
        <li>
          <b>Internal Node（内部ノード）</b>
          <p>Root Node以外のノードで、データを分割するための条件を持ちます。</p>
        </li>
        <li>
          <b>Leaf Node（リーフノード）</b>
          <p>最下位のノードで、予測値が決定されるノードです。</p>
        </li>
        <li>
          <b>Branch（枝）</b>
          <p>ノード間を結ぶ線で、データの分割を表します。</p>
        </li>
      </ul>
      <ImageModal imagePath={`${imagePath}/name.png`} altText="回帰木の名称" />

      <h2 className="caption">決定木の改良</h2>
      <p>
        決定木はシンプルで解釈しやすい反面、過学習のリスクが高いという問題があります。
        <br />
        そのため、決定木の改良手法として以下の手法が提案されています。
      </p>
      <ul>
        <li>
          <b>ランダムフォレスト</b>
          <p>
            複数の決定木を組み合わせたアンサンブル学習手法で、過学習を抑える効果があります。
          </p>
          <CustomLink
            href="/machine_learning/randomforest"
            imageUrl={`${basePath}/machine_learning/randomforest/thumb.png`}
            altText="ランダムフォレストのページのサムネ"
            siteName={metadata.randomforest.title}
            description={metadata.randomforest.description}
          />
        </li>
        <li>
          <b>勾配ブースティング木（Gradient Boosting Tree）</b>
          <p>
            前の決定木の誤差を次の決定木で補正する手法で、精度向上が期待できます。
          </p>
        </li>
      </ul>

      <h2 className="caption">決定木の使用方法</h2>
      <p>
        ここでは、Pythonのscikit-learnライブラリを用いた決定木の実装例を示します。以下のコードは、アイリスデータセットを用いて決定木モデルを構築し、可視化する例です。
      </p>
      <pre>
        {`from sklearn import tree
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt

# データの読み込み
iris = load_iris()
X_train, X_test, y_train, y_test = train_test_split(iris.data, iris.target, test_size=0.3, random_state=42)

# 決定木の作成
clf = tree.DecisionTreeClassifier()
clf.fit(X_train, y_train)

# 決定木の可視化
fig, ax = plt.subplots(figsize=(12, 8))
tree.plot_tree(clf, feature_names=iris.feature_names, class_names=iris.target_names, filled=True)
plt.show()`}
      </pre>

      <h2 className="caption">決定木のメリット</h2>
      <p>決定木には以下のような利点があります:</p>
      <ul>
        <li>
          解釈が容易で、どの特徴がどのように分類に寄与しているかを視覚的に理解できる。
        </li>
        <li>非線形な関係を捉える能力がある。</li>
        <li>前処理が比較的少なくても扱いやすい。</li>
      </ul>
    </>
  );
}
