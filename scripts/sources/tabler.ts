import { IconData, IconSource } from './types';
import { categorizeIcon, generateTags, cleanSvg, fetchDirectoryListing } from './utils';

export const tablerSource: IconSource = {
  id: 'tabler',
  async fetch(): Promise<IconData[]> {
    const icons: IconData[] = [];
    try {
      const files = await fetchDirectoryListing('https://unpkg.com/@tabler/icons@latest/icons/');
      for (const file of files.slice(0, 500)) {
        try {
          const res = await fetch(`https://unpkg.com/@tabler/icons@latest/icons/${file}`);
          const svg = await res.text();
          const name = file.replace('.svg', '');
          icons.push({
            name: `tabler-${name}`,
            category: categorizeIcon(name),
            tags: generateTags(name),
            svg: cleanSvg(svg),
            source: 'tabler',
          });
        } catch {
          console.error(`Failed to fetch Tabler icon: ${file}`);
        }
      }
    } catch (e) {
      console.error('Failed to fetch Tabler icons:', e);
    }
    return icons;
  },
};
