export const endpoints = [
  {
    method: 'GET',
    path: '/api/icons',
    desc: 'List icons with pagination and optional filters.',
    params: [] as { name: string; type: string; req?: boolean; desc: string }[],
    query: [
      { name: 'page', type: 'number', def: '1', desc: 'Page number' },
      { name: 'limit', type: 'number', def: '50', desc: 'Items per page — max 100' },
      { name: 'category', type: 'string', def: '—', desc: 'Category slug — e.g. navigation, action' },
      { name: 'set', type: 'string', def: '—', desc: 'Family — e.g. tabler, lucide, phosphor (alias: source)' },
    ],
    example: '/api/icons?set=tabler&category=navigation&page=1&limit=20',
  },
  {
    method: 'GET',
    path: '/api/icons/:name',
    desc: 'Get a single icon by name with on-the-fly customization.',
    params: [{ name: 'name', type: 'path', req: true, desc: 'Icon name — e.g. home, search, heart' }],
    query: [
      { name: 'color', type: 'string', def: 'currentColor', desc: 'Hex without # — e.g. 7c9a82' },
      { name: 'size', type: 'number', def: '24', desc: 'Pixels — 1 to 512' },
      { name: 'stroke', type: 'number', def: '2', desc: 'Stroke width — 0.5 to 4' },
      { name: 'format', type: 'string', def: 'svg', desc: 'svg · png · webp' },
    ],
    example: '/api/icons/home?color=7c9a82&size=32&format=svg',
  },
  {
    method: 'GET',
    path: '/api/icons/search',
    desc: 'Search by name, tags, or category.',
    params: [{ name: 'q', type: 'query', req: true, desc: 'Query string' }],
    query: [] as { name: string; type: string; def: string; desc: string }[],
    example: '/api/icons/search?q=arrow',
  },
  {
    method: 'GET',
    path: '/api/icons/categories',
    desc: 'All categories with counts — filterable by family.',
    params: [] as { name: string; type: string; req?: boolean; desc: string }[],
    query: [{ name: 'set', type: 'string', def: '—', desc: 'Filter categories to a family — e.g. ?set=tabler' }],
    example: '/api/icons/categories?set=tabler',
  },
  {
    method: 'GET',
    path: '/api/icons/sets',
    desc: 'All icon sets (sources) with counts — filterable by category.',
    params: [] as { name: string; type: string; req?: boolean; desc: string }[],
    query: [{ name: 'category', type: 'string', def: '—', desc: 'Filter families to a category — e.g. ?category=navigation' }],
    example: '/api/icons/sets?category=navigation',
  },
];

export const customizationParams = [
  { p: 'color', t: 'string', d: 'currentColor', desc: 'Hex without # — applied to stroke and fill.' },
  { p: 'size', t: 'number', d: '24', desc: 'Width & height — 1 to 512.' },
  { p: 'stroke', t: 'number', d: '2', desc: 'Stroke width — 0.5 to 4.' },
  { p: 'fill', t: 'boolean', d: 'false', desc: 'Fill shape instead of stroke only.' },
  { p: 'format', t: 'string', d: 'svg', desc: 'svg, png, or webp.' },
];

export const codeExamples = [
  { title: 'HTML', code: '<img src="https://hylab.vercel.app/api/icons/home?color=7c9a82&size=32" alt="Home" />' },
  {
    title: 'React',
    code: `const Icon = ({ name, color = "7c9a82", size = 24 }) => {
  const [svg, setSvg] = useState("");
  useEffect(() => {
    fetch(\`/api/icons/\${name}?color=\${color}&size=\${size}\`)
      .then(r => r.text()).then(setSvg);
  }, [name, color, size]);
  return <span dangerouslySetInnerHTML={{ __html: svg }} />;
};`,
  },
  {
    title: 'Next.js',
    code: `// app/icon/[name]/route.ts
import { NextResponse } from "next/server";
export async function GET(req: Request, { params }: { params: { name: string } }) {
  const { searchParams } = new URL(req.url);
  const color = searchParams.get("color") || "7c9a82";
  const res = await fetch(\`https://hylab.vercel.app/api/icons/\${params.name}?color=\${color}\`);
  return new NextResponse(await res.blob(), {
    headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=86400" }
  });
}`,
  },
  { title: 'cURL', code: `curl "https://hylab.vercel.app/api/icons/home?color=7c9a82"\ncurl "https://hylab.vercel.app/api/icons/home?format=png&size=64"\ncurl "https://hylab.vercel.app/api/icons/search?q=arrow"` },
  {
    title: 'Python',
    code: `import requests
res = requests.get("https://hylab.vercel.app/api/icons/home",
  params={"color": "7c9a82", "size": "32"})
svg = res.text`,
  },
];

export const iconSets = [
  { name: 'Tabler', count: '5,093', desc: 'MIT · consistent stroke' },
  { name: 'Remix', count: '3,229', desc: 'Line & fill variants' },
  { name: 'Carbon', count: '2,665', desc: 'IBM Design Language' },
  { name: 'Lucide', count: '1,582', desc: 'Feather successor' },
  { name: 'Phosphor', count: '1,512', desc: '6 weights' },
  { name: 'Iconoir', count: '1,383', desc: 'No frameworks' },
  { name: 'BoxIcons', count: '814', desc: 'Simple line' },
  { name: 'CSS.gg', count: '704', desc: 'Pure CSS' },
  { name: 'Octicons', count: '733', desc: 'GitHub Primer' },
  { name: 'Heroicons', count: '324', desc: 'Tailwind Labs' },
];

export const docNav = [
  { id: 'quick-start', label: 'Quick start' },
  { id: 'endpoints', label: 'Endpoints' },
  { id: 'customization', label: 'Customization' },
  { id: 'examples', label: 'Code examples' },
  { id: 'sets', label: 'Icon sets' },
  { id: 'ai', label: 'AI prompt' },
];
