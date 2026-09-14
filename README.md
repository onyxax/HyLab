<div align="center">

<img src="public/favicon.svg" width="64" alt="HyLab" />

# HyLab
### The Icons API for Modern Apps

**18,039 icons · 10 families · One endpoint — any color, size, or format.**

<p>
  <a href="https://hylab.vercel.app"><img src="https://img.shields.io/badge/Live-hylab.vercel.app-111111?style=flat-square&labelColor=111111&color=111111&logo=vercel&logoColor=white" alt="Live"></a>
  <a href="https://github.com/onyxax/HyLab"><img src="https://img.shields.io/github/stars/onyxax/HyLab?style=flat-square&labelColor=111111&color=111111&label=GitHub&logo=github&logoColor=white" alt="Stars"></a>
  <a href="https://hylab.vercel.app/api/icons?limit=1"><img src="https://img.shields.io/badge/Icons-18,039-7c9a82?style=flat-square&labelColor=111111&color=7c9a82" alt="Icons"></a>
  <a href="https://github.com/onyxax/HyLab/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-7c9a82?style=flat-square&labelColor=111111&color=7c9a82" alt="MIT"></a>
</p>

<a href="https://vercel.com/new/clone?repository-url=https://github.com/onyxax/HyLab"><img src="https://vercel.com/button" alt="Deploy with Vercel"></a>

<br><br>
<img src="public/screenshots/home.png" width="100%" alt="HyLab — Browse 18k icons" style="border:1px solid #e5e0d8;border-radius:16px" />

</div>

---

## <img src="https://hylab.vercel.app/api/icons/zap?color=7c9a82&size=20" width="20" height="20" alt=""> Quick Start

No install — just a URL. Works with `curl`, `HTML`, `React`, `Next.js`, `Vue`, `Svelte`, `Python`.

```bash
# curl — SVG
curl "https://hylab.vercel.app/api/icons/home?color=7c9a82&size=32"

# curl — PNG
curl "https://hylab.vercel.app/api/icons/home?color=7c9a82&size=64&format=png"

# curl — filter by family + category
curl "https://hylab.vercel.app/api/icons?set=tabler&category=navigation&limit=20"
```

```html
<!-- HTML — drop in anywhere -->
<img src="https://hylab.vercel.app/api/icons/home?color=7c9a82&size=32" alt="Home" />
<img src="https://hylab.vercel.app/api/icons/heart?color=ef4444&size=24" alt="Heart" />
```

```tsx
// React — zero deps
const Icon = ({ name, color = "7c9a82", size = 24 }: { name: string; color?: string; size?: number }) => (
  <img src={`https://hylab.vercel.app/api/icons/${name}?color=${color}&size=${size}`} alt={name} />
);
```

---

## <img src="https://hylab.vercel.app/api/icons/layers?color=7c9a82&size=20" width="20" height="20" alt=""> Features

<table>
<tr>
<td width="50%" valign="top">

#### <img src="https://hylab.vercel.app/api/icons/inbox?color=7c9a82&size=16" width="16" height="16" alt=""> One API, All Icons
One endpoint serves **10 families**. No need to install 10 packages.

</td>
<td width="50%" valign="top">

#### <img src="https://hylab.vercel.app/api/icons/sliders?color=7c9a82&size=16" width="16" height="16" alt=""> Fully Customizable
`?color=7c9a82&size=32&stroke=2&format=svg` — color, size, stroke, format.

</td>
</tr>
<tr>
<td valign="top">

#### <img src="https://hylab.vercel.app/api/icons/image?color=7c9a82&size=16" width="16" height="16" alt=""> SVG, PNG & WebP
Vector for web, raster for email. `sharp` on the edge, immutable cache.

</td>
<td valign="top">

#### <img src="https://hylab.vercel.app/api/icons/shield-check?color=7c9a82&size=16" width="16" height="16" alt=""> No Auth, No Limits
Free, open source, CORS `*`. No API keys.

</td>
</tr>
<tr>
<td valign="top">

#### <img src="https://hylab.vercel.app/api/icons/filter?color=7c9a82&size=16" width="16" height="16" alt=""> Filter by Family
`?set=tabler` or `?set=lucide` — isolate one family. Combines with `?category=`.

</td>
<td valign="top">

#### <img src="https://hylab.vercel.app/api/icons/link?color=7c9a82&size=16" width="16" height="16" alt=""> Shareable URLs
`/browse?set=tabler&category=navigation` — every filter is in the URL.

</td>
</tr>
</table>

---

## <img src="https://hylab.vercel.app/api/icons/code?color=7c9a82&size=20" width="20" height="20" alt=""> API Reference

### <img src="https://hylab.vercel.app/api/icons/box?color=7c9a82&size=16" width="16" height="16" alt=""> Get Icon
```
GET /api/icons/:name
```
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | path | — | Icon name — `home`, `search`, `heart` |
| `color` | query | `currentColor` | Hex without `#` — `7c9a82` |
| `size` | query | `24` | Pixels `1–512` |
| `stroke` | query | `2` | Stroke `0.5–4` |
| `fill` | query | `false` | `true` to fill shape |
| `format` | query | `svg` | `svg` · `png` · `webp` |

