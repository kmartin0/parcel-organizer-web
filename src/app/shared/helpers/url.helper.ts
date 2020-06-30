// Prefixes the url with http:// if it doesn't have it already
export function prefixUrl(url: string): string {
  if (!url) {
    return url;
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  return 'http://' + url;
}
