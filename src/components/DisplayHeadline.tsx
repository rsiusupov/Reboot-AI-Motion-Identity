import React from "react";
import {
  displayFamily,
  displayStretch,
  displayVariationSettings,
  displayWeight,
  fontStacks,
} from "../theme/typography";
import type { StaticGrid } from "../theme/grid";
import { staticGrid } from "../theme/grid";

export type DisplayHeadlineRun = {
  text: string;
  color: string;
  italic?: boolean;
};

export type DisplayHeadlineProps = {
  /** Plain string or styled runs (no free px sizing) */
  text: string | DisplayHeadlineRun[];
  col: number;
  row: number;
  sizeSteps: number;
  lineHeightSteps: number;
  /** Always staticGrid (+ margins) — never dynamicGrid */
  grid?: StaticGrid;
  /** Default color when `text` is a plain string */
  color?: string;
};

const uprightVariation = displayVariationSettings;
const italicVariation = '"wdth" 75, "wght" 600, "slnt" 10';

/**
 * Display (TT Bluescreens) headline locked to staticGrid (margins + snap).
 * Position = snap(col,row); fontSize / line-height only via steps.
 * Do not drive this from dynamicGrid.
 */
export const DisplayHeadline: React.FC<DisplayHeadlineProps> = ({
  text,
  col,
  row,
  sizeSteps,
  lineHeightSteps,
  grid = staticGrid,
  color,
}) => {
  const { x, y } = grid.snapPoint({ col, row });
  const fontSize = grid.typeSize(sizeSteps);
  const lineHeightPx = grid.lineHeight(lineHeightSteps);

  const runs: DisplayHeadlineRun[] = Array.isArray(text)
    ? text
    : [{ text, color: color ?? "#FFFFFF" }];

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        margin: 0,
        padding: 0,
        fontFamily: fontStacks.display,
        fontWeight: displayWeight,
        fontStretch: displayStretch,
        fontSize,
        lineHeight: `${lineHeightPx}px`,
        whiteSpace: "pre",
        letterSpacing: "-0.02em",
      }}
    >
      {runs.map((run, i) => (
        <span
          key={`${i}-${run.text}`}
          style={{
            color: run.color,
            fontStyle: run.italic ? "italic" : "normal",
            fontFamily: displayFamily,
            fontWeight: displayWeight,
            fontStretch: displayStretch,
            fontVariationSettings: run.italic
              ? italicVariation
              : uprightVariation,
          }}
        >
          {run.text}
        </span>
      ))}
    </div>
  );
};
