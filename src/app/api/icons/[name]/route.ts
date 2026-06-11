import { NextRequest, NextResponse } from 'next/server';
import { getIconByName, customizeSvg, convertSvgToFormat, getMimeType, getFileExtension } from '@/lib/icons';
import { OutputFormat } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const { searchParams } = new URL(request.url);

  const color = searchParams.get('color') || undefined;
  const size = searchParams.get('size') ? parseInt(searchParams.get('size')!) : undefined;
  const strokeWidth = searchParams.get('stroke') ? parseFloat(searchParams.get('stroke')!) : undefined;
  const fill = searchParams.get('fill') === 'true';
  const format = (searchParams.get('format') as OutputFormat) || 'svg';

  const icon = getIconByName(name);

  if (!icon) {
    return NextResponse.json(
      { success: false, error: `Icon "${name}" not found` },
      { status: 404 }
    );
  }

  const customizedSvg = customizeSvg(icon.svg, {
    color,
    size,
    strokeWidth,
    fill,
  });

  if (format === 'svg') {
    return new NextResponse(customizedSvg, {
      headers: {
        'Content-Type': getMimeType('svg'),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  const buffer = await convertSvgToFormat(customizedSvg, format, size || 24);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': getMimeType(format),
      'Content-Disposition': `inline; filename="${name}.${getFileExtension(format)}"`,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
