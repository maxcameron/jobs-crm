
/**
 * Format a URL string to ensure it has a protocol and handle edge cases
 */
export function formatWebsiteUrl(url: string | null | undefined): string {
  if (!url?.trim()) return '';
  
  let formattedUrl = url.trim();
  
  // If URL doesn't start with a protocol, add https://
  if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
    formattedUrl = `https://${formattedUrl}`;
  }
  
  // Basic URL validation
  try {
    new URL(formattedUrl);
    return formattedUrl;
  } catch (error) {
    console.error('Invalid URL:', url);
    return '';
  }
}

/**
 * Get a display-friendly hostname from a URL string
 */
export function getDisplayUrl(url: string | null | undefined): string {
  if (!url?.trim()) return '';
  
  try {
    const formattedUrl = formatWebsiteUrl(url);
    if (!formattedUrl) return url.trim(); // Fallback to original if formatting fails
    
    const urlObject = new URL(formattedUrl);
    // Remove 'www.' prefix if present
    return urlObject.hostname.replace(/^www\./, '');
  } catch (error) {
    console.error('Error parsing URL:', url, error);
    return url.trim(); // Fallback to original string if parsing fails
  }
}
