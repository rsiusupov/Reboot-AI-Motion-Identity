import { interpolate, useCurrentFrame } from "remotion";
import {
  easingById,
  type EasingId,
} from "../../theme/easings";
import { ms500 } from "../../theme/timing";

export type MediaIntroPunchOptions = {
  /** Frame where punch starts (default 0) */
  startFrame?: number;
  /** Punch length — default theme `ms500` (15f) */
  durationFrames?: number;
  lensEasingId?: EasingId;
  rampEasingId?: EasingId;
};

/**
 * Reusable media-frame intro punch amounts (1 → 0 over ~ms500).
 * Language of entering footage inside a shape mask — not a one-off scene.
 */
export const useMediaIntroPunch = (options: MediaIntroPunchOptions = {}) => {
  const frame = useCurrentFrame();
  const startFrame = options.startFrame ?? 0;
  const durationFrames = options.durationFrames ?? ms500;
  const endFrame = startFrame + durationFrames;
  const lensEasing = easingById[options.lensEasingId ?? "decelerate"];
  const rampEasing = easingById[options.rampEasingId ?? "standardSmooth"];

  const amountLens = interpolate(frame, [startFrame, endFrame], [1, 0], {
    easing: lensEasing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const amountRamp = interpolate(frame, [startFrame, endFrame], [1, 0], {
    easing: rampEasing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const active = frame >= startFrame && frame < endFrame;

  return {
    frame,
    startFrame,
    endFrame,
    durationFrames,
    amountLens,
    amountRamp,
    /** True while punch overlays should exist; false → unmount scatter etc. */
    active,
  };
};
