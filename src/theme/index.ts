export * from "./colors";
export * from "./typography";
export * from "./spacing";
import { colors, getColors, ColorScheme } from './colors';
import { typography } from './typography';
import { spacing, borderRadius, shadows } from './spacing';

export { colors, getColors, type ColorScheme };
export { typography };
export { spacing, borderRadius, shadows };

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
};

export type Theme = typeof theme;

