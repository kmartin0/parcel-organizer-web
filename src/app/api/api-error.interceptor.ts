import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {EMPTY, Observable, throwError} from 'rxjs';
import {catchError, switchMap} from 'rxjs/operators';
import {ErrorDialogComponent} from '../shared/dialogs/error-dialog/error-dialog.component';
import {isApiErrorBody} from '../shared/models/api-error-body';
import {ApiErrorEnum} from './api-error.enum';
import {UserService} from '../shared/services/user.service';
import {LoginDialogComponent} from '../shared/dialogs/login-dialog/login-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Injectable()
export class ApiErrorInterceptor implements HttpInterceptor {

  constructor(private dialog: MatDialog, private userService: UserService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(
      catchError(err => {
        return this.handleError(err, req, next);
      })
    );
  }

  handleError = (httpErrorResponse, req, next) => {
    if (isApiErrorBody(httpErrorResponse.error)) {
      const apiError = httpErrorResponse.error;

      switch (apiError.error) {
        case ApiErrorEnum.INTERNAL: { // Internal Server Error
          const internalErrorDialog = this.dialog.open(ErrorDialogComponent, {
            data: {message: 'Oops something went wrong on our end. Please try again later or contact us.'},
            panelClass: 'app-dialog'
          });
          break;
        }
        case ApiErrorEnum.invalid_token: { // Handle access token expired
          if (apiError.error_description.startsWith('Access token expired')) {
            return this.refreshToken(req, next);
          }
          break;
        }
      }
    } else if (httpErrorResponse.error instanceof ProgressEvent) { // The server couldn't be reached.
      const unableToReachServerError = this.dialog.open(ErrorDialogComponent, {
        data: {message: 'The server couldn\'t be reached, please check your internet connection or try again later.'},
        panelClass: 'app-dialog'
      });
    }

    return throwError(httpErrorResponse.error);
  };

  refreshToken(req, next) {
    console.log('refresh token');
    return this.userService.refreshAuthToken().pipe(
      switchMap(credentials => {
        return next.handle(req) as Observable<HttpEvent<any>>;
      }),
      catchError(err => {
        return this.retryLogin(req, next);
      })
    );
  }

  retryLogin(req, next) {
    const loginDialog = this.dialog.open(LoginDialogComponent, {
      data: {message: 'Session expired please login-form again.'},
      panelClass: 'app-dialog'
    });

    return loginDialog.afterClosed().pipe(
      switchMap(success => {
          if (success) {
            return next.handle(req) as Observable<HttpEvent<any>>;
          } else {
            this.userService.logoutUser();
            return EMPTY;
          }
        }
      )
    );
  }
}
