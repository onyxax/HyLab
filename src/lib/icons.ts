import { IconCategory, IconSet, OutputFormat } from '@/types';
import iconsData from '../data/icons.json';

const icons = iconsData as Array<{
  name: string;
  category: string;
  tags: string[];
  svg: string;
  source: string;
}>;

export function getAllIcons() {
  return icons;
}

export function getIconByName(name: string) {
  return icons.find(icon => icon.name === name);
}

export function searchIcons(query: string) {
  const q = query.toLowerCase();
  return icons.filter(icon =>
    icon.name.toLowerCase().includes(q) ||
    icon.tags.some(tag => tag.toLowerCase().includes(q)) ||
    icon.category.toLowerCase().includes(q)
  );
}

export function getIconsByCategory(category: string) {
  return icons.filter(icon => icon.category === category);
}

export function getCategories(): IconCategory[] {
  const map = new Map<string, number>();
  icons.forEach(icon => {
    map.set(icon.category, (map.get(icon.category) || 0) + 1);
  });

  const names: Record<string, string> = {
    navigation: 'Navigation',
    action: 'Action',
    communication: 'Communication',
    social: 'Social',
    files: 'Files',
    media: 'Media',
    interface: 'Interface',
    status: 'Status',
    commerce: 'Commerce',
    charts: 'Charts',
    layout: 'Layout',
    development: 'Development',
    weather: 'Weather',
    miscellaneous: 'Miscellaneous',
  };

  return Array.from(map.entries()).map(([id, count]) => ({
    id,
    name: names[id] || id,
    count,
  })).sort((a, b) => b.count - a.count);
}

export function getSets(): IconSet[] {
  const sources = new Map<string, number>();
  icons.forEach(icon => {
    sources.set(icon.source, (sources.get(icon.source) || 0) + 1);
  });

  return Array.from(sources.entries()).map(([id, count]) => ({
    id,
    name: id.charAt(0).toUpperCase() + id.slice(1),
    description: `${id} icon set`,
    count,
  }));
}

export function customizeSvg(
  svg: string,
  options: {
    color?: string;
    size?: number;
    strokeWidth?: number;
    fill?: boolean;
  }
): string {
  let result = svg;

  if (options.color) {
    result = result.replace(/stroke="currentColor"/g, `stroke="#${options.color}"`);
    result = result.replace(/fill="currentColor"/g, `fill="#${options.color}"`);
    if (options.fill) {
      result = result.replace(/fill="none"/g, `fill="#${options.color}"`);
    }
  }

  if (options.size) {
    result = result.replace(/(?<!stroke-)width="[^"]*"/g, `width="${options.size}"`);
    result = result.replace(/(?<!stroke-)height="[^"]*"/g, `height="${options.size}"`);
  }

  if (options.strokeWidth !== undefined) {
    result = result.replace(/stroke-width="[^"]*"/g, `stroke-width="${options.strokeWidth}"`);
  }

  return result;
}

export async function convertSvgToFormat(
  svg: string,
  format: OutputFormat,
  size: number = 24
): Promise<Buffer> {
  if (format === 'svg') {
    return Buffer.from(svg);
  }

  const sharp = (await import('sharp')).default;
  const pipeline = sharp(Buffer.from(svg)).resize(size, size);

  switch (format) {
    case 'png':
      return pipeline.png().toBuffer();
    case 'webp':
      return pipeline.webp().toBuffer();
    default:
      return Buffer.from(svg);
  }
}

export function getMimeType(format: OutputFormat): string {
  switch (format) {
    case 'svg': return 'image/svg+xml';
    case 'png': return 'image/png';
    case 'webp': return 'image/webp';
    default: return 'image/svg+xml';
  }
}

export function getFileExtension(format: OutputFormat): string {
  return format || 'svg';
}

export function getTotalIcons(): number {
  return icons.length;
}
