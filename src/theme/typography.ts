/**
 * Brand typography — local fonts from public/ only.
 * Do not use @remotion/google-fonts for these families.
 *
 * display — H1 / brand titles (TT Bluescreens Condensed Demibold)
 * mono    — H2, captions, table headers (JetBrains Mono)
 * body    — body copy & large quotes (Helvetica Neue)
 */
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const displayFamily = "TT Bluescreens";
export const monoFamily = "JetBrains Mono";
export const bodyFamily = "Helvetica Neue";

export const displayFile = "TT Bluescreens Trial Variable.ttf";
export const monoFile = "JetBrainsMono-VariableFont_wght.ttf";
export const bodyFile = "HelveticaNeueCyr-Roman.ttf";

/** Condensed Demibold instance on the variable file */
export const displayWeight = 600;
export const displayStretch = "condensed";
export const displayVariationSettings = '"wdth" 75, "wght" 600';

export const fontStacks = {
  display: `"${displayFamily}", sans-serif`,
  mono: `"${monoFamily}", ui-monospace, monospace`,
  body: `"${bodyFamily}", Helvetica, Arial, sans-serif`,
} as const;

export const fonts = {
  display: {
    family: displayFamily,
    file: displayFile,
    stack: fontStacks.display,
    weight: displayWeight,
    stretch: displayStretch,
    fontVariationSettings: displayVariationSettings,
    role: "Заголовки первого уровня",
  },
  mono: {
    family: monoFamily,
    file: monoFile,
    stack: fontStacks.mono,
    role: "Подзаголовки, caption, H2, подписи в таблицах",
  },
  body: {
    family: bodyFamily,
    file: bodyFile,
    stack: fontStacks.body,
    role: "Обычный текст и цитаты крупным кеглем",
  },
} as const;

export const displayStyle = {
  fontFamily: fontStacks.display,
  fontWeight: displayWeight,
  fontStretch: displayStretch,
  fontVariationSettings: displayVariationSettings,
} as const;

export const monoStyle = {
  fontFamily: fontStacks.mono,
} as const;

export const bodyStyle = {
  fontFamily: fontStacks.body,
} as const;

let fontsPromise: Promise<void> | null = null;

export const loadBrandFonts = (): Promise<void> => {
  if (!fontsPromise) {
    fontsPromise = Promise.all([
      loadFont({
        family: displayFamily,
        url: staticFile(displayFile),
        weight: String(displayWeight),
        stretch: displayStretch,
      }),
      loadFont({
        family: displayFamily,
        url: staticFile(displayFile),
        weight: String(displayWeight),
        stretch: displayStretch,
        style: "italic",
      }),
      loadFont({
        family: monoFamily,
        url: staticFile(monoFile),
      }),
      loadFont({
        family: bodyFamily,
        url: staticFile(bodyFile),
        weight: "400",
      }),
    ]).then(() => undefined);
  }
  return fontsPromise;
};

loadBrandFonts();
