import { NextRequest } from 'next/server';
import { getIconByName } from '@/domain/icons/repository';
import { customizeSvg } from '@/domain/icons/transforms/customizeSvg';
import { convertSvgToFormat, getMimeType, getFileExtension } from '@/domain/icons/transforms/convertFormat';
import { parseIconQuery } from '@/lib/api/validation';
import { jsonError, svgResponse, binaryResponse } from '@/lib/api/response';
import { ICON_SIZE } from '@/domain/icons/constants';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;

  let query;
  try {
    query = parseIconQuery(new URL(request.url).searchParams);
  } catch (e) {
    return jsonError((e as Error).message, 400);
  }

  const icon = getIconByName(name);
  if (!icon) {
    return jsonError(`Icon "${name}" not found`, 404);
  }

  let customizedSvg: string;
  try {
    customizedSvg = customizeSvg(icon.svg, {
      color: query.color,
      size: query.size,
      strokeWidth: query.strokeWidth,
      fill: query.fill,
    });
  } catch (e) {
    return jsonError((e as Error).message, 400);
  }

  if (query.format === 'svg') {
    return svgResponse(customizedSvg);
  }

  try {
    const buffer = await convertSvgToFormat(customizedSvg, query.format, query.size || ICON_SIZE.DEFAULT);
    return binaryResponse(
      buffer,
      getMimeType(query.format),
      `${name}.${getFileExtension(query.format)}`
    );
  } catch (e) {
    return jsonError((e as Error).message, 500);
  }
}
