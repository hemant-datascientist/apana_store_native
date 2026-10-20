const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);
const root = path.resolve(__dirname);

// Include physical path and junction path in watchFolders for Windows compatibility (AGENTS.md Rule 4)
config.watchFolders = Array.from(new Set([
  root,
  'D:\\apana_store\\apana_store_native',
  'd:\\My Startup Project\\apana_store\\apana_store_native',
]));

module.exports = config;
