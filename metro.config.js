// Expo's default. D:\apana_store is a junction to this same monorepo, so listing
// both spellings in watchFolders makes Metro see every file twice and React
// Native load twice (the Monitor/barcode start-up crash). See AGENTS.md §4.
const { getDefaultConfig } = require("expo/metro-config");

module.exports = getDefaultConfig(__dirname);
