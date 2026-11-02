import React from "react";
import { AbsoluteFill } from "remotion";
import { colors } from "../../theme/colors";

export type ColorRampProps = {
  /** 1 = full duotone, 0 = invisible (clean footage) */
  amount: number;
  colorA?: string;
  colorB?: string;
};

/**
 * Duotone ramp overlay (theme accents). Mix → 0 after intro punch.
 * Does not replace footage permanently — opacity driven by `amount`.
 */
export const ColorRamp: React.FC<ColorRampProps> = ({
  amount,
  colorA = colors.cyan,
  colorB = colors.pink,
}) => {
  if (amount <= 0.001) {
    return null;
  }

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        opacity: amount,
        mixBlendMode: "color",
        backgroundImage: `linear-gradient(135deg, ${colorA} 0%, ${colorB} 100%)`,
      }}
    />
  );
};
