import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";
import { useDynamicGrid } from "./DynamicGridContext";

export const CENTER_SENSOR_SRC = staticFile("footage/center-sensor.mp4");

type CellVideoFillProps = {
  col: number;
  row: number;
  colSpan?: number;
  rowSpan?: number;
  src?: string;
  /** Hide when collapsed, but keep <OffthreadVideo> mounted for seamless expand */
  keepMounted?: boolean;
};

/**
 * Cover video bound to a DynamicGrid cell.
 * keepMounted: stays mounted at opacity 0 while track is collapsed — seamless grow.
 */
export const CellVideoFill: React.FC<CellVideoFillProps> = ({
  col,
  row,
  colSpan = 1,
  rowSpan = 1,
  src = CENTER_SENSOR_SRC,
  keepMounted = true,
}) => {
  const { resolveRectRaw, epsilon } = useDynamicGrid();
  const rect = resolveRectRaw(col, row, colSpan, rowSpan);
  const collapsed = rect.width < epsilon || rect.height < epsilon;

  if (collapsed && !keepMounted) {
    return null;
  }

  const width = Math.max(rect.width, 1);
  const height = Math.max(rect.height, 1);

  return (
    <div
      data-grid-video={`${col},${row}`}
      style={{
        position: "absolute",
        left: rect.left,
        top: rect.top,
        width,
        height,
        overflow: "hidden",
        opacity: collapsed ? 0 : 1,
        pointerEvents: "none",
      }}
    >
      <AbsoluteFill>
        <OffthreadVideo
          src={src}
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </AbsoluteFill>
    </div>
  );
};
