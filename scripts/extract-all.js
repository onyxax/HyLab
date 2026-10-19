const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'src', 'data', 'icons.json');

function cleanSvg(svg) {
  let result = svg
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s*class="[^"]*"/g, '')
    .replace(/\s*id="[^"]*"/g, '')
    .replace(/\s*data-name="[^"]*"/g, '')
    .replace(/\s*xmlns:xlink="[^"]*"/g, '')
    .replace(/\n\s*\n/g, '\n')
    .trim();
  if (!result.includes('xmlns=')) {
    result = result.replace(/<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  return result;
}

const allIcons = [];
const existingNames = new Set();
let added = 0;

function addIcon(icon) {
  const safeName = icon.name.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
  if (existingNames.has(safeName)) return;
  existingNames.add(safeName);
  allIcons.push({ ...icon, name: safeName, svg: cleanSvg(icon.svg) });
  added++;
}

function categorize(name) {
  const n = name.toLowerCase();
  if (/arrow|chevron|caret|navigat|menu|back|forward|next|prev|up|down|left|right/.test(n)) return 'navigation';
  if (/add|remove|delete|edit|copy|paste|cut|save|undo|redo|check|close|cross|plus|minus/.test(n)) return 'action';
  if (/mail|envelope|phone|call|chat|message|comment|send|inbox|bell|notification/.test(n)) return 'communication';
  if (/file|folder|document|paper|archive|download|upload|cloud|storage/.test(n)) return 'files';
  if (/play|pause|stop|skip|volume|music|video|camera|image|photo|film|mic|audio/.test(n)) return 'media';
  if (/home|house|building|office|map|pin|location|globe|world|earth|compass/.test(n)) return 'navigation';
  if (/user|people|person|team|group|account|profile|avatar|heart|like/.test(n)) return 'social';
  if (/cart|shopping|bag|gift|credit|card|wallet|money|dollar|coin|pay/.test(n)) return 'commerce';
  if (/chart|graph|bar|pie|trend|analytics|data|statistic/.test(n)) return 'charts';
  if (/code|terminal|database|server|bug|git|branch|commit|pull|push|develop/.test(n)) return 'development';
  if (/sun|moon|cloud|rain|snow|wind|weather|star|bolt|flash/.test(n)) return 'weather';
  if (/alert|warning|info|error|check|shield|lock|unlock|key|security/.test(n)) return 'status';
  if (/grid|list|layout|sidebar|menu|table|column|row|align/.test(n)) return 'layout';
  if (/eye|view|show|hide|search|find|filter|sort|toggle|switch|setting|gear|cog/.test(n)) return 'interface';
  return 'miscellaneous';
}

// ─── Phosphor Icons ──────────────────────────────────
console.log('Loading Phosphor Icons...');
try {
  const phosphorDir = path.join(__dirname, '..', 'node_modules', '@phosphor-icons', 'core', 'assets', 'regular');
  if (fs.existsSync(phosphorDir)) {
    const files = fs.readdirSync(phosphorDir).filter(f => f.endsWith('.svg'));
    for (const file of files) {
      const svg = fs.readFileSync(path.join(phosphorDir, file), 'utf-8');
      const name = file.replace('.svg', '');
      addIcon({
        name,
        category: categorize(name),
        tags: name.split('-').filter(t => t.length > 1),
        svg: svg.trim(),
        source: 'phosphor'
      });
    }
    console.log(`  Phosphor: ${files.length} icons found`);
  }
} catch (e) { console.error('  Phosphor error:', e.message); }

// ─── Remix Icon ──────────────────────────────────────
console.log('Loading Remix Icon...');
try {
  const remixDir = path.join(__dirname, '..', 'node_modules', 'remixicon', 'icons');
  if (fs.existsSync(remixDir)) {
    const readDir = (dir) => {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        if (fs.statSync(fullPath).isDirectory()) {
          readDir(fullPath);
        } else if (item.endsWith('.svg')) {
          const svg = fs.readFileSync(fullPath, 'utf-8');
          const rawName = item.replace('.svg', '');
          const name = `ri-${rawName}`;
          addIcon({
            name,
            category: categorize(name),
            tags: name.split('-').filter(t => t.length > 1),
            svg: svg.trim(),
            source: 'remix'
          });
        }
      }
    };
    readDir(remixDir);
    console.log(`  Remix: done`);
  }
} catch (e) { console.error('  Remix error:', e.message); }

