import { IconData, IconSource } from './types';
import { categorizeIcon, generateTags, cleanSvg, fetchDirectoryListing } from './utils';

export const lucideSource: IconSource = {
  id: 'lucide',
  async fetch(): Promise<IconData[]> {
    const icons: IconData[] = [];
    try {
      const files = await fetchDirectoryListing('https://unpkg.com/lucide-static@latest/icons/');
      for (const file of files.slice(0, 500)) {
        try {
          const res = await fetch(`https://unpkg.com/lucide-static@latest/icons/${file}`);
          const svg = await res.text();
          const name = file.replace('.svg', '');
          icons.push({
            name,
            category: categorizeIcon(name),
            tags: generateTags(name),
            svg: cleanSvg(svg),
            source: 'lucide',
          });
        } catch {
          console.error(`Failed to fetch Lucide icon: ${file}`);
        }
      }
    } catch (e) {
      console.error('Failed to fetch Lucide icons:', e);
    }
    return icons;
  },
};
