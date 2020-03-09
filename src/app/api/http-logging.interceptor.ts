import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {MatDialog} from '@angular/material';
import {ErrorDialogComponent} from '../shared/dialogs/error-dialog/error-dialog.component';
import {isApiErrorBody} from '../shared/models/api-error-body';
import {ApiErrorEnum} from './api-error.enum';

@Injectable()
export class HttpLoggingInterceptor implements HttpInterceptor {

  constructor(private dialog: MatDialog) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(catchError(this.handleError));
  }

  handleError = httpErrorResponse => {
    if (isApiErrorBody(httpErrorResponse.error)) {
      const apiError = httpErrorResponse.error;
      if (apiError.error == ApiErrorEnum.INTERNAL) { // Internal Server Error
        const internalErrorDialog = this.dialog.open(ErrorDialogComponent, {
          data: {message: 'Oops something went wrong on our end. Please try again later or contact us.'},
          panelClass: 'app-dialog'
        });
      }
    } else if (httpErrorResponse.error instanceof ProgressEvent) { // The server couldn't be reached.
      const unableToReachServerError = this.dialog.open(ErrorDialogComponent, {
        data: {message: 'The server couldn\'t be reached, please check your internet connection or try again later.'},
        panelClass: 'app-dialog'
      });
    }
    
    return throwError(httpErrorResponse.error);
  };
}
