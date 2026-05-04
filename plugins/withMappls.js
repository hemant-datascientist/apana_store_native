const { withDangerousMod, withPlugins } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

console.log('[Mappls] Plugin loaded');

/**
 * Expo Config Plugin to copy Mappls authentication files to the Android assets directory.
 */
const withMapplsAndroid = (config, { confPath, olfPath }) => {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      // The Mappls Gradle plugin expects the .conf and .olf files in the app module root (android/app)
      // or specific flavor/buildType directories under src.
      const appDir = path.join(projectRoot, 'android/app');
      
      // Ensure the app directory exists (it should, but safety first)
      if (!fs.existsSync(appDir)) {
        fs.mkdirSync(appDir, { recursive: true });
      }

      // Copy .conf file
      if (confPath) {
        const src = path.resolve(projectRoot, confPath);
        const dest = path.join(appDir, path.basename(confPath));
        fs.copyFileSync(src, dest);
        console.log(`[Mappls] Copied ${path.basename(confPath)} to android/app`);
      }

      // Copy .olf file
      if (olfPath) {
        const src = path.resolve(projectRoot, olfPath);
        const dest = path.join(appDir, path.basename(olfPath));
        fs.copyFileSync(src, dest);
        console.log(`[Mappls] Copied ${path.basename(olfPath)} to android/app`);
      }

      return config;
    },
  ]);
};

const withMapplsIos = (config, { confPath, olfPath }) => {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const projectName = config.modRequest.projectName;
      const iosDir = path.join(projectRoot, 'ios', projectName);

      if (confPath) {
        const src = path.resolve(projectRoot, confPath);
        const dest = path.join(iosDir, path.basename(confPath));
        fs.copyFileSync(src, dest);
        console.log(`[Mappls] Copied ${path.basename(confPath)} to ios/${projectName}`);
      }
      if (olfPath) {
        const src = path.resolve(projectRoot, olfPath);
        const dest = path.join(iosDir, path.basename(olfPath));
        fs.copyFileSync(src, dest);
        console.log(`[Mappls] Copied ${path.basename(olfPath)} to ios/${projectName}`);
      }

      return config;
    },
  ]);
};

module.exports = (config, props) => {
  return withPlugins(config, [
    [withMapplsAndroid, props],
    [withMapplsIos, props],
  ]);
};
