import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlHelperService {

  // Prefixes the url with http:// if it doesn't have it already
  prefixUrl(url: string | null | undefined): string | undefined {
    if (!url) {
      return undefined;
    }

    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    return 'http://' + url;
  }

}
