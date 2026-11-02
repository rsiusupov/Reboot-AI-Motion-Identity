import { interpolate } from "remotion";
import type { GridKeyframe } from "./types";

const assertMonotonic = (edges: number[], label: string) => {
  for (let i = 1; i < edges.length; i++) {
    if (edges[i]! < edges[i - 1]!) {
      throw new Error(`${label} must be monotonic non-decreasing`);
    }
  }
};

export const validateKeyframes = (
  keyframes: GridKeyframe[],
  cols: number,
  rows: number,
) => {
  if (keyframes.length < 1) {
    throw new Error("DynamicGrid requires at least one keyframe");
  }
  for (const kf of keyframes) {
    if (kf.colEdges.length !== cols + 1) {
      throw new Error(
        `colEdges length must be cols+1 (${cols + 1}), got ${kf.colEdges.length}`,
      );
    }
    if (kf.rowEdges.length !== rows + 1) {
      throw new Error(
        `rowEdges length must be rows+1 (${rows + 1}), got ${kf.rowEdges.length}`,
      );
    }
    assertMonotonic(kf.colEdges, "colEdges");
    assertMonotonic(kf.rowEdges, "rowEdges");
  }
};

/**
 * Segment-wise interpolate of one edge index across keyframes.
 * Easing applies within each segment (Remotion interpolate + theme easing).
 */
export const interpolateEdgeSeries = (
  frame: number,
  keyframes: GridKeyframe[],
  pick: (kf: GridKeyframe) => number[],
  edgeIndex: number,
  easing: (t: number) => number,
): number => {
  const sorted = [...keyframes].sort((a, b) => a.frame - b.frame);
  if (frame <= sorted[0]!.frame) {
    return pick(sorted[0]!)[edgeIndex]!;
  }
  const last = sorted[sorted.length - 1]!;
  if (frame >= last.frame) {
    return pick(last)[edgeIndex]!;
  }

  let i = 0;
  while (i < sorted.length - 1 && frame >= sorted[i + 1]!.frame) {
    i++;
  }
  const a = sorted[i]!;
  const b = sorted[i + 1]!;
  return interpolate(frame, [a.frame, b.frame], [pick(a)[edgeIndex]!, pick(b)[edgeIndex]!], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

export const interpolateColEdges = (
  frame: number,
  keyframes: GridKeyframe[],
  cols: number,
  easing: (t: number) => number,
): number[] =>
  Array.from({ length: cols + 1 }, (_, i) =>
    interpolateEdgeSeries(frame, keyframes, (kf) => kf.colEdges, i, easing),
  );

export const interpolateRowEdges = (
  frame: number,
  keyframes: GridKeyframe[],
  rows: number,
  easing: (t: number) => number,
): number[] =>
  Array.from({ length: rows + 1 }, (_, i) =>
    interpolateEdgeSeries(frame, keyframes, (kf) => kf.rowEdges, i, easing),
  );
