import { NextRequest, NextResponse } from 'next/server';
import { searchIcons } from '@/lib/icons';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json(
      { success: false, error: 'Query parameter "q" is required' },
      { status: 400 }
    );
  }

  const results = searchIcons(query);

  return NextResponse.json({
    success: true,
    data: results.map(icon => ({
      name: icon.name,
      category: icon.category,
      tags: icon.tags,
      svg: icon.svg,
    })),
    meta: {
      total: results.length,
      query,
    },
  }, {
    headers: {
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
