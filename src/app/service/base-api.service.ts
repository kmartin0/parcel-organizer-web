import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {ApiErrorBody} from '../model/api-error-body';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BaseApiService {

  constructor(private http: HttpClient) {
  }

  makePost<T>(url: string, body: T): Observable<T> {
    return this.http.post<T>(BASE_API_URL + url, body).pipe(catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error of instance ErrorEvent occurred:', error.error.message);
    } else if (error.error) {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      let errorBody: ApiErrorBody = {
        error: error.error.error,
        description: error.error.description,
        code: error.error.code,
        details: error.error.details
      };
      console.log('errorBody thrown', errorBody);

      return throwError(errorBody);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }
}

export const BASE_API_URL = 'https://parcel-organizer-api.herokuapp.com/';
// export const BASE_API_URL = 'http://localhost:8080/';
