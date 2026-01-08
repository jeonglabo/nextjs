"use client";

import { useEffect, useRef } from "react";

type Patch = {
  id: string;
  targetSectionId: string;
  operation: "insert" | "replace";
  content: string;
  targetParagraphIndex?: number;
};

type PreviewColumnProps = {
  label: string;
  patches: Patch[];
  children: React.ReactNode;
};

const blockStyle: React.CSSProperties = {
  margin: "12px 0",
  padding: "10px 12px",
  border: "1px dashed #888",
  background: "#f7f7f7",
  whiteSpace: "pre-wrap",
};

const labelStyle: React.CSSProperties = {
  fontWeight: 700,
  marginBottom: "8px",
};

export default function PreviewColumn({
  label,
  patches,
  children,
}: PreviewColumnProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    patches.forEach((patch) => {
      const marker = root.querySelector(
        `[data-patch-id="${patch.id}"]`
      ) as HTMLElement | null;
      if (marker) return;

      const target = root.querySelector(
        `#${CSS.escape(patch.targetSectionId)}`
      ) as HTMLElement | null;

      const block = document.createElement("div");
      block.setAttribute("data-patch-id", patch.id);
      block.style.margin = blockStyle.margin || "";
      block.style.padding = blockStyle.padding || "";
      block.style.border = blockStyle.border || "";
      block.style.background = blockStyle.background || "";
      block.style.whiteSpace = blockStyle.whiteSpace || "";
      block.textContent = patch.content;

      if (patch.operation === "replace" && target) {
        const paragraphs: HTMLElement[] = [];
        let cursor = target.nextElementSibling as HTMLElement | null;
        while (cursor && cursor.tagName !== "H2") {
          if (cursor.tagName === "P") {
            paragraphs.push(cursor);
          }
          cursor = cursor.nextElementSibling as HTMLElement | null;
        }
        const idx = patch.targetParagraphIndex ?? -1;
        if (idx >= 0 && idx < paragraphs.length) {
          paragraphs[idx].textContent = patch.content;
          return;
        }
      }

      if (target?.parentNode) {
        target.parentNode.insertBefore(block, target.nextSibling);
      } else {
        root.appendChild(block);
      }
    });
  }, [patches]);

  return (
    <div>
      <div style={labelStyle}>{label}</div>
      <div ref={containerRef}>{children}</div>
    </div>
  );
}
