// const withCleartextTraffic = require('./withCleartextTraffic');

// module.exports = {
//   expo: {
//     // development
//     // name: 'DigiScanner-dev',
//     // slug: 'DigiScanner-dev',
//     // production
//     name: 'DigiScanner-D8',
//     slug: 'digiscanner-dev',
//     version: '1.0.8',
//     orientation: 'portrait',
//     icon: './assets/icon.png',
//     userInterfaceStyle: 'automatic',
//     splash: {
//       image: './assets/logo.png',
//       resizeMode: 'contain',
//       backgroundColor: '#ffffff',
//     },
//     updates: {
//       fallbackToCacheTimeout: 0,
//       enabled: true,
//       url: 'https://u.expo.dev/ee3436e3-d72a-4e32-84b7-b75b3e1a2997', // Derived from projectId
//     },
//     assetBundlePatterns: ['**/*'],
//     scheme: 'digiscanner',
//     ios: {
//       supportsTablet: true,
//       bundleIdentifier: 'com.example.digiscanner_d8', // Consistent with Android package
//       infoPlist: {
//         NSCameraUsageDescription:
//           'DigiScanner needs access to your camera to scan barcodes and documents.',
//       },
//     },
//     android: {
//       adaptiveIcon: {
//         foregroundImage: './assets/adaptive-icon.png',
//         backgroundColor: '#ffffff',
//       },
//       // package: 'com.example.DigiScannerdev',
//       package: 'com.example.digiscanner_d8',
//       versionCode: 8,
//       permissions: ['CAMERA', 'INTERNET', 'android.permission.CAMERA'],
//     },
//     web: {
//       favicon: './assets/favicon.png',
//       env: {
//         BROWSER: 'true',
//       },
//     },
//     plugins: [
//       [
//         'react-native-vision-camera',
//         {
//           cameraPermissionText:
//             'DigiScanner needs access to your camera to scan barcodes and documents.',
//         },
//       ],
//       'expo-notifications',
//       'expo-barcode-scanner',
//     ],
//     // owner: 'sameer2210',
//     owner: 'opticoprod',
//     //pass = InfoDev$2025
//     extra: {
//       eas: {
//         //development id
//         // projectId: 'e69934f5-43ad-4aae-98c7-066ac5bc5c4f',
//         //main production id
//         projectId: 'ee3436e3-d72a-4e32-84b7-b75b3e1a2997',
//       },
//     },
//     newArchEnabled: true,
//   },
// };

// --------------------------------------------------------------------------new update apk create kro tab ye on krna

const withCleartextTraffic = require('./withCleartextTraffic');

module.exports = {
  expo: {
    // Development build
    // name: 'DigiScanner-dev',
    // slug: 'DigiScanner-dev',

    // production
    name: 'DigiScanner',
    slug: 'DigiScanner',

    version: '1.0.3',
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
      enabled: true,
      url: 'https://u.expo.dev/6d4e01d5-3d69-479d-b858-10b64cec0306',
    },

    assetBundlePatterns: ['**/*'],

    scheme: 'digiscanner',

    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.optico.digiscanner',
      infoPlist: {
        NSCameraUsageDescription: 'DigiScanner needs access to your camera for barcode scanning.',
      },
    },

    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      // package: 'com.example.DigiScannerdev',
      package: 'com.optico.digiscanner',
      versionCode: 5,
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
            enableProguardInReleaseBuilds: true,
          },
        },
      ],
      'expo-barcode-scanner',
      'expo-notifications',
    ],

    web: {
      favicon: './assets/favicon.png',
      bundler: 'metro',
      output: 'static',
    },

    extra: {
      eas: {
        //         //development id
        // projectId: 'e69934f5-43ad-4aae-98c7-066ac5bc5c4f',
        //         //main production id
        // projectId: 'f2fac71f-4a9a-4f27-9860-37905e39a003',
        // expo_opticosolutions
        projectId: '6d4e01d5-3d69-479d-b858-10b64cec0306',
      },
    },

    newArchEnabled: true,
  },
};