// ─── Iconoir ─────────────────────────────────────────
console.log('Loading Iconoir...');
try {
  const iconoirDir = path.join(__dirname, '..', 'node_modules', 'iconoir', 'icons', 'regular');
  if (fs.existsSync(iconoirDir)) {
    const files = fs.readdirSync(iconoirDir).filter(f => f.endsWith('.svg'));
    for (const file of files) {
      const svg = fs.readFileSync(path.join(iconoirDir, file), 'utf-8');
      const name = `iconoir-${file.replace('.svg', '')}`;
      addIcon({
        name,
        category: categorize(name),
        tags: name.split('-').filter(t => t.length > 1),
        svg: svg.trim(),
        source: 'iconoir'
      });
    }
    console.log(`  Iconoir: ${files.length} icons found`);
  }
} catch (e) { console.error('  Iconoir error:', e.message); }

// ─── Carbon Icons ────────────────────────────────────
console.log('Loading Carbon Icons...');
try {
  const carbonDir = path.join(__dirname, '..', 'node_modules', '@carbon', 'icons-react', 'es');
  if (fs.existsSync(carbonDir)) {
    let count = 0;
    const extractSvgFromReact = (filePath) => {
      const content = fs.readFileSync(filePath, 'utf-8');
      const viewBoxMatch = content.match(/viewBox\s*:\s*["']([^"']+)["']/);
      if (!viewBoxMatch) return null;
      const viewBox = viewBoxMatch[1];
      const paths = [];
      // Match jsx("path", { d: "..." }) and createElement("path", {..., d: "..."})
      const pathRegex = /(?:jsx|createElement)\("path",\s*\{[^}]*d\s*:\s*["']([^"']+)["']/g;
      let m;
      while ((m = pathRegex.exec(content)) !== null) {
        paths.push(m[1]);
      }
      if (paths.length === 0) return null;
      const pathElements = paths.map(d => `  <path d="${d}" />`).join('\n');
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">\n${pathElements}\n</svg>`;
    };
    const processCarbonDir = (dir) => {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory() && !['esm', 'generated'].includes(item)) {
          processCarbonDir(fullPath);
        } else if (item.endsWith('.js') && !item.includes('.d.ts') && !item.includes('index') && !item.includes('Icon.js') && !item.includes('iconPropTypes')) {
          try {
            const svg = extractSvgFromReact(fullPath);
            if (svg) {
              const relPath = path.relative(carbonDir, fullPath).replace(/\\/g, '/').replace('.js', '');
              const name = `carbon-${relPath.replace(/\//g, '-').replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-+/, '')}`;
              addIcon({
                name,
                category: categorize(name),
                tags: name.split('-').filter(t => t.length > 1),
                svg,
                source: 'carbon'
              });
              count++;
            }
          } catch (e) {}
        }
      }
    };
    processCarbonDir(carbonDir);
    console.log(`  Carbon: ${count} icons found`);
  }
} catch (e) { console.error('  Carbon error:', e.message); }

// ─── BoxIcons ────────────────────────────────────────
console.log('Loading BoxIcons...');
try {
  const boxDir = path.join(__dirname, '..', 'node_modules', 'boxicons', 'svg', 'regular');
  if (fs.existsSync(boxDir)) {
    const files = fs.readdirSync(boxDir).filter(f => f.endsWith('.svg'));
    for (const file of files) {
      const svg = fs.readFileSync(path.join(boxDir, file), 'utf-8');
      const name = `bx-${file.replace('.svg', '')}`;
      addIcon({
        name,
        category: categorize(name),
        tags: name.split('-').filter(t => t.length > 1),
        svg: svg.trim(),
        source: 'boxicons'
      });
    }
    console.log(`  BoxIcons: ${files.length} icons found`);
  }
} catch (e) { console.error('  BoxIcons error:', e.message); }

