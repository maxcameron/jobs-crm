
/**
 * Format a URL string to ensure it has a protocol and handle edge cases
 */
export function formatWebsiteUrl(url: string | null | undefined): string {
  if (!url) return '';
  
  // If URL doesn't start with a protocol, add https://
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }
  return url;
}

/**
 * Get a display-friendly hostname from a URL string
 */
export function getDisplayUrl(url: string | null | undefined): string {
  if (!url) return '';
  
  try {
    const formattedUrl = formatWebsiteUrl(url);
    const urlObject = new URL(formattedUrl);
    return urlObject.hostname;
  } catch (error) {
    console.error('Error parsing URL:', url, error);
    return url; // Fallback to original string if parsing fails
  }
}
