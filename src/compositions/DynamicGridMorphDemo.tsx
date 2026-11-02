import {
  AbsoluteFill,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {
  CellVideoFill,
  DynamicGrid,
  GridCell,
  MediaPlaceholder,
} from "../components";
import type { GridKeyframe } from "../components";
import { colors } from "../theme/colors";
import { activeFormatId } from "../theme/formats";
import { holdTextMinFrames, ms600, ms1000 } from "../theme/timing";

/**
 * Continuous morph: 2×2 → 3×3 (center = sensor mp4) → full frame.
 * CellVideoFill keepMounted — video never remounts, expand is seamless.
 * Holds ≥ holdTextMinFrames so grid beats + full sensor play read as one piece.
 */

export const EDGES_2X2 = [0, 0.5, 0.5, 1] as const;
export const EDGES_3X3 = [0, 1 / 3, 2 / 3, 1] as const;
export const EDGES_FULL_CENTER = [0, 0, 1, 1] as const;

const t0 = 0;
/** Opening 2×2 readable beat */
const tHold2 = holdTextMinFrames;
const tTo3 = tHold2 + ms600;
/** 3×3 with center sensor visible */
const tHold3 = tTo3 + holdTextMinFrames;
const tToFull = tHold3 + ms600;
/** Full-frame sensor — long enough to sit with the morph as one timeline */
const tHoldFull = tToFull + holdTextMinFrames * 2 + ms1000;

export const MORPH_HANDOFF_FRAME = tToFull;
export const DYNAMIC_GRID_MORPH_DURATION = tHoldFull;

export const morph2x2To3x3Keyframes: GridKeyframe[] = [
  { frame: t0, colEdges: [...EDGES_2X2], rowEdges: [...EDGES_2X2] },
  { frame: tHold2, colEdges: [...EDGES_2X2], rowEdges: [...EDGES_2X2] },
  { frame: tTo3, colEdges: [...EDGES_3X3], rowEdges: [...EDGES_3X3] },
  { frame: tHold3, colEdges: [...EDGES_3X3], rowEdges: [...EDGES_3X3] },
  {
    frame: tToFull,
    colEdges: [...EDGES_FULL_CENTER],
    rowEdges: [...EDGES_FULL_CENTER],
  },
  {
    frame: tHoldFull,
    colEdges: [...EDGES_FULL_CENTER],
    rowEdges: [...EDGES_FULL_CENTER],
  },
];

export const sceneAfterHandoffKeyframes: GridKeyframe[] = [
  {
    frame: 0,
    colEdges: [...EDGES_FULL_CENTER],
    rowEdges: [...EDGES_FULL_CENTER],
  },
];

const CHROME_CELLS: Array<{ col: number; row: number }> = [];
for (let row = 0; row < 3; row++) {
  for (let col = 0; col < 3; col++) {
    if (col === 1 && row === 1) continue;
    CHROME_CELLS.push({ col, row });
  }
}

/** Entrance cell (2,0) — top-right square of the opening 2×2 */
const SQUARE_2_0_SRC = staticFile("assets/square-2-0.mp4");

export const DynamicGridMorphDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const gridOpacity = interpolate(frame, [tHold3, tToFull], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.black }}>
      <DynamicGrid
        formatId={activeFormatId}
        cols={3}
        rows={3}
        keyframes={morph2x2To3x3Keyframes}
        easingId="expressive"
        showGrid
        gridOpacity={gridOpacity}
      >
        {CHROME_CELLS.map(({ col, row }) => (
          <GridCell key={`${col}-${row}`} col={col} row={row} content="media">
            <div style={{ opacity: gridOpacity, width: "100%", height: "100%" }}>
              {col === 2 && row === 0 ? (
                <OffthreadVideo
                  src={SQUARE_2_0_SRC}
                  muted
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <MediaPlaceholder label={`${col},${row}`} />
              )}
            </div>
          </GridCell>
        ))}

        <CellVideoFill col={1} row={1} keepMounted />
      </DynamicGrid>
    </AbsoluteFill>
  );
};
