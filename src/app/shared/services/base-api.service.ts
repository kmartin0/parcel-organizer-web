import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaseApiService {

  constructor(private http: HttpClient) {
  }

  makePost<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(url, body);
  }

  makePostFormUrlEncoded<T>(url: string, params: HttpParams): Observable<T> {
    const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    return this.http.post<T>(url, params.toString(), {headers});
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

}
