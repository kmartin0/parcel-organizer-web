import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RedirectService {

  private _redirect: string;

  get redirect(): string {
    const tmpRedirect = this._redirect;
    this._redirect = null;
    return tmpRedirect;
  }

  set redirect(value: string) {
    this._redirect = value;
  }

  constructor() { }
}
