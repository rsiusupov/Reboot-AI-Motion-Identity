/**
 * staticGrid — data only (not drawn, not animated).
 *
 * Origin accounts for format margins. Defines where brand elements MAY sit:
 * snap / typeSize / lineHeight. Headlines & brand anchors use this — never dynamicGrid.
 */
import {
  activeFormat,
  type Format,
  type FormatId,
  getFormat,
  getSafeAreaRect,
} from "./formats";

export type GridPoint = { col: number; row: number };
export type PxPoint = { x: number; y: number };
export type GridOrigin = { x: number; y: number };

export type StaticGrid = {
  format: Format;
  /** Top-left of working grid (= safe-area origin from margins) */
  origin: GridOrigin;
  step: number;
  /** Working cols/rows inside margins */
  cols: number;
  rows: number;
  widthPx: number;
  heightPx: number;
  margins: {
    marginTop: number;
    marginRight: number;
    marginBottom: number;
    marginLeft: number;
  };
  cellToPx: (col: number, row: number) => PxPoint;
  snapPoint: (point: GridPoint) => PxPoint;
  typeSize: (steps: number) => number;
  lineHeight: (steps: number) => number;
};

/** @deprecated use StaticGrid */
export type Grid = StaticGrid;

export const createStaticGrid = (format: Format = activeFormat): StaticGrid => {
  const step = format.cellSizePx;
  const safe = getSafeAreaRect(format);
  const cols =
    format.widthCells - format.marginLeft - format.marginRight;
  const rows =
    format.heightCells - format.marginTop - format.marginBottom;

  if (cols < 1 || rows < 1) {
    throw new Error(
      `staticGrid for ${format.id}: margins leave no working cells (${cols}×${rows})`,
    );
  }

  const origin: GridOrigin = { x: safe.x, y: safe.y };

  const cellToPx = (col: number, row: number): PxPoint => ({
    x: origin.x + col * step,
    y: origin.y + row * step,
  });

  const snapPoint = ({ col, row }: GridPoint): PxPoint => cellToPx(col, row);

  const typeSize = (steps: number): number => {
    if (!Number.isInteger(steps) || steps < 1) {
      throw new Error(`typeSize steps must be integer ≥ 1, got ${steps}`);
    }
    return steps * step;
  };

  const lineHeight = (steps: number): number => {
    if (!Number.isInteger(steps) || steps < 1) {
      throw new Error(`lineHeight steps must be integer ≥ 1, got ${steps}`);
    }
    return steps * step;
  };

  return {
    format,
    origin,
    step,
    cols,
    rows,
    widthPx: safe.width,
    heightPx: safe.height,
    margins: {
      marginTop: format.marginTop,
      marginRight: format.marginRight,
      marginBottom: format.marginBottom,
      marginLeft: format.marginLeft,
    },
    cellToPx,
    snapPoint,
    typeSize,
    lineHeight,
  };
};

export const staticGridFor = (formatId: FormatId): StaticGrid =>
  createStaticGrid(getFormat(formatId));

/** Active format static coordinate system */
export const staticGrid = createStaticGrid(activeFormat);

/** @deprecated use staticGrid */
export const activeGrid = staticGrid;

/** @deprecated use createStaticGrid */
export const createGrid = (
  format: Format = activeFormat,
  _origin?: GridOrigin,
): StaticGrid => createStaticGrid(format);

/** @deprecated use staticGridFor */
export const gridFor = (formatId: FormatId): StaticGrid =>
  staticGridFor(formatId);
