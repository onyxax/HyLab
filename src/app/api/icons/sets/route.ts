import { getSets } from '@/domain/icons/service';
import { jsonSuccess } from '@/lib/api/response';

export async function GET() {
  const sets = getSets();
  return jsonSuccess(sets, { total: sets.length }, { cache: 3600 });
}
