import { NextResponse } from 'next/server';
import { getSets } from '@/lib/icons';

export async function GET() {
  const sets = getSets();

  return NextResponse.json({
    success: true,
    data: sets,
    meta: {
      total: sets.length,
    },
  }, {
    headers: {
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
