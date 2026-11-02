import React from "react";
import { colors, gridStroke } from "../../theme/colors";

/**
 * Media stand-in: no bright fills — white outline only (гайдбук заливок).
 * Scales with GridCell media content.
 */
export const MediaPlaceholder: React.FC<{
  label?: string;
  /** Stroke color; default brand white */
  stroke?: string;
}> = ({ label, stroke = gridStroke }) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      boxSizing: "border-box",
      backgroundColor: "transparent",
      border: `1px solid ${stroke}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      objectFit: "cover",
    }}
  >
    {label ? (
      <span
        style={{
          fontFamily: "ui-monospace, monospace",
          fontSize: 14,
          letterSpacing: "0.08em",
          color: colors.grayMid,
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
    ) : null}
  </div>
);
