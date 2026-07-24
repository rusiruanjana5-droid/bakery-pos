// Helper function to sanitize image URL
export function sanitizeImageUrl(url: string | null | undefined): string | null {
  if (!url || typeof url !== 'string') {
    return null
  }

  const trimmedUrl = url.trim()

  // Check if it's already a valid data URI
  if (trimmedUrl.startsWith('data:image/')) {
    return trimmedUrl
  }

  // Check if it's a valid HTTP/HTTPS URL
  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
    return trimmedUrl
  }

  // Check if it's a relative path
  if (trimmedUrl.startsWith('/')) {
    return trimmedUrl
  }

  // Check if it's a raw Base64 string (no prefix)
  // Base64 strings are alphanumeric with +/ and = padding
  const base64Pattern = /^[A-Za-z0-9+/]+=*$/
  if (base64Pattern.test(trimmedUrl) && trimmedUrl.length > 10) {
    return `data:image/png;base64,${trimmedUrl}`
  }

  // Invalid URL
  return null
}
