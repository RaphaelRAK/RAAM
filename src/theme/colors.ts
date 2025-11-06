export const colors = {
  // Fond
  background: {
    dark: '#0B0C10',
    light: '#FFFFFF',
  },
  // Primaire
  primary: '#4F46E5',
  // Secondaire
  secondary: '#22C55E',
  // Accent
  accent: '#F59E0B',
  // Grays
  gray: {
    900: '#111827',
    800: '#1F2937',
    700: '#374151',
    600: '#6B7280',
    500: '#9CA3AF',
    400: '#E5E7EB',
  },
  // États
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  // Texte
  text: {
    primary: {
      dark: '#FFFFFF',
      light: '#111827',
    },
    secondary: {
      dark: '#9CA3AF',
      light: '#6B7280',
    },
  },
} as const;

export type ColorScheme = 'light' | 'dark';

export const getColors = (scheme: ColorScheme) => ({
  background: colors.background[scheme],
  primary: colors.primary,
  secondary: colors.secondary,
  accent: colors.accent,
  gray: colors.gray,
  success: colors.success,
  warning: colors.warning,
  error: colors.error,
  info: colors.info,
  text: {
    primary: colors.text.primary[scheme],
    secondary: colors.text.secondary[scheme],
  },
});

