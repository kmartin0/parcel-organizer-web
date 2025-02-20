import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BASE_PARCEL_URL, BASE_USER_URL, CHANGE_PASSWORD, OAUTH} from '../../../api/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {
  }

  makePost<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(url, body);
  }

  makePostFormUrlEncoded<T>(url: string, body: HttpParams): Observable<T> {
    const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    return this.http.post<T>(url, body ? body.toString() : null, {headers});
  }

  makeGet<T>(url: string): Observable<T> {
    return this.http.get<T>(url);
  }

  makeDelete(url: string): Observable<any> {
    return this.http.delete(url);
  }

  makePut<T>(url: string, body: any): Observable<T> {
    return this.http.put<T>(url, body);
  }

  shouldBasicAuth(url: string, method: string): boolean {
    switch (method) {
      case 'POST': {
        return url.startsWith(OAUTH);
      }
      default:
        return false;
    }
  }

  shouldBearerTokenAuth(url: string, method: string): boolean {
    switch (method) {
      case 'GET': {
        return url.startsWith(BASE_USER_URL) || url.startsWith(BASE_PARCEL_URL);
      }
      case 'POST': {
        return url.startsWith(CHANGE_PASSWORD) || url.startsWith(BASE_PARCEL_URL);
      }
      case 'PUT': {
        return url.startsWith(BASE_USER_URL) || url.startsWith(BASE_PARCEL_URL);
      }
      case 'DELETE': {
        return url.startsWith(BASE_USER_URL) || url.startsWith(BASE_PARCEL_URL);
      }
      default:
        return false;
    }
  }

}
