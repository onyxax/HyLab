import * as fs from 'fs';
import * as path from 'path';

interface IconData {
  name: string;
  category: string;
  tags: string[];
  svg: string;
  source: string;
}

// Lucide Icons (1000+ icons)
async function fetchLucideIcons(): Promise<IconData[]> {
  const icons: IconData[] = [];
  
  try {
    const response = await fetch('https://unpkg.com/lucide-static@latest/icons/');
    const html = await response.text();
    
    // Extract icon names from the directory listing
    const nameRegex = /href="([^"]+\.svg)"/g;
    let match;
    const svgFiles: string[] = [];
    
    while ((match = nameRegex.exec(html)) !== null) {
      svgFiles.push(match[1]);
    }

    // Fetch each icon
    for (const svgFile of svgFiles.slice(0, 500)) { // Limit to 500 icons
      try {
        const iconResponse = await fetch(`https://unpkg.com/lucide-static@latest/icons/${svgFile}`);
        const svg = await iconResponse.text();
        const name = svgFile.replace('.svg', '');
        
        icons.push({
          name,
          category: categorizeIcon(name),
          tags: generateTags(name),
          svg: cleanSvg(svg),
          source: 'lucide',
        });
      } catch (error) {
        console.error(`Failed to fetch icon: ${svgFile}`);
      }
    }
  } catch (error) {
    console.error('Failed to fetch Lucide icons:', error);
  }
  
  return icons;
}

// Heroicons (300+ icons)
async function fetchHeroicons(): Promise<IconData[]> {
  const icons: IconData[] = [];
  
  try {
    // Heroicons are available via unpkg
    const categories = ['outline', 'solid', 'mini'];
    
    for (const category of categories) {
      const response = await fetch(`https://unpkg.com/heroicons@latest/${category}/`);
      const html = await response.text();
      
      const nameRegex = /href="([^"]+\.svg)"/g;
      let match;
      
      while ((match = nameRegex.exec(html)) !== null) {
        try {
          const iconResponse = await fetch(`https://unpkg.com/heroicons@latest/${category}/${match[1]}`);
          const svg = await iconResponse.text();
          const name = match[1].replace('.svg', '');
          
          icons.push({
            name: `hero-${name}`,
            category: categorizeIcon(name),
            tags: generateTags(name),
            svg: cleanSvg(svg),
            source: 'heroicons',
          });
        } catch (error) {
          console.error(`Failed to fetch Heroicon: ${match[1]}`);
        }
      }
    }
  } catch (error) {
    console.error('Failed to fetch Heroicons:', error);
  }
  
  return icons;
}

// Tabler Icons (4000+ icons)
async function fetchTablerIcons(): Promise<IconData[]> {
  const icons: IconData[] = [];
  
  try {
    const response = await fetch('https://unpkg.com/@tabler/icons@latest/icons/');
    const html = await response.text();
    
    const nameRegex = /href="([^"]+\.svg)"/g;
    let match;
    const svgFiles: string[] = [];
    
    while ((match = nameRegex.exec(html)) !== null) {
      svgFiles.push(match[1]);
    }

    for (const svgFile of svgFiles.slice(0, 500)) {
      try {
        const iconResponse = await fetch(`https://unpkg.com/@tabler/icons@latest/icons/${svgFile}`);
        const svg = await iconResponse.text();
        const name = svgFile.replace('.svg', '');
        
        icons.push({
          name: `tabler-${name}`,
          category: categorizeIcon(name),
          tags: generateTags(name),
          svg: cleanSvg(svg),
          source: 'tabler',
        });
      } catch (error) {
        console.error(`Failed to fetch Tabler icon: ${svgFile}`);
      }
    }
  } catch (error) {
    console.error('Failed to fetch Tabler icons:', error);
  }
  
  return icons;
}

