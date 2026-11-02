/**
 * Frame timing for SMM masters @ 30 fps.
 *
 * - Masters / delivery timeline: 30 fps
 * - Selected loops & chunks: prefer “on twos” (15 fps feel) for tactile motion,
 *   then embed into the 30 fps timeline (each pose held 2 frames).
 * - Text & infographics: on-screen ≥ 2.0 s (readable hold), then rest on HOLD.
 */

/** Delivery / master timeline */
export const masterFps = 30;

/** Effective feel when animating on twos inside a 30fps master */
export const onTwosFps = 15;

/** Hold length of one “on twos” pose inside masterFps */
export const onTwosHoldFrames = masterFps / onTwosFps; // 2

/** Text & infographics must stay readable ≥ 2.0 s @ masterFps */
export const holdTextMinSeconds = 2;
export const holdTextMinFrames = holdTextMinSeconds * masterFps; // 60

/**
 * Duration ladder @ 30 fps — prefer these tokens; don’t invent odd frame counts.
 *
 * | ms     | frames | Use                |
 * | <100   | 2–3f   | Micro ticks, snaps |
 * | 400    | 12f    | Short moves        |
 * | 500    | 15f    | Standard snappy    |
 * | 600    | 18f    | Slightly softer    |
 * | 1000   | 30f    | Full beats         |
 * | after  | HOLD   | Readable rest (≥ holdTextMinFrames for text/infographics) |
 */
export const msMicroMin = 2;
export const msMicroMax = 3;
/** Default micro tick (~100ms): 3f */
export const ms100 = msMicroMax;
export const ms400 = 12;
export const ms500 = 15;
export const ms600 = 18;
export const ms1000 = 30;

export const durationLadder = {
  microMin: msMicroMin,
  microMax: msMicroMax,
  ms100,
  ms400,
  ms500,
  ms600,
  ms1000,
  holdTextMinFrames,
} as const;

export const durations = {
  holdTextMinFrames,
  holdTextMinSeconds,
  msMicroMin,
  msMicroMax,
  ms100,
  ms400,
  ms500,
  ms600,
  ms1000,
} as const;

export const timing = {
  masterFps,
  onTwosFps,
  onTwosHoldFrames,
  holdTextMinSeconds,
  ...durationLadder,
} as const;

/**
 * Quantize a 30fps frame index onto twos (0,2,4,…).
 * Use for stepped / tactile motion samples inside a master composition.
 */
export const frameOnTwos = (frame: number): number =>
  Math.floor(frame / onTwosHoldFrames) * onTwosHoldFrames;

/**
 * Progress 0…1 along an on-twos clock for the given master frame
 * over `masterDurationFrames` (must be even for a clean loop).
 */
export const onTwosProgress = (
  frame: number,
  masterDurationFrames: number,
): number => {
  if (masterDurationFrames <= 0) {
    return 0;
  }
  const stepped = frameOnTwos(frame);
  const steppedDuration =
    Math.floor(masterDurationFrames / onTwosHoldFrames) * onTwosHoldFrames;
  if (steppedDuration <= 0) {
    return 0;
  }
  return (stepped % steppedDuration) / steppedDuration;
};

/** Convert a count of on-twos poses → frames on the 30fps master */
export const onTwosPosesToMasterFrames = (poses: number): number =>
  poses * onTwosHoldFrames;

/** Convert master frames → on-twos pose count (floor) */
export const masterFramesToOnTwosPoses = (masterFrames: number): number =>
  Math.floor(masterFrames / onTwosHoldFrames);

/** True if a visible hold is long enough for text / infographics */
export const isReadableHold = (framesOnScreen: number): boolean =>
  framesOnScreen >= holdTextMinFrames;