```bash
curl "https://hylab.vercel.app/api/icons/home?color=7c9a82&size=32"
curl "https://hylab.vercel.app/api/icons/home?format=png&size=64"
curl "https://hylab.vercel.app/api/icons/home?color=7c9a82&size=48&stroke=3&format=webp"
```

### <img src="https://hylab.vercel.app/api/icons/list?color=7c9a82&size=16" width="16" height="16" alt=""> List Icons
```
GET /api/icons?page=1&limit=20&category=navigation&set=tabler
```
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | query | `1` | Page number |
| `limit` | query | `50` | Items per page — max `100` |
| `category` | query | — | `navigation`, `action`, `media`… (14 total) |
| `set` | query | — | Family — `tabler`, `lucide`, `phosphor`… (alias `source`) |

### <img src="https://hylab.vercel.app/api/icons/search-x?color=7c9a82&size=16" width="16" height="16" alt=""> Search
```
GET /api/icons/search?q=arrow
```

### <img src="https://hylab.vercel.app/api/icons/folder?color=7c9a82&size=16" width="16" height="16" alt=""> Categories
```
GET /api/icons/categories
GET /api/icons/categories?set=tabler
```
Filter counts to a family.

### <img src="https://hylab.vercel.app/api/icons/layers?color=7c9a82&size=16" width="16" height="16" alt=""> Sets
```
GET /api/icons/sets
GET /api/icons/sets?category=navigation
```
Filter families to a category.

### <img src="https://hylab.vercel.app/api/icons/activity?color=7c9a82&size=16" width="16" height="16" alt=""> Status
```
GET /api/status
```
Live probes to 5 endpoints — `avgResponseTime`, `services[]`, `uptime`.

---

## <img src="https://hylab.vercel.app/api/icons/code?color=7c9a82&size=20" width="20" height="20" alt=""> Code Examples

<details>
<summary><strong><img src="https://hylab.vercel.app/api/icons/file-code?color=7c9a82&size=14" width="14" height="14" alt=""> HTML</strong> — copy & paste</summary>

```html
<img src="https://hylab.vercel.app/api/icons/home?color=7c9a82&size=32" alt="Home" />
<img src="https://hylab.vercel.app/api/icons/search?color=ffffff&size=24" alt="Search" />
<img src="https://hylab.vercel.app/api/icons/heart?color=ef4444&size=48&format=png" alt="Heart" />

<!-- Family filter -->
<img src="https://hylab.vercel.app/api/icons/home?color=7c9a82&size=32" alt="Home" />
```

</details>

