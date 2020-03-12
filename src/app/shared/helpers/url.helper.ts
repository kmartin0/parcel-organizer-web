// Prefixes the url with http:// if it doesn't have it already
export function prefixUrl(url: string): string {
  return !url && !(url.startsWith('http://') || url.startsWith('https://')) ? 'http://' + url : url;
}
