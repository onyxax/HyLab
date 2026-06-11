export interface Icon {
  name: string;
  category: string;
  tags: string[];
  svg: string;
}

export interface IconCategory {
  id: string;
  name: string;
  count: number;
}

export interface IconSet {
  id: string;
  name: string;
  description: string;
  count: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

export type OutputFormat = 'svg' | 'png' | 'webp';
export type IconStyle = 'outline' | 'filled' | 'duotone';
