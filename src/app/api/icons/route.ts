import { NextRequest } from 'next/server';
import { listIcons } from '@/domain/icons/service';
import { parsePage, parseLimit } from '@/lib/api/validation';
import { jsonSuccess, jsonError } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parsePage(searchParams.get('page'));
    const limit = parseLimit(searchParams.get('limit'));
    const category = searchParams.get('category') || undefined;

    const { data, meta } = listIcons({ page, limit, category });

    return jsonSuccess(
      data.map(icon => ({
        name: icon.name,
        category: icon.category,
        tags: icon.tags,
        svg: icon.svg,
        source: icon.source,
      })),
      meta,
      { cache: 3600 }
    );
  } catch (e) {
    return jsonError((e as Error).message, 400);
  }
}
