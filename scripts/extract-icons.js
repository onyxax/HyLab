const fs = require('fs');
const path = require('path');

const iconCategories = {
  navigation: ['arrow', 'chevron', 'caret', 'menu', 'home', 'search', 'external', 'link', 'navigate', 'compass', 'map', 'direction'],
  action: ['plus', 'minus', 'x', 'check', 'edit', 'trash', 'copy', 'download', 'upload', 'refresh', 'settings', 'filter', 'share', 'heart', 'star', 'bookmark', 'send', 'save', 'close', 'remove', 'add', 'delete', 'create', 'update'],
  communication: ['mail', 'phone', 'message', 'send', 'bell', 'inbox', 'chat', 'comment', 'reply', 'forward', 'call', 'voicemail'],
  social: ['globe', 'users', 'user', 'github', 'twitter', 'linkedin', 'instagram', 'youtube', 'facebook', 'share', 'heart', 'follow'],
  files: ['file', 'folder', 'image', 'video', 'music', 'archive', 'paperclip', 'document', 'attachment', 'upload', 'download'],
  media: ['play', 'pause', 'skip', 'volume', 'camera', 'mic', 'video', 'music', 'stop', 'rewind', 'fast-forward', 'record'],
  interface: ['eye', 'lock', 'unlock', 'shield', 'key', 'log', 'toggle', 'switch', 'button', 'input', 'form', 'select'],
  status: ['alert', 'info', 'check', 'loader', 'warning', 'error', 'success', 'pending', 'loading', 'complete'],
  commerce: ['cart', 'credit', 'dollar', 'package', 'tag', 'gift', 'shopping', 'payment', 'price', 'buy', 'sell', 'order'],
  charts: ['chart', 'bar', 'pie', 'trending', 'activity', 'graph', 'statistics', 'analytics', 'data', 'metrics'],
  layout: ['grid', 'list', 'sidebar', 'maximize', 'minimize', 'columns', 'layout', 'panel', 'container', 'section'],
  development: ['code', 'terminal', 'git', 'database', 'server', 'cloud', 'package', 'zap', 'bug', 'test', 'deploy'],
  weather: ['sun', 'moon', 'cloud', 'rain', 'wind', 'thermometer', 'weather', 'snow', 'storm', 'forecast'],
  miscellaneous: ['clock', 'calendar', 'map', 'compass', 'wifi', 'battery', 'layers', 'hash', 'tag', 'label', 'category']
};

function categorizeIcon(name) {
  const lower = name.toLowerCase().replace(/[-_]/g, '');
  for (const [category, keywords] of Object.entries(iconCategories)) {
    if (keywords.some(kw => lower.includes(kw))) {
      return category;
    }
  }
  return 'miscellaneous';
}

function generateTags(name) {
  const tags = [];
  const parts = name.split(/[-_]/);
  for (const part of parts) {
    if (part.length > 2) tags.push(part.toLowerCase());
  }
  return [...new Set(tags)].slice(0, 5);
}

function extractLucideIcons() {
  const iconsDir = path.join(__dirname, '../node_modules/lucide-static/icons');
  const icons = [];
  
  if (!fs.existsSync(iconsDir)) {
    console.log('Lucide icons dir not found, trying alternative path...');
    return icons;
  }
  
  const files = fs.readdirSync(iconsDir).filter(f => f.endsWith('.svg'));
  
  for (const file of files) {
    try {
      const svg = fs.readFileSync(path.join(iconsDir, file), 'utf-8');
      const name = file.replace('.svg', '');
      icons.push({
        name,
        category: categorizeIcon(name),
        tags: generateTags(name),
        svg: svg.trim(),
        source: 'lucide'
      });
    } catch (e) {}
  }
  
  return icons;
}

function extractTablerIcons() {
  const iconsDir = path.join(__dirname, '../node_modules/@tabler/icons/icons');
  const icons = [];
  
  if (!fs.existsSync(iconsDir)) {
    console.log('Tabler icons dir not found');
    return icons;
  }
  
  const categories = fs.readdirSync(iconsDir).filter(d => {
    const fullPath = path.join(iconsDir, d);
    return fs.statSync(fullPath).isDirectory();
  });
  
  for (const category of categories) {
    const catDir = path.join(iconsDir, category);
    const files = fs.readdirSync(catDir).filter(f => f.endsWith('.svg'));
    
    for (const file of files) {
      try {
        const svg = fs.readFileSync(path.join(catDir, file), 'utf-8');
        const name = file.replace('.svg', '');
        icons.push({
          name: `tabler-${name}`,
          category: categorizeIcon(name),
          tags: generateTags(name),
          svg: svg.trim(),
          source: 'tabler'
        });
      } catch (e) {}
    }
  }
  
  return icons;
}

function mergeIcons(lucideIcons, tablerIcons) {
  const seen = new Set();
  const merged = [];
  
  for (const icon of [...lucideIcons, ...tablerIcons]) {
    if (!seen.has(icon.name)) {
      seen.add(icon.name);
      merged.push(icon);
    }
  }
  
  return merged;
}

// Run
console.log('Extracting Lucide icons...');
const lucideIcons = extractLucideIcons();
console.log(`Found ${lucideIcons.length} Lucide icons`);

console.log('Extracting Tabler icons...');
const tablerIcons = extractTablerIcons();
console.log(`Found ${tablerIcons.length} Tabler icons`);

const allIcons = mergeIcons(lucideIcons, tablerIcons);
console.log(`Total unique icons: ${allIcons.length}`);

// Count by category
const categoryCount = {};
for (const icon of allIcons) {
  categoryCount[icon.category] = (categoryCount[icon.category] || 0) + 1;
}
console.log('Categories:', categoryCount);

// Save
const outputPath = path.join(__dirname, '../src/data/icons.json');
fs.writeFileSync(outputPath, JSON.stringify(allIcons, null, 2));
console.log(`Saved to ${outputPath}`);
