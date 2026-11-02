/**
 * Brand palette + fill rules (гайдбук «ЦВЕТА»).
 *
 * Fills (фоны блоков / ячеек):
 * - Prefer `black` (#121212) — основной фон
 * - Also `grayLight` (#F1F1F1) — вторичный фон
 * - Avoid large harsh bright fills (pink/cyan/fresh/yellow/violet as full-cell backgrounds)
 *
 * Accents (текст, точки, мелкие UI): cyan, pink, fresh, yellow, violet — ок.
 *
 * Grids (static/dynamic debug & cell chrome):
 * - No bright fills on grid chrome
 * - White stroke/outline only (`white`)
 */
export const black = "#121212";
export const white = "#FFFFFF";
export const grayMid = "#737373";
export const grayDark = "#424242";
export const grayLight = "#F1F1F1";
export const cyan = "#7ACBFA";
export const pink = "#C261F7";
export const fresh = "#93E3CA";
export const yellow = "#E2D083";
export const violet = "#B09BF9";

export const colors = {
  black,
  white,
  grayMid,
  grayDark,
  grayLight,
  cyan,
  pink,
  fresh,
  yellow,
  violet,
} as const;

/** Allowed large-area fills */
export const fillSurfaces = {
  primary: black,
  secondary: grayLight,
} as const;

/** Accent tokens — text / marks, not full-bleed cell fills */
export const accentColors = {
  cyan,
  pink,
  fresh,
  yellow,
  violet,
} as const;

/** Grid / cell chrome stroke */
export const gridStroke = white;
