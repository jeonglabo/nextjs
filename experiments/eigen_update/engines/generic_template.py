"""
汎用版（専門知識なし）の簡易テンプレ挿入ロジック。
テンプレは固定文言＋コメントから抽出した意図を組み合わせ、外部知識は参照しない。
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import List, Optional


@dataclass(frozen=True)
class CommentSample:
    id: str
    targetPage: str
    category: str
    level: str
    difficulty: int
    comment: str
    expected_gap: Optional[str] = None


@dataclass(frozen=True)
class Patch:
    id: str
    targetPage: str
    targetSectionId: str
    operation: str
    content: str
    rationale: str
    citations: List[str] = field(default_factory=list)
    retrievalLog: List[str] = field(default_factory=list)


def build_patch_from_comment(comment: CommentSample) -> Optional[Patch]:
    common = {
        "id": f"patch-{comment.id}",
        "targetPage": comment.targetPage,
    }

    if comment.category == "beginner_question":
        return Patch(
            **common,
            targetSectionId="definition",
            operation="insert",
            content=(
                "【直感メモ】固有値は「行列がその方向にどれだけ伸縮するか」を表し、"
                "固有ベクトルは「伸縮しても方向が変わらない軸」です。例えばばねの伸び縮みの倍率を固有値、"
                "ばねの方向を固有ベクトルとみなすとイメージしやすいです。"
            ),
            rationale="定義と幾何的イメージの橋渡しを追加し、初学者の直感を補強する。",
        )

    if comment.category == "misconception":
        return Patch(
            **common,
            targetSectionId="definition",
            operation="insert",
            content=(
                "【注意】行列式は行列全体の体積倍率を 1 つの値で表します。"
                "一方、固有値は「方向ごとの倍率」の一覧です。特性方程式に行列式が現れるのは、"
                "複数の固有値の積が行列式に一致するためであり、同じ量を指しているわけではありません。"
            ),
            rationale="行列式と固有値を混同する誤解を解消する。",
        )

    if comment.category == "procedure_stuck":
        return Patch(
            **common,
            targetSectionId="char_poly",
            operation="insert",
            content=(
                "【計算チェックリスト（3×3 の例）】\n"
                "- まず対角成分を (a−λ)(d−λ)(f−λ) の形でまとめる。\n"
                "- 余因子展開を行う前に符号の並びをメモ（+−+ のパターン）。\n"
                "- 展開後は λ の次数ごとに項をグルーピングしてから整理する。\n"
                "- 定数項が det(A) に一致するかを最後に確認する。"
            ),
            rationale="特性方程式展開時の符号ミスを防ぐ検算ポイントを追加。",
        )

    if comment.category == "property_deepdive":
        return Patch(
            **common,
            targetSectionId="spectral_overview",
            operation="insert",
            content=(
                "【対称行列の実数性のスケッチ】対称行列 A に対して任意の実ベクトル x で x^T A x は実数になり、"
                "レイリー商の極値が固有値に一致するため、固有値は実数になる。さらに固有ベクトル同士を直交化できるので、"
                "直交行列 Q により A = Q Λ Q^T と対角化できる。"
            ),
            rationale="スペクトル定理の核心だけを短く提示し、実数性と直交対角化の流れを補う。",
        )

    if comment.category == "expert_probe":
        return Patch(
            **common,
            targetSectionId="diagonalization_condition",
            operation="insert",
            content=(
                "【対角化可能性の整理】非正規行列でも固有値が重複しない場合は対角化できることが多いが、"
                "欠損する場合はジョルダン標準形が必要になる。例: "
                "\\(\\begin{pmatrix}1 & 1 \\\\ 0 & 1\\end{pmatrix}\\) "
                "は固有値 1 が重複するが固有ベクトルが 1 本しかなく対角化不可。"
                "対角化可否を判定する際は、代数的重複度と幾何的重複度の一致を確認する。"
            ),
            rationale="対角化条件と反例を短く提示し、ジョルダン形との違いを補足する。",
        )

    if comment.category == "example_request":
        return Patch(
            **common,
            targetSectionId="worked_example",
            operation="insert",
            content=(
                "【2×2 の具体例（再掲）】行列 "
                "\\(\\begin{pmatrix}2 & -1 \\\\ -1 & 2\\end{pmatrix}\\) "
                "の固有値は 1, 3。固有ベクトルは "
                "\\(\\begin{pmatrix}1 \\\\ 1\\end{pmatrix}\\) と "
                "\\(\\begin{pmatrix}1 \\\\ -1\\end{pmatrix}\\)。"
                "矢印が同じ方向に保たれたまま長さだけが 1 倍/3 倍に変わる、というイメージを付けておく。"
            ),
            rationale="初学者向けに、図なしでもイメージできる最小例を挿入する。",
        )

    if comment.category == "definition_check":
        return Patch(
            **common,
            targetSectionId="definition",
            operation="insert",
            content=(
                "【定義の再確認】固有値 λ は \\((A - \\lambda I)\\bm{x} = 0\\) "
                "を満たす非自明解が存在する値、固有ベクトルはその非自明解。"
                "固有値ごとに固有空間ができ、ゼロベクトルは含まない点に注意。"
            ),
            rationale="定義確認リクエストに応じて、核の条件を明示する。",
        )

    return None


def build_generic_run(comments: List[CommentSample]) -> List[Patch]:
    patches: List[Patch] = []
    for comment in comments:
        patch = build_patch_from_comment(comment)
        if patch:
            patches.append(patch)
    return patches
