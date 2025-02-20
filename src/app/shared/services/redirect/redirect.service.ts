import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RedirectService {

  private _redirect: string | null = null;

  set redirect(value: string) {
    this._redirect = value;
  }

  consume(): string | null {
    const tmpRedirect = this._redirect;
    this._redirect = null;
    return tmpRedirect;
  }

  constructor() {
  }
}
