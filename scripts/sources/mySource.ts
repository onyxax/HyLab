import { IconData, IconSource } from './types';
import { categorizeIcon, generateTags } from './utils';

/**
 * Example / template source — demonstrates how to add a new icon set.
 * انسخ هذا الملف إلى newSource.ts وعدّل fetch() لمصدرك الجديد.
 *
 * الخطوات لإضافة مصدر حقيقي:
 * 1. أنشئ ملف scripts/sources/myIcons.ts يطبق IconSource
 * 2. أضفه إلى allSources في scripts/sources/index.ts
 * 3. شغل npm run fetch-icons
 */
export const mySource: IconSource = {
  id: 'mySource',
  async fetch(): Promise<IconData[]> {
    // مثال ثابت — لا يحتاج شبكة، مفيد للاختبار والتوثيق
    // استبدل هذا بمنطق جلب حقيقي (fetch + parse SVG)
    const examples: Array<{ name: string; svg: string }> = [
      {
        name: 'sparkles',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22v-6"/><path d="M12 2a4 4 0 0 1 4 4c0 2-1 3-4 6-3-3-4-4-4-6a4 4 0 0 1 4-4z"/></svg>',
      },
      {
        name: 'wand',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 4V2"/><path d="M15 22v-2"/><path d="M4.93 10H2"/><path d="M22 10h-2.07"/><path d="M6.34 6.34 4.93 4.93"/><path d="M19.07 19.07 17.66 17.66"/><path d="M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8z"/><path d="M15 8h.01"/></svg>',
      },
    ];

    return examples.map(({ name, svg }) => ({
      name: `my-${name}`,
      category: categorizeIcon(name),
      tags: generateTags(name),
      svg,
      source: 'mySource',
    }));
  },
};

// مثال لمصدر شبكي حقيقي (معلق للتوضيح):
// export const remoteSource: IconSource = {
//   id: 'remote',
//   async fetch(): Promise<IconData[]> {
//     const res = await fetch('https://example.com/icons.json');
//     const json = await res.json();
//     return json.icons.map((i: any) => ({
//       name: i.name,
//       category: categorizeIcon(i.name),
//       tags: i.tags ?? generateTags(i.name),
//       svg: i.svg,
//       source: 'remote',
//     }));
//   },
// };
