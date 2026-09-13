export interface IconData {
  name: string;
  category: string;
  tags: string[];
  svg: string;
  source: string;
}

export interface IconSource {
  id: string;
  fetch(): Promise<IconData[]>;
}
