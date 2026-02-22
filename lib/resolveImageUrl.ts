const FALLBACK_IMAGE = '/cover.jpg';

const EXTERNAL_IMAGE_PATTERN = /^https?:\/\/[^\s]+\.(?:jpg|jpeg|png|webp|gif)(?:\?.*)?$/i;
const BLOCKED_IMAGE_HOST_PATTERN = /^https?:\/\/(?:www\.)?(?:facebook\.com|fb\.com|m\.facebook\.com)\//i;

export function resolveImageUrl(value?: string): string {
  if (!value) {
    return FALLBACK_IMAGE;
  }

  if (value.startsWith('/')) {
    return value;
  }

  if (BLOCKED_IMAGE_HOST_PATTERN.test(value)) {
    return FALLBACK_IMAGE;
  }

  if (EXTERNAL_IMAGE_PATTERN.test(value)) {
    return value;
  }

  return FALLBACK_IMAGE;
}

export { FALLBACK_IMAGE };
