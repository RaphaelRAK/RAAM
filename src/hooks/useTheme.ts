/**
 * Hook pour le thème (dark/light)
 */

import { useColorScheme } from 'react-native';
import { getColors, ColorScheme } from '@/theme/colors';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';

export const useTheme = () => {
  const systemScheme = useColorScheme();
  const scheme: ColorScheme = systemScheme || 'light';
  const themeColors = getColors(scheme);

  return {
    colors: themeColors,
    typography,
    spacing,
    borderRadius,
    shadows,
    isDark: scheme === 'dark',
  };
};

