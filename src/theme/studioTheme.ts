import { createLightTheme, type BrandVariants } from "@fluentui/react-components";
import Color from "color";

const WHITE = "#ffffff";
const BLACK = "#000000";

export const BRAND_COLOR = "#f6b118";

const hsvToRgb = (h: number, s: number, v: number) => {
  const normalizedH = h / 360;
  const normalizedS = s / 100;
  const normalizedV = v / 100;

  const c = normalizedV * normalizedS;
  const x = c * (1 - Math.abs(((normalizedH * 6) % 2) - 1));
  const m = normalizedV - c;

  const mapChannel = (n: number) => Math.round((n + m) * 255);

  if (normalizedH >= 0 && normalizedH < 1 / 6) {
    return { r: mapChannel(c), g: mapChannel(x), b: mapChannel(0) };
  }
  if (normalizedH >= 1 / 6 && normalizedH < 2 / 6) {
    return { r: mapChannel(x), g: mapChannel(c), b: mapChannel(0) };
  }
  if (normalizedH >= 2 / 6 && normalizedH < 3 / 6) {
    return { r: mapChannel(0), g: mapChannel(c), b: mapChannel(x) };
  }
  if (normalizedH >= 3 / 6 && normalizedH < 4 / 6) {
    return { r: mapChannel(0), g: mapChannel(x), b: mapChannel(c) };
  }
  if (normalizedH >= 4 / 6 && normalizedH < 5 / 6) {
    return { r: mapChannel(x), g: mapChannel(0), b: mapChannel(c) };
  }
  return { r: mapChannel(c), g: mapChannel(0), b: mapChannel(x) };
};

const modifyColor = (color: string, saturation: number, brightness: number) => {
  const { h } = Color(color).hsv().object();
  const rgb = hsvToRgb(h ?? 0, saturation, brightness);
  return Color.rgb([rgb.r, rgb.g, rgb.b]).hex().toLowerCase();
};

export const getPrimaryLightColor = (accentColor: string) =>
  modifyColor(accentColor, 3, 97);

export const getTertiaryLightColor = (accentColor: string) =>
  modifyColor(accentColor, 4, 85);

export const getPrimaryDarkColor = (accentColor: string) =>
  modifyColor(accentColor, 22, 9);

export const getSecondaryDarkColor = (accentColor: string) =>
  modifyColor(accentColor, 18, 18);

export const getHighlightColor = (accentColor: string) =>
  modifyColor(accentColor, 36, 100);

export const getTranslucentColor = (accentColor: string) =>
  modifyColor(accentColor, 9, 100);

export const getRgbForLottie = (accentColor: string) =>
  Color(accentColor)
    .rgb()
    .array()
    .map((value) => value / 255);

const mixWith = (base: string, target: string, ratio: number) =>
  Color(base).mix(Color(target), ratio).hex().toLowerCase();

const buildBrandRamp = (accentColor: string): BrandVariants => ({
  10: mixWith(accentColor, WHITE, 0.95),
  20: mixWith(accentColor, WHITE, 0.9),
  30: mixWith(accentColor, WHITE, 0.75),
  40: mixWith(accentColor, WHITE, 0.6),
  50: mixWith(accentColor, WHITE, 0.4),
  60: Color(accentColor).hex().toLowerCase(),
  70: mixWith(accentColor, BLACK, 0.1),
  80: mixWith(accentColor, BLACK, 0.2),
  90: mixWith(accentColor, BLACK, 0.3),
  100: mixWith(accentColor, BLACK, 0.4),
  110: mixWith(accentColor, BLACK, 0.5),
  120: mixWith(accentColor, BLACK, 0.6),
  130: mixWith(accentColor, BLACK, 0.7),
  140: mixWith(accentColor, BLACK, 0.78),
  150: mixWith(accentColor, BLACK, 0.86),
  160: mixWith(accentColor, BLACK, 0.94),
});

export const setColors = (themeColor: string = BRAND_COLOR) => {
  if (typeof document === "undefined") return;

  const secondaryDark = getSecondaryDarkColor(themeColor);
  const brandStrokeContrast = secondaryDark;

  const colors: Record<string, string> = {
    "--theme-color": themeColor,
    "--primary-color-light": getPrimaryLightColor(themeColor),
    "--tertiary-color-light": getTertiaryLightColor(themeColor),
    "--primary-color-dark": getPrimaryDarkColor(themeColor),
    "--secondary-color-dark": secondaryDark,
    "--highlight-color": getHighlightColor(themeColor),
    "--translucent-color": getTranslucentColor(themeColor),
    "--colorBrandStroke2Contrast": brandStrokeContrast,
  };

  const root = document.documentElement;
  Object.entries(colors).forEach(([variable, value]) => {
    root.style.setProperty(variable, value);
  });
};

export const createStudioTheme = (brandColor: string = BRAND_COLOR) => {
  const theme = createLightTheme(buildBrandRamp(brandColor));
  theme.colorBrandStroke2Contrast = getTranslucentColor(brandColor);
  return theme;
};
