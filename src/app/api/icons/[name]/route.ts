import { NextRequest } from 'next/server';
import { getIconByName } from '@/domain/icons/repository';
import { customizeSvg } from '@/domain/icons/transforms/customizeSvg';
import { convertSvgToFormat, getMimeType, getFileExtension } from '@/domain/icons/transforms/convertFormat';
import { parseIconQuery } from '@/lib/api/validation';
import { jsonSuccess, jsonError, svgResponse, binaryResponse, CACHE_SECONDS } from '@/lib/api/response';
import { ICON_SIZE } from '@/domain/icons/constants';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const searchParams = new URL(request.url).searchParams;

  const icon = getIconByName(name);
  if (!icon) {
    return jsonError(`Icon "${name}" not found`, 404);
  }

  // ?format=json — metadata as JSON (powers variant navigation in preview).
  // Handled before parseIconQuery since json is not an image format.
  if ((searchParams.get('format') || '').toLowerCase() === 'json') {
    const pathCount = (icon.svg.match(/<path[\s>]/gi) || []).length;
    return jsonSuccess(
      {
        name: icon.name,
        category: icon.category,
        tags: icon.tags,
        svg: icon.svg,
        source: icon.source,
        ...(icon.variants?.length ? { variants: icon.variants } : {}),
        paths: pathCount,
      },
      undefined,
      { cache: CACHE_SECONDS.LIST }
    );
  }

  let query;
  try {
    query = parseIconQuery(searchParams);
  } catch (e) {
    return jsonError((e as Error).message, 400);
  }

  let customizedSvg: string;
  try {
    customizedSvg = customizeSvg(icon.svg, {
      color: query.color,
      size: query.size,
      strokeWidth: query.strokeWidth,
      fill: query.fill,
    });
  } catch (e) {
    return jsonError((e as Error).message, 400);
  }

  if (query.format === 'svg') {
    return svgResponse(customizedSvg);
  }

  try {
    const buffer = await convertSvgToFormat(customizedSvg, query.format, query.size || ICON_SIZE.DEFAULT);
    return binaryResponse(
      buffer,
      getMimeType(query.format),
      `${name}.${getFileExtension(query.format)}`
    );
  } catch (e) {
    return jsonError((e as Error).message, 500);
  }
}
