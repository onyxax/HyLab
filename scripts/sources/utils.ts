export function categorizeIcon(name: string): string {
  const categories: Record<string, string[]> = {
    navigation: ['arrow', 'chevron', 'caret', 'menu', 'home', 'search', 'external', 'link'],
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

export function generateTags(name: string): string[] {
  const tags: string[] = [];
  const parts = name.split(/[-_]/);
  for (const part of parts) {
    if (part.length > 2) tags.push(part.toLowerCase());
  }
  const synonyms: Record<string, string[]> = {
    arrow: ['direction', 'nav', 'pointer'],
    home: ['house', 'main', 'dashboard'],
    user: ['person', 'profile', 'account'],
    settings: ['gear', 'cog', 'preferences'],
    search: ['find', 'magnify', 'lookup'],
    delete: ['remove', 'trash', 'bin'],
    edit: ['pencil', 'write', 'modify'],
    save: ['download', 'export', 'store'],
    close: ['x', 'cancel', 'dismiss'],
    check: ['done', 'complete', 'success'],
  };
  const lowerName = name.toLowerCase();
  for (const [key, syns] of Object.entries(synonyms)) {
    if (lowerName.includes(key)) tags.push(...syns);
  }
  return [...new Set(tags)].slice(0, 5);
}

export function cleanSvg(svg: string): string {
  return svg
    .replace(/class="[^"]*"/g, '')
    .replace(/data-name="[^"]*"/g, '')
    .replace(/xmlns="[^"]*"/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function fetchDirectoryListing(url: string): Promise<string[]> {
  const res = await fetch(url);
  const html = await res.text();
  const re = /href="([^"]+\.svg)"/g;
  const files: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) files.push(m[1]);
  return files;
}

export function deduplicateIcons<T extends { name: string }>(icons: T[]): T[] {
  const seen = new Set<string>();
  return icons.filter(icon => {
    if (seen.has(icon.name)) return false;
    seen.add(icon.name);
    return true;
  });
}
