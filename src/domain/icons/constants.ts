// Single source of truth for all icon-related constraints.
// Any change to limits must happen here only — all validators & transforms import from here.

import type { OutputFormat } from '@/types';

export const ICON_SIZE = {
  MIN: 1,
  MAX: 512,
  DEFAULT: 24,
} as const;

export const ICON_STROKE = {
  MIN: 0.5,
  MAX: 4,
  DEFAULT: 2,
} as const;

export const ICON_COLOR_RE = /^[0-9a-fA-F]{6}$/;
export const VALID_FORMATS: OutputFormat[] = ['svg', 'png', 'webp'];
export const DEFAULT_FORMAT: OutputFormat = 'svg';

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 50,
  MAX_LIMIT: 100,
} as const;

export const CACHE = {
  ICON_IMMUTABLE: 31536000, // 1 year for svg/png/webp binary
  LIST: 3600,               // 1 hour for lists/categories/search
  STATUS_NO_STORE: 0,
} as const;

export const API = {
  CORS_ORIGIN: '*',
  SEARCH_QUERY_MAX: 100,
} as const;
