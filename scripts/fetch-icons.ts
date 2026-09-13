// Legacy entry — now delegates to modular sources/*
// Kept for `npm run fetch-icons` backwards compatibility.
export { fetchAllIcons, saveIconsToFile } from './sources/index';
export type { IconData } from './sources/types';

if (require.main === module) {
  const { fetchAllIcons, saveIconsToFile } = require('./sources/index');
  const path = require('path');
  fetchAllIcons().then((icons: any[]) => saveIconsToFile(icons, path.join(__dirname, '../src/data/external-icons.json')));
}
