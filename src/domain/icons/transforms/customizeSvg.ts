import { ICON_COLOR_RE, ICON_SIZE, ICON_STROKE } from '@/domain/icons/constants';

export interface CustomizeOptions {
  color?: string;
  size?: number;
  strokeWidth?: number;
  fill?: boolean;
}

/**
 * Deep SVG customization — unified color/size/stroke handling.
 * - Validation delegated to constants (single owner) but re-validated here to avoid bypass.
 * - Handles quoted ("/') + unquoted + style contexts, case-insensitive currentColor.
 * - Node/Edge safe (no DOM).
 */
export function customizeSvg(svg: string, options: CustomizeOptions): string {
  let result = svg;

  if (options.color) {
    const hex = options.color.replace(/^#/, '').toLowerCase();
    if (!ICON_COLOR_RE.test(hex)) {
      throw new Error(`Invalid hex color: ${options.color}`);
    }
    const withHash = `#${hex}`;
    const beforeColor = result;
    // Attribute forms: stroke="currentColor" / stroke='currentColor' / stroke=currentColor
    result = result.replace(/stroke\s*=\s*["']currentColor["']/gi, `stroke="${withHash}"`);
    result = result.replace(/stroke\s*=\s*currentColor/gi, `stroke="${withHash}"`);
    result = result.replace(/stroke:\s*currentColor/gi, `stroke:${withHash}`);
    result = result.replace(/fill\s*=\s*["']currentColor["']/gi, `fill="${withHash}"`);
    result = result.replace(/fill\s*=\s*currentColor/gi, `fill="${withHash}"`);
    result = result.replace(/fill:\s*currentColor/gi, `fill:${withHash}`);
    if (options.fill) {
      result = result.replace(/fill\s*=\s*["']none["']/gi, `fill="${withHash}"`);
      result = result.replace(/fill:\s*none/gi, `fill:${withHash}`);
    }
    // Fallback for icons without currentColor (e.g. Carbon filled icons with bare <path d="..."/>)
    if (result === beforeColor) {
      if (!/fill\s*=/.test(result)) {
        // No fill at all — inject fill so bare paths inherit (filled icons)
        result = result.replace('<svg', `<svg fill="${withHash}"`);
      } else {
        // Has fill — replace hardcoded fill (except none unless fill=true)
        result = result.replace(/fill\s*=\s*["'][^"']*["']/gi, (m) => {
          if (/none/i.test(m)) return options.fill ? `fill="${withHash}"` : m;
          return `fill="${withHash}"`;
        });
      }
      // DO NOT inject stroke for filled icons — it creates broken outline
      // Stroke will be handled only if caller explicitly asks via strokeWidth
    }
    // Mixed icons: if currentColor was replaced but some bare paths remain, ensure svg has fill fallback
    // Only inject if no fill was injected at all (avoid adding stroke)
    if (result !== beforeColor && !result.includes(`fill="${withHash}"`) && !result.toLowerCase().includes(withHash.toLowerCase())) {
      if (!/fill\s*=/.test(result)) {
        result = result.replace('<svg', `<svg fill="${withHash}"`);
      }
    }
  }

  if (options.size !== undefined) {
    if (!Number.isInteger(options.size) || options.size < ICON_SIZE.MIN || options.size > ICON_SIZE.MAX) {
      throw new Error(`Invalid size: ${options.size}`);
    }
    const s = String(options.size);
    // Only touch the <svg> tag — inner <rect width="7"> must stay untouched
    result = result.replace(/<svg([^>]*)>/i, (match, attrs) => {
      let newAttrs = attrs;
      if (/\bwidth\s*=/.test(newAttrs)) {
        newAttrs = newAttrs.replace(/\bwidth\s*=\s*["'][^"']*["']/gi, `width="${s}"`);
        newAttrs = newAttrs.replace(/\bwidth\s*=\s*[^"'\s>]+/gi, `width="${s}"`);
      } else {
        newAttrs += ` width="${s}"`;
      }
      if (/\bheight\s*=/.test(newAttrs)) {
        newAttrs = newAttrs.replace(/\bheight\s*=\s*["'][^"']*["']/gi, `height="${s}"`);
        newAttrs = newAttrs.replace(/\bheight\s*=\s*[^"'\s>]+/gi, `height="${s}"`);
      } else {
        newAttrs += ` height="${s}"`;
      }
      return `<svg${newAttrs}>`;
    });
  }

  if (options.strokeWidth !== undefined) {
    if (options.strokeWidth < ICON_STROKE.MIN || options.strokeWidth > ICON_STROKE.MAX) {
      throw new Error(`Invalid strokeWidth: ${options.strokeWidth}`);
    }
    result = result.replace(/stroke-width\s*=\s*["'][^"']*["']/gi, `stroke-width="${options.strokeWidth}"`);
    result = result.replace(/stroke-width\s*:\s*[^;"']+/gi, `stroke-width:${options.strokeWidth}`);
    // If svg has no stroke-width at all but caller wants one, inject into opening tag
    if (!/stroke-width/.test(svg) && /<svg[^>]*>/.test(result)) {
      result = result.replace(/<svg([^>]*)>/, `<svg$1 stroke-width="${options.strokeWidth}">`);
    }
  }

  return result;
}
