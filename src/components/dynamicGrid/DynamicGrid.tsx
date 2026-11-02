import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  easingById,
  type EasingId,
} from "../../theme/easings";
import { gridStroke } from "../../theme/colors";
import { getFormat, type FormatId } from "../../theme/formats";
import { DynamicGridProvider } from "./DynamicGridContext";
import {
  interpolateColEdges,
  interpolateRowEdges,
  validateKeyframes,
} from "./interpolateEdges";
import type { CellRect, GridKeyframe } from "./types";

export type DynamicGridProps = {
  formatId: FormatId;
  cols: number;
  rows: number;
  keyframes: GridKeyframe[];
  easingId: EasingId;
  /** Debug overlay — default false (do not draw grid lines) */
  showGrid?: boolean;
  /** Opacity of white stroke overlay when showGrid */
  gridOpacity?: number;
  /** Min track size in px; thinner cells are not mounted */
  epsilon?: number;
  children?: React.ReactNode;
};

const DEFAULT_EPSILON = 0.5;

/**
 * Dynamic axis-aligned grid — full frame, **no margins**.
 * Edges are fractions 0…1 of the composition (not static safe-area).
 * Pure Remotion: useCurrentFrame + interpolate + theme easings.
 */
export const DynamicGrid: React.FC<DynamicGridProps> = ({
  formatId,
  cols,
  rows,
  keyframes,
  easingId,
  showGrid = false,
  gridOpacity = 1,
  epsilon = DEFAULT_EPSILON,
  children,
}) => {
  const frame = useCurrentFrame();
  const format = getFormat(formatId);
  /** Full-bleed frame rect — dynamic grid ignores format margins */
  const frameRect = {
    x: 0,
    y: 0,
    width: format.widthPx,
    height: format.heightPx,
  };
  const easing = easingById[easingId];

  validateKeyframes(keyframes, cols, rows);

  const colEdgesUnit = interpolateColEdges(frame, keyframes, cols, easing);
  const rowEdgesUnit = interpolateRowEdges(frame, keyframes, rows, easing);

  const colEdgesPx = colEdgesUnit.map((t) => frameRect.x + t * frameRect.width);
  const rowEdgesPx = rowEdgesUnit.map((t) => frameRect.y + t * frameRect.height);

  const resolveRectRaw = (
    col: number,
    row: number,
    colSpan: number,
    rowSpan: number,
  ): CellRect => {
    if (
      col < 0 ||
      row < 0 ||
      col + colSpan > cols ||
      row + rowSpan > rows
    ) {
      throw new Error(
        `GridCell (${col},${row}) span ${colSpan}×${rowSpan} outside ${cols}×${rows}`,
      );
    }
    const left = colEdgesPx[col]!;
    const right = colEdgesPx[col + colSpan]!;
    const top = rowEdgesPx[row]!;
    const bottom = rowEdgesPx[row + rowSpan]!;
    return {
      left,
      top,
      width: right - left,
      height: bottom - top,
    };
  };

  const resolveRect = (
    col: number,
    row: number,
    colSpan: number,
    rowSpan: number,
  ): CellRect | null => {
    const rect = resolveRectRaw(col, row, colSpan, rowSpan);
    if (rect.width < epsilon || rect.height < epsilon) {
      return null;
    }
    return rect;
  };

  const contextValue = useMemo(
    () => ({
      colEdgesPx,
      rowEdgesPx,
      epsilon,
      resolveRect,
      resolveRectRaw,
    }),
    // recreate when edges change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [colEdgesPx.join(), rowEdgesPx.join(), epsilon, cols, rows],
  );

  return (
    <DynamicGridProvider value={contextValue}>
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        {children}
        {showGrid && gridOpacity > 0.001 ? (
          <GridLines
            colEdgesPx={colEdgesPx}
            rowEdgesPx={rowEdgesPx}
            frame={frameRect}
            opacity={gridOpacity}
          />
        ) : null}
      </AbsoluteFill>
    </DynamicGridProvider>
  );
};

const GridLines: React.FC<{
  colEdgesPx: number[];
  rowEdgesPx: number[];
  frame: { x: number; y: number; width: number; height: number };
  opacity: number;
}> = ({ colEdgesPx, rowEdgesPx, frame, opacity }) => (
  <AbsoluteFill style={{ pointerEvents: "none", opacity: 0.55 * opacity }}>
    {colEdgesPx.map((x, i) => (
      <div
        key={`c-${i}`}
        style={{
          position: "absolute",
          left: x,
          top: frame.y,
          width: 1,
          height: frame.height,
          backgroundColor: gridStroke,
        }}
      />
    ))}
    {rowEdgesPx.map((y, i) => (
      <div
        key={`r-${i}`}
        style={{
          position: "absolute",
          left: frame.x,
          top: y,
          width: frame.width,
          height: 1,
          backgroundColor: gridStroke,
        }}
      />
    ))}
  </AbsoluteFill>
);
