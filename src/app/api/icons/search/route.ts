import { NextRequest } from 'next/server';
import { searchIcons } from '@/domain/icons/service';
import { jsonSuccess, jsonError } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get('q') || '').trim();

  if (!query) {
    return jsonError('Query parameter "q" is required', 400);
  }

  if (query.length < 1 || query.length > 100) {
    return jsonError('Query must be 1-100 characters', 400);
  }

  const results = searchIcons(query);

  return jsonSuccess(
    results.map(icon => ({
      name: icon.name,
      category: icon.category,
      tags: icon.tags,
      svg: icon.svg,
      source: icon.source,
    })),
    { total: results.length, query },
    { cache: 3600 }
  );
}
