import fs from "fs";
import path from "path";
import PreviewColumn from "./PreviewColumn";
import EigenSolveContent from "@/app/linear_algebra/contents/eigen_solve";
import EigenPropertyContent from "@/app/linear_algebra/contents/eigen_property";

type Patch = {
  id: string;
  targetPage: string;
  targetSectionId: string;
  operation: "insert" | "replace";
  content: string;
};

type PatchPayload = {
  patches: Patch[];
};

function loadPatches(filePath: string): Patch[] {
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw) as PatchPayload;
  return data.patches || [];
}

function filterPatches(patches: Patch[], targetPage: string): Patch[] {
  return patches.filter((patch) => patch.targetPage === targetPage);
}

export default function Page() {
  const root = process.cwd();
  const genericPath = path.join(
    root,
    "experiments/eigen_update/outputs/generic/latest.json"
  );
  const expertPath = path.join(
    root,
    "experiments/eigen_update/outputs/expert/latest.json"
  );
  const expertReplacePath = path.join(
    root,
    "experiments/eigen_update/outputs/expert/latest_replace.json"
  );

  const generic = loadPatches(genericPath);
  const expert = loadPatches(expertPath);
  const expertReplace = loadPatches(expertReplacePath);

  const sectionStyle: React.CSSProperties = {
    marginBottom: "32px",
    paddingBottom: "16px",
    borderBottom: "2px solid #ddd",
  };
  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "24px",
  };
  const titleStyle: React.CSSProperties = {
    fontSize: "20px",
    fontWeight: 700,
    margin: "8px 0 16px",
  };

  return (
    <div style={{ padding: "24px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: 700 }}>
        固有値ページ更新プレビュー
      </h1>

      <section style={sectionStyle}>
        <div style={titleStyle}>eigen_solve</div>
        <div style={gridStyle}>
          <PreviewColumn
            label="汎用版"
            patches={filterPatches(generic, "eigen_solve")}
          >
            <EigenSolveContent />
          </PreviewColumn>
          <PreviewColumn
            label="専門版"
            patches={filterPatches(expert, "eigen_solve")}
          >
            <EigenSolveContent />
          </PreviewColumn>
          <PreviewColumn
            label="専門版（replace）"
            patches={filterPatches(expertReplace, "eigen_solve")}
          >
            <EigenSolveContent />
          </PreviewColumn>
        </div>
      </section>

      <section style={sectionStyle}>
        <div style={titleStyle}>eigen_property</div>
        <div style={gridStyle}>
          <PreviewColumn
            label="汎用版"
            patches={filterPatches(generic, "eigen_property")}
          >
            <EigenPropertyContent />
          </PreviewColumn>
          <PreviewColumn
            label="専門版"
            patches={filterPatches(expert, "eigen_property")}
          >
            <EigenPropertyContent />
          </PreviewColumn>
          <PreviewColumn
            label="専門版（replace）"
            patches={filterPatches(expertReplace, "eigen_property")}
          >
            <EigenPropertyContent />
          </PreviewColumn>
        </div>
      </section>
    </div>
  );
}
