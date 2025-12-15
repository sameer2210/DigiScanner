const withCleartextTraffic = require('./withCleartextTraffic');

module.exports = {
  expo: {
    // Development build
    // name: 'D-DigiScanner',
    // slug: 'D-DigiScanner',

    // production
    name: 'D-DigiScanner',
    slug: 'D-DigiScanner',

    version: '1.0.1',
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
      // enabled: true,
      // url: 'https://u.expo.dev/6d4e01d5-3d69-479d-b858-10b64cec0306',
    },

    assetBundlePatterns: ['**/*'],

    scheme: 'digiscanner',

    ios: {
      supportsTablet: true,
      // bundleIdentifier: 'com.optico.digiscanner',
      bundleIdentifier: 'com.d.digiscanner',
      infoPlist: {
        NSCameraUsageDescription: 'DigiScanner needs access to your camera for barcode scanning.',
      },
    },

    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      // package: 'com.optico.digiscanner',
      package: 'com.d.DigiScanner',
      versionCode: 1,
      permissions: [
        'android.permission.CAMERA',
        'android.permission.INTERNET',
        'android.permission.POST_NOTIFICATIONS',
      ],
    },
    plugins: [
      [
        'expo-build-properties',
        {
          android: {
            compileSdkVersion: 35,
            targetSdkVersion: 35,
            buildToolsVersion: '35.0.0',
            // enableProguardInReleaseBuilds: true,
          },
        },
      ],
      'expo-barcode-scanner',
      'expo-notifications',
    ],

    web: {
      favicon: './assets/favicon.png',
      bundler: 'metro',
      // output: 'static',
    },

    extra: {
      eas: {
        //         //development id
        projectId: '048fdf1c-9e3c-40a3-b6f2-64f40b55a817',
        //         //main production id
        // projectId: 'f2fac71f-4a9a-4f27-9860-37905e39a003',
        // expo_opticosolutions
        // projectId: '6d4e01d5-3d69-479d-b858-10b64cec0306',
      },
    },

    newArchEnabled: true,
  },
};