// Helper functions
function categorizeIcon(name: string): string {
  const categories: Record<string, string[]> = {
    navigation: ['arrow', 'chevron', 'caret', '导航', 'menu', 'home', 'search', 'external', 'link'],
    action: ['plus', 'minus', 'x', 'check', 'edit', 'trash', 'copy', 'download', 'upload', 'refresh', 'settings', 'filter', 'share', 'heart', 'star', 'bookmark'],
    communication: ['mail', 'phone', 'message', 'send', 'bell', 'at', 'inbox', 'chat'],
    social: ['globe', 'users', 'user', 'github', 'twitter', 'linkedin', 'instagram', 'youtube', 'facebook'],
    files: ['file', 'folder', 'image', 'video', 'music', 'archive', 'paperclip', 'document'],
    media: ['play', 'pause', 'skip', 'volume', 'camera', 'mic', 'video', 'music'],
    interface: ['eye', 'lock', 'unlock', 'shield', 'key', 'log', 'toggle', 'switch'],
    status: ['alert', 'info', 'check', 'x', 'loader', 'warning', 'error', 'success'],
    commerce: ['cart', 'credit', 'dollar', 'package', 'tag', 'gift', 'shopping', 'payment'],
    charts: ['chart', 'bar', 'pie', 'trending', 'activity', 'graph', 'statistics'],
    layout: ['grid', 'list', 'sidebar', 'maximize', 'minimize', 'columns', 'layout'],
    development: ['code', 'terminal', 'git', 'database', 'server', 'cloud', 'package', 'zap'],
    weather: ['sun', 'moon', 'cloud', 'rain', 'wind', 'thermometer', 'weather'],
    miscellaneous: ['clock', 'calendar', 'map', 'compass', 'wifi', 'battery', 'layers', 'hash'],
  };

  const lowerName = name.toLowerCase();
  
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => lowerName.includes(keyword))) {
      return category;
    }
  }
  
  return 'miscellaneous';
}

function generateTags(name: string): string[] {
  const tags: string[] = [];
  const parts = name.split(/[-_]/);
  
  for (const part of parts) {
    if (part.length > 2) {
      tags.push(part.toLowerCase());
    }
  }
  
  // Add synonyms
  const synonyms: Record<string, string[]> = {
    'arrow': ['direction', 'nav', 'pointer'],
    'home': ['house', 'main', 'dashboard'],
    'user': ['person', 'profile', 'account'],
    'settings': ['gear', 'cog', 'preferences'],
    'search': ['find', 'magnify', 'lookup'],
    'delete': ['remove', 'trash', 'bin'],
    'edit': ['pencil', 'write', 'modify'],
    'save': ['download', 'export', 'store'],
    'close': ['x', 'cancel', 'dismiss'],
    'check': ['done', 'complete', 'success'],
  };

  const lowerName = name.toLowerCase();
  for (const [key, syns] of Object.entries(synonyms)) {
    if (lowerName.includes(key)) {
      tags.push(...syns);
    }
  }

  return [...new Set(tags)].slice(0, 5);
}

function cleanSvg(svg: string): string {
  // Remove unnecessary attributes and clean up SVG
  return svg
    .replace(/class="[^"]*"/g, '')
    .replace(/data-name="[^"]*"/g, '')
    .replace(/xmlns="[^"]*"/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Main function to fetch all icons
export async function fetchAllIcons(): Promise<IconData[]> {
  console.log('Fetching icons from external APIs...');
  
  const [lucideIcons, heroicons, tablerIcons] = await Promise.all([
    fetchLucideIcons().catch(() => []),
    fetchHeroicons().catch(() => []),
    fetchTablerIcons().catch(() => []),
  ]);

  console.log(`Fetched ${lucideIcons.length} Lucide icons`);
  console.log(`Fetched ${heroicons.length} Heroicons`);
  console.log(`Fetched ${tablerIcons.length} Tabler icons`);

  // Combine and deduplicate
  const allIcons = [...lucideIcons, ...heroicons, ...tablerIcons];
  const uniqueIcons = deduplicateIcons(allIcons);

  console.log(`Total unique icons: ${uniqueIcons.length}`);

  return uniqueIcons;
}

function deduplicateIcons(icons: IconData[]): IconData[] {
  const seen = new Set<string>();
  return icons.filter(icon => {
    const key = icon.name;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

// Save icons to JSON file
export async function saveIconsToFile(icons: IconData[], filePath: string): Promise<void> {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(icons, null, 2));
  console.log(`Saved ${icons.length} icons to ${filePath}`);
}

// Run if called directly
if (require.main === module) {
  fetchAllIcons().then(icons => {
    saveIconsToFile(icons, path.join(__dirname, '../data/external-icons.json'));
  });
}