// ─── CSS.gg ──────────────────────────────────────────
console.log('Loading CSS.gg...');
try {
  const cssggDir = path.join(__dirname, '..', 'node_modules', 'css.gg', 'icons', 'svg');
  if (fs.existsSync(cssggDir)) {
    const files = fs.readdirSync(cssggDir).filter(f => f.endsWith('.svg'));
    for (const file of files) {
      const svg = fs.readFileSync(path.join(cssggDir, file), 'utf-8');
      const name = `gg-${file.replace('.svg', '')}`;
      addIcon({
        name,
        category: categorize(name),
        tags: name.split('-').filter(t => t.length > 1),
        svg: svg.trim(),
        source: 'cssgg'
      });
    }
    console.log(`  CSS.gg: ${files.length} icons found`);
  }
} catch (e) { console.error('  CSS.gg error:', e.message); }

// ─── Heroicons ───────────────────────────────────────
console.log('Loading Heroicons...');
try {
  const heroDir = path.join(__dirname, '..', 'node_modules', '@heroicons', 'react', '24', 'outline');
  if (fs.existsSync(heroDir)) {
    let count = 0;
    const files = fs.readdirSync(heroDir).filter(f => f.endsWith('.js') && !f.includes('.d.ts'));
    for (const file of files) {
      const content = fs.readFileSync(path.join(heroDir, file), 'utf-8');
      const viewBoxMatch = content.match(/viewBox\s*:\s*["']([^"']+)["']/);
      if (!viewBoxMatch) continue;
      const viewBox = viewBoxMatch[1];
      const paths = [];
      const pathRegex = /createElement\("path",\s*\{[^}]*d\s*:\s*["']([^"']+)["']/g;
      let m;
      while ((m = pathRegex.exec(content)) !== null) {
        paths.push(m[1]);
      }
      if (paths.length === 0) continue;
      const pathElements = paths.map(d => `  <path stroke-linecap="round" stroke-linejoin="round" d="${d}" />`).join('\n');
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="${viewBox}" stroke-width="1.5" stroke="currentColor">\n${pathElements}\n</svg>`;
      const name = `hero-${file.replace('Icon.js', '')}`;
      addIcon({
        name,
        category: categorize(name),
        tags: name.split(/(?=[A-Z])/).map(t => t.toLowerCase()).filter(t => t.length > 1),
        svg,
        source: 'heroicons'
      });
      count++;
    }
    console.log(`  Heroicons: ${count} icons found`);
  }
} catch (e) { console.error('  Heroicons error:', e.message); }

// ─── Octicons ────────────────────────────────────────
console.log('Loading Octicons...');
try {
  const octDir = path.join(__dirname, '..', 'node_modules', '@primer', 'octicons', 'build', 'svg');
  if (fs.existsSync(octDir)) {
    const files = fs.readdirSync(octDir).filter(f => f.endsWith('.svg'));
    for (const file of files) {
      const svg = fs.readFileSync(path.join(octDir, file), 'utf-8');
      const name = `oct-${file.replace('.svg', '')}`;
      addIcon({
        name,
        category: categorize(name),
        tags: name.split('-').filter(t => t.length > 1),
        svg: svg.trim(),
        source: 'octicons'
      });
    }
    console.log(`  Octicons: ${files.length} icons found`);
  }
} catch (e) { console.error('  Octicons error:', e.message); }

// ─── Lucide Icons ────────────────────────────────────
console.log('Loading Lucide Icons...');
try {
  const lucideDir = path.join(__dirname, '..', 'node_modules', 'lucide-static', 'icons');
  if (fs.existsSync(lucideDir)) {
    const files = fs.readdirSync(lucideDir).filter(f => f.endsWith('.svg'));
    for (const file of files) {
      const svg = fs.readFileSync(path.join(lucideDir, file), 'utf-8');
      const name = file.replace('.svg', '');
      addIcon({
        name,
        category: categorize(name),
        tags: name.split('-').filter(t => t.length > 1),
        svg: svg.trim(),
        source: 'lucide'
      });
    }
    console.log(`  Lucide: ${files.length} icons found`);
  }
} catch (e) { console.error('  Lucide error:', e.message); }

// ─── Tabler Icons ────────────────────────────────────
console.log('Loading Tabler Icons...');
try {
  const tablerDir = path.join(__dirname, '..', 'node_modules', '@tabler', 'icons', 'icons', 'outline');
  if (fs.existsSync(tablerDir)) {
    const files = fs.readdirSync(tablerDir).filter(f => f.endsWith('.svg'));
    for (const file of files) {
      const svg = fs.readFileSync(path.join(tablerDir, file), 'utf-8');
      const name = `ti-${file.replace('.svg', '')}`;
      addIcon({
        name,
        category: categorize(name),
        tags: name.split('-').filter(t => t.length > 1),
        svg: svg.trim(),
        source: 'tabler'
      });
    }
    console.log(`  Tabler: ${files.length} icons found`);
  }
} catch (e) { console.error('  Tabler error:', e.message); }

// ─── SF Symbols (Apple) ──────────────────────────────
// Source: @bradleyhodges/sfsymbols (dist/module/sf*.js).
// Names are Apple canonical sourceNames (dots -> dashes) prefixed with sf-.
// SVGs are fill-based to match phosphor-style icons and customizeSvg.
console.log('Loading SF Symbols...');
try {
  const sfDir = path.join(__dirname, '..', 'node_modules', '@bradleyhodges', 'sfsymbols', 'dist', 'module');
  const SF_CATEGORY_MAP = {
    arrows: 'navigation',
    automotive: 'navigation',
    transportation: 'navigation',
    maps: 'navigation',
    home: 'navigation',
    communication: 'communication',
    commerce: 'commerce',
    media: 'media',
    camera__photos: 'media',
    gaming: 'media',
    shapes: 'layout',
    objects__tools: 'layout',
    editing: 'action',
    text_formatting: 'action',
    keyboard: 'action',
    draw: 'action',
    privacy__security: 'interface',
    accessibility: 'interface',
    devices: 'interface',
    connectivity: 'interface',
    human: 'social',
    brands: 'social',
    math: 'charts',
    indicies: 'charts',
    variable: 'charts',
    time: 'miscellaneous',
    weather: 'weather',
    nature: 'miscellaneous',
    health: 'status',
    fitness: 'status',
    whats_new: 'miscellaneous',
  };
  const SF_CATEGORY_PRIORITY = [
    'home', 'maps', 'arrows', 'transportation', 'automotive',
    'communication', 'commerce', 'camera__photos', 'gaming', 'media',
    'editing', 'text_formatting', 'keyboard', 'draw',
    'privacy__security', 'accessibility', 'devices', 'connectivity',
    'objects__tools', 'human', 'brands', 'math', 'indicies', 'variable',
    'shapes', 'weather', 'time', 'health', 'fitness', 'nature', 'whats_new',
  ];
  const sfRank = (c) => { const i = SF_CATEGORY_PRIORITY.indexOf(c); return i === -1 ? 999 : i; };
  if (fs.existsSync(sfDir)) {
    const files = fs.readdirSync(sfDir).filter(f => /^sf.*\.js$/.test(f)).sort();
    // Pass 1 — load raw data (no naming decisions yet).
    const raws = [];
    for (const file of files) {
      try {
        const mod = require(path.join(sfDir, file));
        const key = Object.keys(mod).find(k => k.startsWith('sf'));
        const data = key ? mod[key] : null;
        if (!data || !data.iconName || !data.sourceName || !data.svgPathData || !data.svgPathData.length || !data.viewBox) continue;
        raws.push({ iconName: data.iconName, data });
      } catch (e) {}
    }
    // Pass 2 — collision-safe unique names. Nothing is dropped:
    // first keeps sf-<source>, later ones fall back to the package
    // iconName (e.g. sfBrand11ty -> sf-brand-11ty), then -2/-3.
    const taken = new Set();
    const iconNameToName = new Map();
    const assigned = [];
    const toKebab = (s) => String(s).toLowerCase().replace(/\./g, '-').replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
    for (const raw of raws) {
      const base = `sf-${toKebab(raw.data.sourceName)}`;
      let name = base;
      if (taken.has(name)) {
        name = `sf-${toKebab(raw.iconName.replace(/^sf/i, ''))}`;
        let n = 2;
        while (taken.has(name)) name = `${base}-${n++}`;
      }
      taken.add(name);
      iconNameToName.set(raw.iconName, name);
      assigned.push({ raw, name });
    }
    // Pass 3 — build entries (variants resolved in pass 4).
    const sfEntries = [];
    for (const { raw, name } of assigned) {
      const data = raw.data;
      try {
        const kebab = toKebab(data.sourceName);
        const sfCats = Array.isArray(data.categories) ? data.categories : [];
        const ordered = [...sfCats].sort((a, b) => sfRank(a) - sfRank(b));
        let category = 'miscellaneous';
        for (const c of ordered) {
          if (SF_CATEGORY_MAP[c]) { category = SF_CATEGORY_MAP[c]; break; }
        }
        if (category === 'miscellaneous') category = categorize(name);
        const tagSet = new Set();
        for (const part of name.split('-')) { if (part.length > 1) tagSet.add(part); }
        for (const c of sfCats) { const t = String(c).replace(/__/g, ' ').toLowerCase(); if (t.length > 1) tagSet.add(t); }
        if (Array.isArray(data.keywords)) for (const k of data.keywords) { const t = String(k).toLowerCase(); if (t.length > 1) tagSet.add(t); }
        if (data.style) tagSet.add(String(data.style).toLowerCase());
        const paths = data.svgPathData.map(p => `  <path d="${p.d}" fill="currentColor"${p.fillOpacity !== undefined && p.fillOpacity < 1 ? ` fill-opacity="${p.fillOpacity}"` : ''} />`).join('\n');
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${data.viewBox}" fill="currentColor">\n${paths}\n</svg>`;
        const pkgVariants = [...new Set(
          Object.values(data.variants || {}).map(v => iconNameToName.get(String(v))).filter(v => v && v !== name)
        )];
        sfEntries.push({ raw, name, category, tags: [...tagSet].slice(0, 8), svg, pkgVariants });
      } catch (e) {}
    }
    // Pass 4 — folder grouping: family base (sf-04-square-fill -> sf-04)
    // plus byte-identical SVGs (brand duplicates like sf-11ty/sf-brand11ty).
    const baseOf = (n) => {
      const stripped = n.replace(/(?:-(?:circle-fill|square-fill|circle|square|slash|fill))+$/, '');
      if (stripped && stripped !== 'sf') return stripped;
      const m = n.match(/^sf-((?:circle|square|slash|fill))(?:-|$)/);
      return m ? `sf-${m[1]}` : n;
    };
    const byBase = new Map();
    for (const e of sfEntries) {
      const b = baseOf(e.name);
      if (!byBase.has(b)) byBase.set(b, []);
      byBase.get(b).push(e.name);
    }
    const bySvg = new Map();
    for (const e of sfEntries) {
      if (!bySvg.has(e.svg)) bySvg.set(e.svg, []);
      bySvg.get(e.svg).push(e.name);
    }
    let count = 0;
    for (const e of sfEntries) {
      const family = (byBase.get(baseOf(e.name)) || []).filter(n => n !== e.name);
      const identical = (bySvg.get(e.svg) || []).filter(n => n !== e.name);
      const variants = [...new Set([...e.pkgVariants, ...family, ...identical])].sort();
      addIcon({ name: e.name, category: e.category, tags: e.tags, svg: e.svg, source: 'sfsymbols', ...(variants.length ? { variants } : {}) });
      count++;
    }
    console.log(`  SF Symbols: ${count} icons found`);
  } else {
    console.log('  SF Symbols: package not found, skipping (npm install @bradleyhodges/sfsymbols)');
  }
} catch (e) { console.error('  SF Symbols error:', e.message); }

// ─── Save ────────────────────────────────────────────
console.log(`\nTotal icons: ${allIcons.length} (added ${added} new)`);
fs.writeFileSync(DATA_PATH, JSON.stringify(allIcons, null, 2));
console.log('Saved to icons.json');
