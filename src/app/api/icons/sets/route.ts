import { NextRequest } from 'next/server';
import { getSets } from '@/domain/icons/service';
import { jsonSuccess, CACHE_SECONDS } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || undefined;
  const sets = getSets(category ? { category } : undefined);
  return jsonSuccess(sets, { total: sets.length }, { cache: category ? 60 : CACHE_SECONDS.LIST });
}
