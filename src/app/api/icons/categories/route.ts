import { NextRequest } from 'next/server';
import { getCategories, getTotalIcons } from '@/domain/icons/service';
import { jsonSuccess, CACHE_SECONDS } from '@/lib/api/response';
import { parseSource } from '@/lib/api/validation';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const source = parseSource(searchParams.get('set') || searchParams.get('source') || null);
  const categories = getCategories(source ? { source } : undefined);
  const total = getTotalIcons();
  return jsonSuccess(categories, { total: categories.length, totalIcons: total }, { cache: source ? 60 : CACHE_SECONDS.LIST });
}
