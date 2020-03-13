// Prefixes the url with http:// if it doesn't have it already
export function prefixUrl(url: string): string {
  if (url && url.startsWith('http://') && url.startsWith('http://')) {
    return url;
  } else {
    return 'http://' + url
  }
}