<details>
<summary><strong><img src="https://hylab.vercel.app/api/icons/atom?color=7c9a82&size=14" width="14" height="14" alt=""> React</strong> — zero deps</summary>

```tsx
function Icon({ name, color = "7c9a82", size = 24 }: { name: string; color?: string; size?: number }) {
  return <img src={`https://hylab.vercel.app/api/icons/${name}?color=${color}&size=${size}`} alt={name} />;
}

// Family filtered list
function TablerIcons() {
  const [icons, setIcons] = useState([]);
  useEffect(() => {
    fetch('/api/icons?set=tabler&limit=20').then(r => r.json()).then(d => setIcons(d.data));
  }, []);
  return icons.map(i => <Icon key={i.name} name={i.name} />);
}
```
</details>

<details>
<summary><strong><img src="https://hylab.vercel.app/api/icons/server?color=7c9a82&size=14" width="14" height="14" alt=""> Next.js</strong> — edge proxy</summary>

```tsx
// app/icon/[name]/route.ts
import { NextResponse } from "next/server";
export async function GET(req: Request, { params }: { params: { name: string } }) {
  const { searchParams } = new URL(req.url);
  const color = searchParams.get("color") || "7c9a82";
  const set = searchParams.get("set") || "tabler";
  const res = await fetch(`https://hylab.vercel.app/api/icons/${params.name}?color=${color}&set=${set}`);
  return new NextResponse(await res.blob(), {
    headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=86400" },
  });
}
```
</details>

<details>
<summary><strong><img src="https://hylab.vercel.app/api/icons/code?color=7c9a82&size=14" width="14" height="14" alt=""> Vue</strong></summary>

```vue
<template><span v-html="svg" /></template>
<script setup>
import { ref, onMounted } from "vue";
const svg = ref("");
onMounted(async () => {
  const res = await fetch(`/api/icons/home?color=7c9a82&size=32&set=lucide`);
  svg.value = await res.text();
});
</script>
```
</details>

<details>
<summary><strong><img src="https://hylab.vercel.app/api/icons/code?color=7c9a82&size=14" width="14" height="14" alt=""> Svelte</strong></summary>

```svelte
<script>
  export let name = "home";
  let svg = "";
  $: fetch(`/api/icons/${name}?color=7c9a82&set=tabler`).then(r=>r.text()).then(t=>svg=t);
</script>
<span>{@html svg}</span>
```
</details>

<details>
<summary><strong><img src="https://hylab.vercel.app/api/icons/terminal?color=7c9a82&size=14" width="14" height="14" alt=""> Python</strong></summary>

```python
import requests

# Family filtered
res = requests.get("https://hylab.vercel.app/api/icons", params={"set": "tabler", "limit": 20})
icons = res.json()["data"]

# Single icon
svg = requests.get("https://hylab.vercel.app/api/icons/home", params={"color": "7c9a82", "size": "32"}).text

