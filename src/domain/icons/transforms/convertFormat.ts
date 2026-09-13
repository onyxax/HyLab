import { OutputFormat } from '@/types';

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

export async function convertSvgToFormat(
  svg: string,
  format: OutputFormat,
  size: number = 24
): Promise<Buffer> {
  if (format === 'svg') {
    return Buffer.from(svg);
  }

  // Lazy import sharp — fails gracefully on Edge where sharp unavailable
  let sharp: typeof import('sharp').default;
  try {
    sharp = (await import('sharp')).default;
  } catch (e) {
    throw new Error('Image conversion not available in this runtime (sharp missing).');
  }

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
