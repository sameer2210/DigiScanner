// withCleartextTraffic.js

const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withCleartextTraffic(config) {
  return withAndroidManifest(config, async config => {
    const application = config.modResults.manifest.application[0];

    // Add android:usesCleartextTraffic="true"
    application.$['android:usesCleartextTraffic'] = 'true';

    return config;
  });
};

// const { withAndroidManifest } = require('@expo/config-plugins');

// module.exports = function withCleartextTraffic(config) {
//   return withAndroidManifest(config, mod => {
//     const androidManifest = mod.modResults;

//     const application = androidManifest.manifest.application?.[0];
//     if (application && application.$) {
//       application.$['android:usesCleartextTraffic'] = 'true';
//     }

//     return mod;
//   });
// };
