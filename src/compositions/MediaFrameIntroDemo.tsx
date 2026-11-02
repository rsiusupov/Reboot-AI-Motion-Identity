import React from "react";
import { MediaFrameIntro } from "../components/mediaFrame";
import { holdTextMinFrames, ms500 } from "../theme/timing";
import { loadBrandFonts } from "../theme/typography";

loadBrandFonts();

/** ~2–3s: punch ms500, then clean oval hold */
export const MEDIA_FRAME_INTRO_DURATION = ms500 + holdTextMinFrames;

export const MediaFrameIntroDemo: React.FC = () => (
  <MediaFrameIntro startFrame={0} durationFrames={ms500} showChrome />
);
