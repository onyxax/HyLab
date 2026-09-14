import { IconCategory, IconSet, OutputFormat } from '@/types';
import { ICON_COLOR_RE, ICON_SIZE, ICON_STROKE, VALID_FORMATS as CONST_VALID_FORMATS } from './constants';

// Re-export for domain use
export type { IconCategory, IconSet, OutputFormat };

export interface Icon {
  name: string;
  category: string;
  tags: string[];
  svg: string;
  source: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IconListResult {
  data: Icon[];
  meta: Pagination;
}

// Validation helpers — single source via constants.ts (no duplication with lib/api/validation)
export function assertValidColor(color?: string) {
  if (color && !ICON_COLOR_RE.test(color)) {
    throw new Error(`Invalid color "${color}"`);
  }
}

export function assertValidSize(size?: number) {
  if (size !== undefined && (!Number.isInteger(size) || size < ICON_SIZE.MIN || size > ICON_SIZE.MAX)) {
    throw new Error(`Invalid size "${size}"`);
  }
}

export function assertValidStroke(stroke?: number) {
  if (stroke !== undefined && (stroke < ICON_STROKE.MIN || stroke > ICON_STROKE.MAX)) {
    throw new Error(`Invalid stroke "${stroke}"`);
  }
}

export const VALID_FORMATS: OutputFormat[] = CONST_VALID_FORMATS;
