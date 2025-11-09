/**
 * Design system - Couleurs
 * Style Revolut Dark Mode
 */
export const colors = {
  // Fond - Style Revolut
  background: {
    dark: '#0D0F12', // Fond principal
    light: '#0D0F12', // Fond principal
  },
  // Surfaces (cards)
  surface: {
    primary: '#16191F', // Fond de cartes
    secondary: '#1E2128', // Cartes secondaires
  },
  // Bordures discrètes
  border: {
    primary: 'rgba(255, 255, 255, 0.06)',
    secondary: 'rgba(255, 255, 255, 0.07)',
  },
  // Accent colors
  accent: {
    positive: '#4ADE80', // Vert (positif)
    income: '#3B82F6', // Bleu (revenus)
    expense: '#F87171', // Rouge (dépenses)
  },
  // Primaire - Bleu
  primary: '#3B82F6',
  // Secondaire - Vert
  secondary: '#4ADE80',
  // Accent - Rouge
  accentColor: '#F87171',
  // Grays - Nuances de gris
  gray: {
    900: '#0D0F12',
    800: '#16191F',
    700: '#1E2128',
    600: '#2A2D35',
    500: '#3A3D45',
    400: '#6B7280',
    300: '#9CA3AF',
    200: '#D1D5DB',
    100: '#F3F4F6',
  },
  // États
  success: '#4ADE80',
  warning: '#FBBF24',
  error: '#F87171',
  info: '#3B82F6',
  // Gradients pour effets modernes
  gradients: {
    balance: ['#1E2128', '#15181D'], // Gradient balance card
    primary: ['#3B82F6', '#2563EB'],
    secondary: ['#4ADE80', '#22C55E'],
    expense: ['#F87171', '#EF4444'],
  },
  // Texte - Blanc doux + nuances de gris
  text: {
    primary: {
      dark: '#FFFFFF',
      light: '#FFFFFF', // Texte principal blanc
    },
    secondary: {
      dark: 'rgba(255, 255, 255, 0.7)',
      light: 'rgba(255, 255, 255, 0.7)', // Texte secondaire
    },
    tertiary: {
      dark: 'rgba(255, 255, 255, 0.5)',
      light: 'rgba(255, 255, 255, 0.5)', // Texte tertiaire
    },
  },
  // Ombres
  shadow: {
    card: 'rgba(0, 0, 0, 0.4)',
    button: 'rgba(0, 0, 0, 0.3)',
  },
} as const;

export type ColorScheme = 'dark' | 'light';

export const getColors = (scheme: ColorScheme) => ({
  ...colors,
  background: colors.background[scheme],
  text: {
    primary: colors.text.primary[scheme],
    secondary: colors.text.secondary[scheme],
    tertiary: colors.text.tertiary[scheme],
  },
});
