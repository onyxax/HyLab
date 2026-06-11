import { NextRequest, NextResponse } from 'next/server';
import { getAllIcons, getTotalIcons } from '@/lib/icons';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '50');
  const category = searchParams.get('category') || undefined;

  let icons = getAllIcons();

  if (category) {
    icons = icons.filter(icon => icon.category === category);
  }

  const total = icons.length;
  const offset = (page - 1) * limit;
  const paginatedIcons = icons.slice(offset, offset + limit);

  return NextResponse.json({
    success: true,
    data: paginatedIcons.map(icon => ({
      name: icon.name,
      category: icon.category,
      tags: icon.tags,
      svg: icon.svg,
    })),
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  }, {
    headers: {
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
