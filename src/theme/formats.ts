/**
 * Multi-format feed catalog.
 * cellSizePx is fixed for all formats so every composition size is integer px.
 * Active preview default: feed-4x5 (not 16:9).
 *
 * Margins (cells, → px = n * cellSizePx) define the **static** safe-area only.
 * staticGrid + brand anchors live inside that rect.
 * dynamicGrid ignores margins — full frame, no insets.
 */

/** Shared grid step (X) in pixels — Instagram-friendly 4:5 = 1080×1350 */
export const cellSizePx = 45;

export type FormatId =
  | "feed-9x16"
  | "feed-4x5"
  | "feed-1x1"
  | "landscape-16x9";

/** Required margins from frame edge → working static grid (in cells; px = cells * cellSizePx) */
export type FormatMargins = {
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
};

export type FormatDefinition = {
  id: FormatId;
  label: string;
  ratio: `${number}:${number}`;
  /** Full frame cells (including margins) */
  widthCells: number;
  heightCells: number;
  cellSizePx: number;
  widthPx: number;
  heightPx: number;
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
};

const defaultMargins = (inset = 1): FormatMargins => ({
  marginTop: inset,
  marginRight: inset,
  marginBottom: inset,
  marginLeft: inset,
});

const defineFormat = (
  id: FormatId,
  label: string,
  ratio: FormatDefinition["ratio"],
  widthCells: number,
  heightCells: number,
  margins: FormatMargins = defaultMargins(1),
): FormatDefinition => ({
  id,
  label,
  ratio,
  widthCells,
  heightCells,
  cellSizePx,
  widthPx: widthCells * cellSizePx,
  heightPx: heightCells * cellSizePx,
  ...margins,
});

export type SafeAreaRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/** Pixel safe-area from format margins (always multiple of cellSizePx) */
export const getSafeAreaRect = (format: FormatDefinition): SafeAreaRect => {
  const step = format.cellSizePx;
  const x = format.marginLeft * step;
  const y = format.marginTop * step;
  const width =
    format.widthPx - (format.marginLeft + format.marginRight) * step;
  const height =
    format.heightPx - (format.marginTop + format.marginBottom) * step;
  return { x, y, width, height };
};

export const formats = {
  "feed-9x16": defineFormat("feed-9x16", "9:16 feed", "9:16", 45, 80),
  "feed-4x5": defineFormat("feed-4x5", "4:5 feed", "4:5", 24, 30),
  "feed-1x1": defineFormat("feed-1x1", "1:1 feed", "1:1", 45, 45),
  "landscape-16x9": defineFormat(
    "landscape-16x9",
    "16:9 landscape",
    "16:9",
    32,
    18,
  ),
} as const satisfies Record<FormatId, FormatDefinition>;

export type Format = (typeof formats)[FormatId];

export const defaultFormatId: FormatId = "feed-4x5";
export const activeFormatId: FormatId = defaultFormatId;

export const getFormat = (id: FormatId = activeFormatId): Format =>
  formats[id];

export const activeFormat = getFormat(activeFormatId);
