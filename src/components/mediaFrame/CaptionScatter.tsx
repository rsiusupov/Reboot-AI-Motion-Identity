import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { colors } from "../../theme/colors";
import {
  staticGrid,
  type StaticGrid,
} from "../../theme/grid";
import { monoStyle } from "../../theme/typography";

export type CaptionScatterPose = {
  frame: number;
  col: number;
  row: number;
  opacity?: number;
};

export type CaptionScatterItem = {
  text: string;
  /** Discrete poses on staticGrid — no lerp between cells */
  poses: CaptionScatterPose[];
};

export type CaptionScatterProps = {
  items: CaptionScatterItem[];
  grid?: StaticGrid;
  /** When false, layer unmounted (after intro punch) */
  active?: boolean;
  fontSizeSteps?: number;
  color?: string;
};

const pickPose = (
  poses: CaptionScatterPose[],
  frame: number,
): CaptionScatterPose | null => {
  if (poses.length === 0) {
    return null;
  }
  const sorted = [...poses].sort((a, b) => a.frame - b.frame);
  let chosen = sorted[0]!;
  for (const p of sorted) {
    if (p.frame <= frame) {
      chosen = p;
    } else {
      break;
    }
  }
  return chosen;
};

/**
 * Caption scatter: JetBrains Mono labels stepping on staticGrid intersections only.
 * Positions are posterized (discrete keys / step) — never smooth-lerped in px.
 */
export const CaptionScatter: React.FC<CaptionScatterProps> = ({
  items,
  grid = staticGrid,
  active = true,
  fontSizeSteps = 1,
  color = colors.grayDark,
}) => {
  const frame = useCurrentFrame();
  if (!active) {
    return null;
  }

  const fontSize = grid.typeSize(fontSizeSteps);

  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      {items.map((item, i) => {
        const pose = pickPose(item.poses, frame);
        if (!pose || (pose.opacity ?? 1) <= 0) {
          return null;
        }
        const { x, y } = grid.snapPoint({ col: pose.col, row: pose.row });
        return (
          <div
            key={`${item.text}-${i}`}
            style={{
              ...monoStyle,
              position: "absolute",
              left: x,
              top: y,
              fontSize,
              lineHeight: `${grid.lineHeight(fontSizeSteps)}px`,
              color,
              opacity: pose.opacity ?? 1,
              whiteSpace: "nowrap",
              letterSpacing: "0.04em",
              textTransform: "lowercase",
              transform: "none",
            }}
          >
            {item.text}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** Helper: build outward step paths from a center cell (scatter language) */
export const buildRadialScatterItems = (
  labels: string[],
  center: { col: number; row: number },
  grid: StaticGrid,
  durationFrames: number,
  steps = 4,
): CaptionScatterItem[] => {
  const dirs = [
    { dc: 1, dr: 0 },
    { dc: -1, dr: 0 },
    { dc: 0, dr: 1 },
    { dc: 0, dr: -1 },
    { dc: 1, dr: -1 },
    { dc: -1, dr: 1 },
    { dc: 1, dr: 1 },
    { dc: -1, dr: -1 },
  ];

  return labels.map((text, i) => {
    const dir = dirs[i % dirs.length]!;
    const poses: CaptionScatterPose[] = [];
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const frame = Math.round(t * (durationFrames - 1));
      const dist = 1 + s * 2;
      const col = Math.max(
        0,
        Math.min(grid.cols, center.col + dir.dc * dist),
      );
      const row = Math.max(
        0,
        Math.min(grid.rows, center.row + dir.dr * dist),
      );
      poses.push({
        frame,
        col,
        row,
        opacity: 1 - t,
      });
    }
    return { text, poses };
  });
};
