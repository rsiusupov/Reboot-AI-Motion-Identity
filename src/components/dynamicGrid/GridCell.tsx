import React from "react";
import { useDynamicGrid } from "./DynamicGridContext";
import type { GridCellContent } from "./types";

export type GridCellProps = {
  col: number;
  row: number;
  colSpan?: number;
  rowSpan?: number;
  /**
   * media — children cover/fill and scale with the cell
   * type — clip only; type size stays from typography / static steps (no cell scale)
   */
  content?: GridCellContent;
  children?: React.ReactNode;
  style?: React.CSSProperties;
};

/**
 * Axis-aligned cell wrapper. Overflow clipped.
 * Collapsed tracks (area &lt; ε) are not mounted by returning null.
 */
export const GridCell: React.FC<GridCellProps> = ({
  col,
  row,
  colSpan = 1,
  rowSpan = 1,
  content = "media",
  children,
  style,
}) => {
  const { resolveRect } = useDynamicGrid();
  const rect = resolveRect(col, row, colSpan, rowSpan);
  if (!rect) {
    return null;
  }

  const isMedia = content === "media";

  return (
    <div
      data-grid-cell={`${col},${row}`}
      data-grid-content={content}
      style={{
        position: "absolute",
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        overflow: "hidden",
        boxSizing: "border-box",
        ...style,
      }}
    >
      <div
        style={
          isMedia
            ? {
                width: "100%",
                height: "100%",
                overflow: "hidden",
              }
            : {
                width: "100%",
                height: "100%",
                overflow: "hidden",
                // type: no transform/scale from cell — clip only
                transform: "none",
              }
        }
      >
        {isMedia ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              // cover-like fill; media scales with cell box
              display: "flex",
              alignItems: "stretch",
              justifyContent: "stretch",
            }}
          >
            <div style={{ flex: 1, minWidth: 0, minHeight: 0, width: "100%", height: "100%" }}>
              {children}
            </div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};
