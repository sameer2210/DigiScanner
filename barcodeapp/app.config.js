const withCleartextTraffic = require('./withCleartextTraffic');

module.exports = {
  expo: {
    name: 'SamQABarcodeNew',
    slug: 'sambarcodescannerappnew',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/logo.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      infoPlist: {
        NSCameraUsageDescription: 'Allow BarcodeScan to access your camera for barcode scanning.',
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: 'com.sameer.barcodeqa2',
      permissions: ['CAMERA', 'INTERNET'],
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: [
      [
        'react-native-vision-camera',
        {
          cameraPermissionText: 'Allow BarcodeScan to access your camera for barcode scanning.',
        },
      ],
      'expo-notifications',
      'expo-barcode-scanner',
    ],
    owner: 'sameer2210',
    extra: {
      eas: {
        projectId: 'f9302258-2e4c-423a-8de3-a2d7b30957b7',
      },
    },
    newArchEnabled: true,
  },
};
