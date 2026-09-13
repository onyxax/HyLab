// Backward-compatible facade — delegates to domain/icons.
// New code should import from '@/domain/icons/repository' or '@/domain/icons/service' or '@/domain/icons/transforms/*'
// Kept to avoid breaking existing API routes during migration.

export { getAllIcons, getIconByName, searchIcons, getIconsByCategory, getTotalIcons } from '@/domain/icons/repository';
export { getCategories, getSets } from '@/domain/icons/service';
export { customizeSvg } from '@/domain/icons/transforms/customizeSvg';
export { convertSvgToFormat, getMimeType, getFileExtension } from '@/domain/icons/transforms/convertFormat';
