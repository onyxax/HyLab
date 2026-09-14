import { NextRequest } from 'next/server';
import { searchIcons } from '@/domain/icons/service';
import { getIconByName } from '@/domain/icons/repository';
import { customizeSvg } from '@/domain/icons/transforms/customizeSvg';
import { convertSvgToFormat, getMimeType, getFileExtension } from '@/domain/icons/transforms/convertFormat';
import { parseIconQuery } from '@/lib/api/validation';
import { jsonSuccess, jsonError, CACHE_SECONDS, svgResponse, binaryResponse } from '@/lib/api/response';
import { API } from '@/domain/icons/constants';
import { ICON_SIZE } from '@/domain/icons/constants';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get('q') || '').trim();

  if (!query) {
    // Handle icon named "search" — /api/icons/search?color=... should return the icon, not an error
    // This resolves the conflict between /api/icons/search (search endpoint) and /api/icons/[name] where name=search
    if (searchParams.has('color') || searchParams.has('size') || searchParams.has('stroke') || searchParams.has('format') || searchParams.has('fill')) {
      let iconQuery;
      try {
        iconQuery = parseIconQuery(searchParams);
      } catch (e) {
        return jsonError((e as Error).message, 400);
      }
      const icon = getIconByName('search');
      if (!icon) return jsonError('Query parameter "q" is required', 400);
      let customizedSvg: string;
      try {
        customizedSvg = customizeSvg(icon.svg, {
          color: iconQuery.color,
          size: iconQuery.size,
          strokeWidth: iconQuery.strokeWidth,
          fill: iconQuery.fill,
        });
      } catch (e) {
        return jsonError((e as Error).message, 400);
      }
      if (iconQuery.format === 'svg') return svgResponse(customizedSvg);
      try {
        const buffer = await convertSvgToFormat(customizedSvg, iconQuery.format, iconQuery.size || ICON_SIZE.DEFAULT);
        return binaryResponse(buffer, getMimeType(iconQuery.format), `search.${getFileExtension(iconQuery.format)}`);
      } catch (e) {
        return jsonError((e as Error).message, 500);
      }
    }
    return jsonError('Query parameter "q" is required', 400);
  }

  if (query.length < 1 || query.length > API.SEARCH_QUERY_MAX) {
    return jsonError(`Query must be 1-${API.SEARCH_QUERY_MAX} characters`, 400);
  }

  const category = searchParams.get('category') || undefined;
  const source = (searchParams.get('set') || searchParams.get('source') || undefined) as string | undefined;
  const results = searchIcons(query, { category, source });

  return jsonSuccess(
    results.map(icon => ({
      name: icon.name,
      category: icon.category,
      tags: icon.tags,
      svg: icon.svg,
      source: icon.source,
    })),
    { total: results.length, query, category, source },
    { cache: CACHE_SECONDS.LIST }
  );
}
