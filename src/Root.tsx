import { Composition } from "remotion";
import {
  DynamicGridMorphDemo,
  DYNAMIC_GRID_MORPH_DURATION,
} from "./compositions/DynamicGridMorphDemo";
import { activeFormat } from "./theme/formats";
import { masterFps } from "./theme/timing";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="RebootMotionIdentity"
      component={DynamicGridMorphDemo}
      durationInFrames={DYNAMIC_GRID_MORPH_DURATION}
      fps={masterFps}
      width={activeFormat.widthPx}
      height={activeFormat.heightPx}
    />
  );
};
