# HyLab Architecture — Post-Refactor

> تاريخ إعادة الهيكلة: 2026-09-13 — الهدف: فك الاقتران، تعميق الوحدات السطحية، وتوحيد المنطق المكرر.

## المبادئ

1. **Single Owner للبيانات:** `src/domain/icons/repository.ts` هو المالك الوحيد لـ `icons.json` (13MB). لا أحد يستورد JSON مباشرة.
2. **Service طبقة الأعمال:** `src/domain/icons/service.ts` يحسب `categories` و `sets` مرة واحدة (memoized) ويوفر `listIcons(page,limit,category)` و `searchIcons`.
3. **Transforms معزولة:** `src/domain/icons/transforms/*` — كل تحويل SVG في ملف عميق مع validation، لا regex مبعثر.
4. **API موحد:** `src/lib/api/*` — `response.ts` للـ CORS/Cache، `validation.ts` لكل query، `client.ts` للـ frontend.
5. **UI مركب:** `src/components/icons/*` و `src/components/ui/*` — لا تكرار بين `page.tsx` و `browse/page.tsx`.

## الهيكل الجديد

```
src/
 ├── domain/
 │   ├── icons/
 │   │   ├── schema.ts            # Icon, Pagination, VALID_FORMATS
 │   │   ├── repository.ts        # Map<name,Icon>, Map<category,Icon[]>, lazy load
 │   │   ├── service.ts           # getCategories (memoized), getSets, listIcons, searchIcons
 │   │   └── transforms/
 │   │       ├── customizeSvg.ts  # hex validation + size/stroke handling
 │   │       └── convertFormat.ts # sharp wrapper + mime helpers
 │   └── theme/
 │       └── theme.tsx            # single source: storage + data-theme + Context
 ├── lib/
 │   ├── api/
 │   │   ├── response.ts          # jsonSuccess/jsonError/svgResponse/binaryResponse
 │   │   ├── validation.ts        # parseColor/Size/Stroke/Format/Page/Limit
 │   │   └── client.ts            # api.icons.list/search/categories + buildIconUrl
 │   └── color/
 │       └── color.ts             # hexToHsl/hslToRgb/drawColorGrid
 ├── hooks/
 │   ├── useDebouncedValue.ts
 │   ├── useCategories.ts         # uses api.icons.categories()
 │   └── useIcons.ts              # handles search vs category vs pagination + debounce
 ├── components/
 │   ├── ui/ (Button, Card, Input, SearchInput)
 │   ├── icons/ (IconCard, IconGrid, CategoryFilter, IconPreviewModal)
 │   └── layout/AppShell.tsx
 └── app/api/icons/*              # routes نحيفة — فقط parse → service → response
scripts/
 └── sources/ (types, utils, lucide, heroicons, tabler, index)
```

## ما تم إصلاحه

| المشكلة قبل | الحل بعد |
|---|---|
| 5 routes تكرر `NextResponse.json(..., {headers:{Cache...}})` | `lib/api/response.ts` واحد |
| `fetch('/api/...')` مبعثر في 4 صفحات | `lib/api/client.ts` واحد |
| `customizeSvg` بدون validation، `parseInt` بدون check | `lib/api/validation.ts` + `customizeSvg` مع hex/size checks |
| 13MB import في كل route | `repository.ts` singleton + Map index O(1) |
| `ThemeProvider` ميت + `ThemeToggle` مكرر | `domain/theme/theme.tsx` واحد |
| `page.tsx` 285 سطر + `browse` 504 سطر يكرران search/pagination | `useIcons` + `IconGrid` + `CategoryFilter` — كل صفحة <120 سطر |
| `ColorPicker.tsx` 308 سطر يخلط canvas + color math | `lib/color/color.ts` منفصل |
| `scripts/fetch-icons.ts` 258 سطر God file | `scripts/sources/*.ts` كل مصدر ملف |

## للمطور القادم

- **لإضافة validation جديد:** عدّل `src/lib/api/validation.ts` و `domain/icons/schema.ts` فقط.
- **لإضافة مصدر أيقونات:** أنشئ `scripts/sources/new.ts` يطبق `IconSource` وأضفه لـ `allSources` في `scripts/sources/index.ts`.
- **لتغيير شكل الـ Grid:** عدّل `src/components/icons/IconGrid.tsx` فقط — كل الصفحات تستخدمه.
- **لتغيير Cache/CORS:** عدّل `src/lib/api/response.ts` فقط.

## أوامر

```bash
npm run build   # يبني Next.js — يجب أن يمر بدون أخطاء type
npm run dev     # localhost:3000
npm run fetch-icons # يجلب من sources/* ويحفظ external-icons.json
```
