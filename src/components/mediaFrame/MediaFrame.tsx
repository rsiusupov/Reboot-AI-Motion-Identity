import React from "react";
import type { OvalRect } from "./FrameChrome";

export type MediaFrameShape = "oval";

export type MediaFrameProps = {
  shape?: MediaFrameShape;
  width: number;
  height: number;
  /** Oval radii as fractions of frame size (default horizontal ellipse) */
  rxRatio?: number;
  ryRatio?: number;
  children?: React.ReactNode;
};

export const getOvalRect = (
  width: number,
  height: number,
  rxRatio = 0.38,
  ryRatio = 0.22,
): OvalRect => ({
  cx: width / 2,
  cy: height / 2,
  rx: width * rxRatio,
  ry: height * ryRatio,
});

/**
 * Primitive shape as a frame/mask for footage (not decorative alone).
 * Type outside this mask is never scaled by the media cell.
 */
export const MediaFrame: React.FC<MediaFrameProps> = ({
  shape = "oval",
  width,
  height,
  rxRatio = 0.38,
  ryRatio = 0.22,
  children,
}) => {
  const oval = getOvalRect(width, height, rxRatio, ryRatio);

  if (shape !== "oval") {
    return null;
  }

  return (
    <div
      data-media-frame={shape}
      style={{
        position: "absolute",
        left: oval.cx - oval.rx,
        top: oval.cy - oval.ry,
        width: oval.rx * 2,
        height: oval.ry * 2,
        borderRadius: "50%",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <div style={{ position: "absolute", inset: 0 }}>{children}</div>
    </div>
  );
};
