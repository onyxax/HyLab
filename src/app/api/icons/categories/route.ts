import { NextResponse } from 'next/server';
import { getCategories, getTotalIcons } from '@/lib/icons';

export async function GET() {
  const categories = getCategories();
  const total = getTotalIcons();

  return NextResponse.json({
    success: true,
    data: categories,
    meta: {
      total: categories.length,
      totalIcons: total,
    },
  }, {
    headers: {
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