# Search
icons = requests.get("https://hylab.vercel.app/api/icons/search", params={"q": "arrow"}).json()["data"]
```
</details>

---

## <img src="https://hylab.vercel.app/api/icons/library?color=7c9a82&size=20" width="20" height="20" alt=""> Icon Sources

| Source | Icons | License |
|--------|-------|---------|
| **Tabler** | 5,093 | MIT |
| **Remix** | 3,229 | Apache 2.0 |
| **Carbon** | 2,665 | Apache 2.0 |
| **Lucide** | 1,582 | ISC |
| **Phosphor** | 1,512 | MIT |
| **Iconoir** | 1,383 | MIT |
| **BoxIcons** | 814 | MIT |
| **Octicons** | 733 | MIT |
| **CSS.gg** | 704 | MIT |
| **Heroicons** | 324 | MIT |

**Total: 18,039 icons · 14 categories · Shareable `/browse?set=tabler&category=navigation`**

---

## <img src="https://hylab.vercel.app/api/icons/cpu?color=7c9a82&size=20" width="20" height="20" alt=""> Tech Stack

<p align="left">
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-16.2-111111?style=flat-square&logo=nextdotjs&logoColor=white&labelColor=111111&color=111111" alt="Next.js"></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.7-111111?style=flat-square&logo=typescript&logoColor=white&labelColor=111111&color=111111" alt="TypeScript"></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind-4.0-111111?style=flat-square&logo=tailwindcss&logoColor=white&labelColor=111111&color=111111" alt="Tailwind"></a>
  <a href="https://vercel.com"><img src="https://img.shields.io/badge/Deploy-Vercel-111111?style=flat-square&logo=vercel&logoColor=white&labelColor=111111&color=111111" alt="Vercel"></a>
</p>

---

## <img src="https://hylab.vercel.app/api/icons/download?color=7c9a82&size=20" width="20" height="20" alt=""> Self-Host

```bash
git clone https://github.com/onyxax/HyLab.git
cd HyLab
npm install
npm run dev
# http://localhost:3000
```

---

## <img src="https://hylab.vercel.app/api/icons/users?color=7c9a82&size=20" width="20" height="20" alt=""> Contributing

Contributions welcome — open an issue or PR.

```bash
git checkout -b feat/my-feature
npm run build  # must pass
```

---

## <img src="https://hylab.vercel.app/api/icons/scale?color=7c9a82&size=20" width="20" height="20" alt=""> License

[MIT](https://github.com/onyxax/HyLab/blob/main/LICENSE) — free for personal and commercial use.

---

<div align="center">

<table>
<tr>
<td align="left" width="40%" valign="top">

<img src="public/favicon.svg" width="28" alt="HyLab" />

**HyLab** — The Icons API for Modern Apps<br>
<sub>18,039 icons from 10 families · One endpoint, any color, size, or format. Free and open source.</sub>

<br><br>

<a href="https://github.com/onyxax/HyLab"><img src="https://img.shields.io/badge/GitHub-onyxax%2FHyLab-2c2825?style=flat-square&logo=github&logoColor=white&labelColor=2c2825" alt="GitHub"></a>
<a href="https://hylab.vercel.app/api/status"><img src="https://img.shields.io/badge/status-live-10b981?style=flat-square&labelColor=2c2825&color=10b981" alt="Status"></a>

</td>
<td align="left" width="30%" valign="top">

**Explore**

<a href="https://hylab.vercel.app/browse"><img src="https://hylab.vercel.app/api/icons/compass?color=7c9a82&size=12" width="12" height="12" alt=""> Browse Icons</a><br>
<a href="https://hylab.vercel.app/docs"><img src="https://hylab.vercel.app/api/icons/book-open?color=7c9a82&size=12" width="12" height="12" alt=""> Documentation</a><br>
<a href="https://hylab.vercel.app/about"><img src="https://hylab.vercel.app/api/icons/info?color=7c9a82&size=12" width="12" height="12" alt=""> About</a><br>
<a href="https://hylab.vercel.app/status"><img src="https://hylab.vercel.app/api/icons/activity?color=7c9a82&size=12" width="12" height="12" alt=""> System Status</a>

</td>
<td align="left" width="30%" valign="top">

**Resources**

<a href="https://github.com/onyxax/HyLab"><img src="https://hylab.vercel.app/api/icons/iconoir-github?color=7c9a82&size=12" width="12" height="12" alt=""> GitHub</a><br>
<a href="https://github.com/onyxax/HyLab/blob/main/LICENSE"><img src="https://hylab.vercel.app/api/icons/scale?color=7c9a82&size=12" width="12" height="12" alt=""> MIT License</a><br>
<sub>No tracking · No cookies</sub>

</td>
</tr>
</table>

<br>

---

<sub>© 2026 HyLab · Icons from Tabler, Lucide, Heroicons & others — respective licenses apply. · Built by <a href="https://guns.lol/onyxax"><strong>onyxax</strong></a></sub>

</div>
