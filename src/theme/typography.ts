export const typography = {
  fontFamily: {
    default: "Inter",
    ios: "SF Pro Display",
    android: "Roboto",
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 22,
    "2xl": 28,
    "3xl": 36,
  },
  fontWeight: {
    regular: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
    regular: 'Inter',
    ios: 'SF Pro Text',
    android: 'Roboto',
  },
  fontSize: {
    xs: 14,
    sm: 16,
    base: 18,
    lg: 22,
    xl: 28,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

export type Typography = typeof typography;

