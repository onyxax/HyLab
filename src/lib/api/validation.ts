import { OutputFormat } from '@/types';
import { ICON_COLOR_RE, VALID_FORMATS, ICON_SIZE, ICON_STROKE, PAGINATION } from '@/domain/icons/constants';

export interface ParsedIconQuery {
  color?: string;
  size?: number;
  strokeWidth?: number;
  fill: boolean;
  format: OutputFormat;
}

const HEX_COLOR_RE = ICON_COLOR_RE;

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
  if (!Number.isFinite(n) || !Number.isInteger(n) || n < ICON_SIZE.MIN || n > ICON_SIZE.MAX) {
    throw new Error(`Invalid size "${raw}". Expected integer ${ICON_SIZE.MIN}-${ICON_SIZE.MAX}.`);
  }
  return n;
}

export function parseStroke(raw: string | null, fallback?: number): number | undefined {
  if (raw === null || raw === '') return fallback;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < ICON_STROKE.MIN || n > ICON_STROKE.MAX) {
    throw new Error(`Invalid stroke "${raw}". Expected number ${ICON_STROKE.MIN}-${ICON_STROKE.MAX}.`);
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
  if (!raw) return PAGINATION.DEFAULT_PAGE;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1) throw new Error(`Invalid page "${raw}".`);
  return n;
}

export function parseLimit(raw: string | null, defaultLimit = PAGINATION.DEFAULT_LIMIT, max = PAGINATION.MAX_LIMIT): number {
  if (!raw) return defaultLimit;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1 || n > max) throw new Error(`Invalid limit "${raw}". Expected 1-${max}.`);
  return n;
}

export function parseSource(raw: string | null): string | undefined {
  if (!raw) return undefined;
  const clean = raw.trim().toLowerCase();
  if (!/^[a-z0-9_-]+$/.test(clean)) throw new Error(`Invalid source "${raw}".`);
  return clean;
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
