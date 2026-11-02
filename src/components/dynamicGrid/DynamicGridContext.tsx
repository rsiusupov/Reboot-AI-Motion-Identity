import { createContext, useContext } from "react";
import type { CellRect } from "./types";

export type DynamicGridContextValue = {
  colEdgesPx: number[];
  rowEdgesPx: number[];
  /** Tracks thinner than this are not mounted */
  epsilon: number;
  /** Null when track/area &lt; epsilon (do not mount chrome cells) */
  resolveRect: (
    col: number,
    row: number,
    colSpan: number,
    rowSpan: number,
  ) => CellRect | null;
  /** Always returns geometry — for seamless media that must stay mounted */
  resolveRectRaw: (
    col: number,
    row: number,
    colSpan: number,
    rowSpan: number,
  ) => CellRect;
};

const DynamicGridContext = createContext<DynamicGridContextValue | null>(null);

export const DynamicGridProvider = DynamicGridContext.Provider;

export const useDynamicGrid = (): DynamicGridContextValue => {
  const ctx = useContext(DynamicGridContext);
  if (!ctx) {
    throw new Error("GridCell must be used inside DynamicGrid");
  }
  return ctx;
};
