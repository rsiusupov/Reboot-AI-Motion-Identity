export type GridKeyframe = {
  frame: number;
  /** Monotonic edges in 0…1 of full frame (no margins); length = cols + 1 */
  colEdges: number[];
  /** Monotonic edges in 0…1 of full frame (no margins); length = rows + 1 */
  rowEdges: number[];
};

export type CellRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type GridCellContent = "media" | "type";
