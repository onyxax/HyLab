export interface IconData {
  name: string;
  category: string;
  tags: string[];
  svg: string;
  source: string;
  /** Related variant icon names (e.g. SF Symbols fill/circle/square/slash of the same family). */
  variants?: string[];
}

export interface IconSource {
  id: string;
  fetch(): Promise<IconData[]>;
}
