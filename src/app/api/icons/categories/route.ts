import { getCategories, getTotalIcons } from '@/domain/icons/service';
import { jsonSuccess } from '@/lib/api/response';

export async function GET() {
  const categories = getCategories();
  const total = getTotalIcons();

  return jsonSuccess(categories, { total: categories.length, totalIcons: total }, { cache: 3600 });
}
