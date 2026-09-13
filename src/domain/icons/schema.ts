import { IconCategory, IconSet, OutputFormat } from '@/types';

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

// Validation helpers — mirrors lib/api/validation but for domain use
export function assertValidColor(color?: string) {
  if (color && !/^[0-9a-fA-F]{6}$/.test(color)) {
    throw new Error(`Invalid color "${color}"`);
  }
}

export function assertValidSize(size?: number) {
  if (size !== undefined && (!Number.isInteger(size) || size < 1 || size > 512)) {
    throw new Error(`Invalid size "${size}"`);
  }
}

export function assertValidStroke(stroke?: number) {
  if (stroke !== undefined && (stroke < 0.5 || stroke > 4)) {
    throw new Error(`Invalid stroke "${stroke}"`);
  }
}

export const VALID_FORMATS: OutputFormat[] = ['svg', 'png', 'webp'];
