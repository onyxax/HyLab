import { NextResponse } from 'next/server';
import { CACHE, API } from '@/domain/icons/constants';

type SuccessMeta = Record<string, unknown>;

// المركز الوحيد لـ CORS/Cache — أي تغيير هنا يطبق على كل الـ API
const CORS_HEADERS = { 'Access-Control-Allow-Origin': API.CORS_ORIGIN } as const;

export const CACHE_SECONDS = CACHE;
export { API as API_CONFIG };

export function jsonSuccess<T>(
  data: T,
  meta?: SuccessMeta,
  init?: { status?: number; cache?: number }
) {
  const headers: Record<string, string> = { ...CORS_HEADERS };
  if (init?.cache !== undefined) {
    headers['Cache-Control'] = init.cache === 0
      ? 'no-store'
      : `public, max-age=${init.cache}`;
  }
  return NextResponse.json(
    {
      success: true,
      data,
      ...(meta ? { meta } : {}),
    },
    {
      status: init?.status ?? 200,
      headers,
    }
  );
}

export function jsonError(message: string, status: number, extraHeaders?: Record<string, string>) {
  return NextResponse.json(
    { success: false, error: message },
    {
      status,
      headers: { ...CORS_HEADERS, ...(extraHeaders || {}) },
    }
  );
}

export function svgResponse(svg: string, cacheSeconds = CACHE.ICON_IMMUTABLE) {
  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': `public, max-age=${cacheSeconds}, immutable`,
      ...CORS_HEADERS,
    },
  });
}

export function binaryResponse(
  buffer: Buffer | Uint8Array,
  contentType: string,
  filename: string,
  cacheSeconds = CACHE.ICON_IMMUTABLE
) {
  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `inline; filename="${filename}"`,
      'Cache-Control': `public, max-age=${cacheSeconds}, immutable`,
      ...CORS_HEADERS,
    },
  });
}
