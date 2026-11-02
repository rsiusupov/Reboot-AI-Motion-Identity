/**
 * Motion easings. Duration ladder lives in timing.ts (@ masterFps 30).
 *
 * standardSmooth — обычное UI-движение
 * decelerate — выезд / остановка
 * expressive — акцент / характер
 *
 * Не подбирать другие bezier без явного запроса.
 */
import { Easing } from "remotion";

export const standardSmooth = [0.4, 0.14, 0.3, 1] as const;
export const decelerate = [0, 0, 0, 1] as const;
export const expressive = [0.5, 0, 0, 1] as const;

export const easings = {
  standardSmooth,
  decelerate,
  expressive,
} as const;

export type EasingBezier = readonly [number, number, number, number];

export const easingStandardSmooth = Easing.bezier(...easings.standardSmooth);
export const easingDecelerate = Easing.bezier(...easings.decelerate);
export const easingExpressive = Easing.bezier(...easings.expressive);

export type EasingId = keyof typeof easings;

export const easingById = {
  standardSmooth: easingStandardSmooth,
  decelerate: easingDecelerate,
  expressive: easingExpressive,
} as const satisfies Record<EasingId, (t: number) => number>;
