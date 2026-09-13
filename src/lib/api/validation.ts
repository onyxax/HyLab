import { OutputFormat } from '@/types';

export interface ParsedIconQuery {
  color?: string;
  size?: number;
  strokeWidth?: number;
  fill: boolean;
  format: OutputFormat;
}

const HEX_COLOR_RE = /^[0-9a-fA-F]{6}$/;
const VALID_FORMATS: OutputFormat[] = ['svg', 'png', 'webp'];

export function parseColor(raw: string | null): string | undefined {
  if (!raw) return undefined;
  const clean = raw.replace(/^#/, '').trim();
  if (!HEX_COLOR_RE.test(clean)) {
    throw new Error(`Invalid color "${raw}". Expected 6 hex digits without # (e.g. 7c9a82).`);
  }
  return clean.toLowerCase();
}

export function parseSize(raw: string | null, fallback?: number): number | undefined {
  if (raw === null || raw === '') return fallback;
  const n = Number(raw);
  if (!Number.isFinite(n) || !Number.isInteger(n) || n < 1 || n > 512) {
    throw new Error(`Invalid size "${raw}". Expected integer 1-512.`);
  }
  return n;
}

export function parseStroke(raw: string | null, fallback?: number): number | undefined {
  if (raw === null || raw === '') return fallback;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0.5 || n > 4) {
    throw new Error(`Invalid stroke "${raw}". Expected number 0.5-4.`);
  }
  return n;
}

export function parseFormat(raw: string | null): OutputFormat {
  if (!raw) return 'svg';
  const f = raw.toLowerCase() as OutputFormat;
  if (!VALID_FORMATS.includes(f)) {
    throw new Error(`Invalid format "${raw}". Expected svg, png or webp.`);
  }
  return f;
}

export function parseFill(raw: string | null): boolean {
  return raw === 'true';
}

export function parsePage(raw: string | null): number {
  if (!raw) return 1;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1) throw new Error(`Invalid page "${raw}".`);
  return n;
}

export function parseLimit(raw: string | null, defaultLimit = 50, max = 100): number {
  if (!raw) return defaultLimit;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1 || n > max) throw new Error(`Invalid limit "${raw}". Expected 1-${max}.`);
  return n;
}

export function parseIconQuery(searchParams: URLSearchParams): ParsedIconQuery {
  return {
    color: parseColor(searchParams.get('color')),
    size: parseSize(searchParams.get('size')),
    strokeWidth: parseStroke(searchParams.get('stroke')),
    fill: parseFill(searchParams.get('fill')),
    format: parseFormat(searchParams.get('format')),
  };
}
