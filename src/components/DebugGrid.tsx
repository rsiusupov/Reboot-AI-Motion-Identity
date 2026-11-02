import React from "react";
import { AbsoluteFill } from "remotion";
import { colors } from "../theme/colors";
import type { StaticGrid } from "../theme/grid";

type DebugGridProps = {
  grid: StaticGrid;
  /** Must be explicitly true — static grid is invisible by default */
  showGrid?: boolean;
  color?: string;
  opacity?: number;
  showCorners?: boolean;
};

/**
 * Optional debug overlay for staticGrid. Default: not shown (showGrid=false).
 */
export const DebugGrid: React.FC<DebugGridProps> = ({
  grid,
  showGrid = false,
  color = colors.white,
  opacity = 0.55,
  showCorners = true,
}) => {
  if (!showGrid) {
    return null;
  }

  const { origin, step, widthPx, heightPx, cols, rows } = grid;
  const lines: React.ReactNode[] = [];

  for (let c = 0; c <= cols; c++) {
    const x = origin.x + c * step;
    lines.push(
      <div
        key={`v-${c}`}
        style={{
          position: "absolute",
          left: x,
          top: origin.y,
          width: 1,
          height: heightPx,
          backgroundColor: color,
          opacity,
          pointerEvents: "none",
        }}
      />,
    );
  }

  for (let r = 0; r <= rows; r++) {
    const y = origin.y + r * step;
    lines.push(
      <div
        key={`h-${r}`}
        style={{
          position: "absolute",
          left: origin.x,
          top: y,
          width: widthPx,
          height: 1,
          backgroundColor: color,
          opacity,
          pointerEvents: "none",
        }}
      />,
    );
  }

  const corner = (col: number, row: number, key: string) => {
    const { x, y } = grid.snapPoint({ col, row });
    const arm = Math.max(6, Math.round(step * 0.2));
    const stroke = colors.white;
    return (
      <React.Fragment key={key}>
        <div
          style={{
            position: "absolute",
            left: x,
            top: y,
            width: arm,
            height: 2,
            backgroundColor: stroke,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: x,
            top: y,
            width: 2,
            height: arm,
            backgroundColor: stroke,
            pointerEvents: "none",
          }}
        />
      </React.Fragment>
    );
  };

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {lines}
      {showCorners
        ? [
            corner(0, 0, "tl"),
            corner(cols, 0, "tr"),
            corner(0, rows, "bl"),
            corner(cols, rows, "br"),
          ]
        : null}
    </AbsoluteFill>
  );
};
