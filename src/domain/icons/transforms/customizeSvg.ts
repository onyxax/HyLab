// SVG customization — deep module, not a shallow regex helper.
// Replaces the regex approach in lib/icons.ts:77 with more robust handling.

export interface CustomizeOptions {
  color?: string;
  size?: number;
  strokeWidth?: number;
  fill?: boolean;
}

/**
 * Customize SVG string:
 * - color: replaces stroke="currentColor" and fill="currentColor", optionally fill="none" if fill=true
 * - size: replaces width/height (ignoring stroke-width) with given size
 * - strokeWidth: replaces stroke-width attributes
 *
 * Uses string manipulation (no DOM) to stay compatible with Node/Edge runtimes.
 * Handles both quoted and unquoted? Currently quoted only — aligns with stored SVGs.
 */
export function customizeSvg(svg: string, options: CustomizeOptions): string {
  let result = svg;

  if (options.color) {
    const hex = options.color.replace(/^#/, '').toLowerCase();
    // Validate hex to avoid injection
    if (!/^[0-9a-f]{6}$/.test(hex)) {
      throw new Error(`Invalid hex color: ${options.color}`);
    }
    const withHash = `#${hex}`;
    result = result.replace(/stroke="currentColor"/g, `stroke="${withHash}"`);
    result = result.replace(/stroke:currentColor/g, `stroke:${withHash}`);
    result = result.replace(/fill="currentColor"/g, `fill="${withHash}"`);
    result = result.replace(/fill:currentColor/g, `fill:${withHash}`);
    if (options.fill) {
      result = result.replace(/fill="none"/g, `fill="${withHash}"`);
      // Also handle style fill:none
      result = result.replace(/fill:none/g, `fill:${withHash}`);
    }
  }

  if (options.size !== undefined) {
    if (!Number.isInteger(options.size) || options.size < 1 || options.size > 512) {
      throw new Error(`Invalid size: ${options.size}`);
    }
    const s = String(options.size);
    // Replace width/height but not stroke-width — uses negative lookbehind
    result = result.replace(/(?<!stroke-)width="[^"]*"/g, `width="${s}"`);
    result = result.replace(/(?<!stroke-)height="[^"]*"/g, `height="${s}"`);
    // If SVG has no width/height at all, inject them
    if (!result.includes('width="')) {
      result = result.replace('<svg ', `<svg width="${s}" `);
    }
    if (!result.includes('height="')) {
      result = result.replace('<svg ', `<svg height="${s}" `);
    }
  }

  if (options.strokeWidth !== undefined) {
    if (options.strokeWidth < 0.5 || options.strokeWidth > 10) {
      throw new Error(`Invalid strokeWidth: ${options.strokeWidth}`);
    }
    result = result.replace(/stroke-width="[^"]*"/g, `stroke-width="${options.strokeWidth}"`);
  }

  return result;
}
