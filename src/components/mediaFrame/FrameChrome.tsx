import React from "react";
import { AbsoluteFill } from "remotion";
import { gridStroke } from "../../theme/colors";

export type OvalRect = {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
};

type FrameChromeProps = {
  width: number;
  height: number;
  oval: OvalRect;
  stroke?: string;
};

/** Light chrome outside the media frame: corner crosses + short ticks on the oval */
export const FrameChrome: React.FC<FrameChromeProps> = ({
  width,
  height,
  oval,
  stroke = gridStroke,
}) => {
  const arm = Math.max(8, Math.round(Math.min(width, height) * 0.012));
  const tick = Math.max(6, Math.round(arm * 0.9));
  const { cx, cy, rx, ry } = oval;

  const cross = (x: number, y: number, key: string) => (
    <React.Fragment key={key}>
      <div
        style={{
          position: "absolute",
          left: x - arm,
          top: y - 0.5,
          width: arm * 2,
          height: 1,
          backgroundColor: stroke,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: x - 0.5,
          top: y - arm,
          width: 1,
          height: arm * 2,
          backgroundColor: stroke,
        }}
      />
    </React.Fragment>
  );

  const ticks = [
    { x: cx, y: cy - ry, dx: 0, dy: -1 },
    { x: cx, y: cy + ry, dx: 0, dy: 1 },
    { x: cx - rx, y: cy, dx: -1, dy: 0 },
    { x: cx + rx, y: cy, dx: 1, dy: 0 },
  ];

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {cross(arm * 2, arm * 2, "tl")}
      {cross(width - arm * 2, arm * 2, "tr")}
      {cross(arm * 2, height - arm * 2, "bl")}
      {cross(width - arm * 2, height - arm * 2, "br")}
      {ticks.map((t, i) => (
        <div
          key={`tick-${i}`}
          style={{
            position: "absolute",
            left: t.dx === 0 ? t.x - 0.5 : t.x + t.dx * 2,
            top: t.dy === 0 ? t.y - 0.5 : t.y + t.dy * 2,
            width: t.dx === 0 ? 1 : tick,
            height: t.dy === 0 ? 1 : tick,
            backgroundColor: stroke,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};
