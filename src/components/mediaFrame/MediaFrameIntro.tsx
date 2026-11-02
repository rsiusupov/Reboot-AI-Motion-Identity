import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { colors } from "../../theme/colors";
import { staticGrid } from "../../theme/grid";
import { ms500 } from "../../theme/timing";
import { ColorRamp } from "./ColorRamp";
import { FrameChrome, type OvalRect } from "./FrameChrome";
import {
  CaptionScatter,
  buildRadialScatterItems,
  type CaptionScatterItem,
} from "./CaptionScatter";
import { LensDistort } from "./LensDistort";
import { MediaFrame, getOvalRect } from "./MediaFrame";
import { useMediaIntroPunch } from "./useMediaIntroPunch";

export type MediaFrameIntroProps = {
  /** Optional still/video URL for lens sampling; procedural if omitted */
  src?: string;
  /** Override punch amounts (otherwise driven by frame via useMediaIntroPunch) */
  amountLens?: number;
  amountRamp?: number;
  startFrame?: number;
  durationFrames?: number;
  captionItems?: CaptionScatterItem[];
  showChrome?: boolean;
  background?: string;
};

const DEFAULT_LABELS = [
  "sample",
  "noise",
  "expression",
  "signal",
  "grain",
  "offset",
  "buffer",
  "frame",
];

/**
 * Reusable transition language: shape-masked footage + short intro punch
 * (lens barrel + cyan/pink ramp + step caption scatter on staticGrid) ~ms500 → clean media.
 */
export const MediaFrameIntro: React.FC<MediaFrameIntroProps> = ({
  src,
  amountLens: amountLensProp,
  amountRamp: amountRampProp,
  startFrame = 0,
  durationFrames = ms500,
  captionItems,
  showChrome = true,
  background = colors.grayLight,
}) => {
  const { width, height } = useVideoConfig();
  const punch = useMediaIntroPunch({ startFrame, durationFrames });
  const amountLens = amountLensProp ?? punch.amountLens;
  const amountRamp = amountRampProp ?? punch.amountRamp;

  const oval: OvalRect = getOvalRect(width, height);
  const centerCol = Math.round(staticGrid.cols / 2);
  const centerRow = Math.round(staticGrid.rows / 2);

  const items =
    captionItems ??
    buildRadialScatterItems(
      DEFAULT_LABELS,
      { col: centerCol, row: centerRow },
      staticGrid,
      durationFrames,
      4,
    );

  return (
    <AbsoluteFill style={{ backgroundColor: background }}>
      {showChrome ? (
        <FrameChrome width={width} height={height} oval={oval} />
      ) : null}

      <MediaFrame width={width} height={height}>
        <LensDistort
          width={Math.round(oval.rx * 2)}
          height={Math.round(oval.ry * 2)}
          amount={amountLens}
          src={src}
        />
        <ColorRamp amount={amountRamp} />
      </MediaFrame>

      <CaptionScatter
        items={items}
        grid={staticGrid}
        active={punch.active}
        fontSizeSteps={1}
        color={colors.grayDark}
      />
    </AbsoluteFill>
  );
};
