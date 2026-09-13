import { IconData, IconSource } from './types';
import { categorizeIcon, generateTags, cleanSvg, fetchDirectoryListing } from './utils';

export const heroiconsSource: IconSource = {
  id: 'heroicons',
  async fetch(): Promise<IconData[]> {
    const icons: IconData[] = [];
    try {
      const categories = ['outline', 'solid', 'mini'];
      for (const category of categories) {
        const files = await fetchDirectoryListing(`https://unpkg.com/heroicons@latest/${category}/`);
        for (const file of files) {
          try {
            const res = await fetch(`https://unpkg.com/heroicons@latest/${category}/${file}`);
            const svg = await res.text();
            const name = file.replace('.svg', '');
            icons.push({
              name: `hero-${name}`,
              category: categorizeIcon(name),
              tags: generateTags(name),
              svg: cleanSvg(svg),
              source: 'heroicons',
            });
          } catch {
            console.error(`Failed to fetch Heroicon: ${file}`);
          }
        }
      }
    } catch (e) {
      console.error('Failed to fetch Heroicons:', e);
    }
    return icons;
  },
};
