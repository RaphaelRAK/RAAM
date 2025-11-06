import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Budget App',
  slug: 'budget-app',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#0B0C10',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.budgetapp.app',
    infoPlist: {
      NSCameraUsageDescription: 'Cette app a besoin de la caméra pour prendre des photos de reçus.',
      NSPhotoLibraryUsageDescription: 'Cette app a besoin de la galerie pour sélectionner des photos.',
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#0B0C10',
    },
    package: 'com.budgetapp.app',
    permissions: [
      'CAMERA',
      'READ_EXTERNAL_STORAGE',
      'WRITE_EXTERNAL_STORAGE',
    ],
  },
  web: {
    favicon: './assets/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-secure-store',
    'expo-notifications',
    [
      'expo-image-picker',
      {
        photosPermission: 'Cette app a besoin de la galerie pour sélectionner des photos.',
        cameraPermission: 'Cette app a besoin de la caméra pour prendre des photos de reçus.',
      },
    ],
    'expo-barcode-scanner',
  ],
  extra: {
    eas: {
      projectId: process.env.EAS_PROJECT_ID,
    },
  },
  scheme: 'budget-app',
});

