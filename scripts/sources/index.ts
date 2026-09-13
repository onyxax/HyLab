import { IconData } from './types';
import { deduplicateIcons } from './utils';
import { lucideSource } from './lucide';
import { heroiconsSource } from './heroicons';
import { tablerSource } from './tabler';
import * as fs from 'fs';
import * as path from 'path';

export const allSources = [lucideSource, heroiconsSource, tablerSource];

export async function fetchAllIcons(): Promise<IconData[]> {
  console.log('Fetching icons from', allSources.map(s => s.id).join(', '), '...');
  const results = await Promise.all(allSources.map(s => s.fetch().catch(() => [] as IconData[])));
  results.forEach((icons, i) => console.log(`Fetched ${icons.length} ${allSources[i].id} icons`));
  const all = results.flat();
  const unique = deduplicateIcons(all);
  console.log(`Total unique icons: ${unique.length}`);
  return unique;
}

export async function saveIconsToFile(icons: IconData[], filePath: string): Promise<void> {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(icons, null, 2));
  console.log(`Saved ${icons.length} icons to ${filePath}`);
}

if (require.main === module) {
  fetchAllIcons().then(icons => saveIconsToFile(icons, path.join(__dirname, '../../src/data/external-icons.json')));
}
