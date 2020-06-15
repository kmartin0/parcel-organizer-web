import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {EMPTY, Observable, throwError} from 'rxjs';
import {catchError, switchMap} from 'rxjs/operators';
import {ErrorDialogComponent} from '../shared/components/dialogs/error-dialog/error-dialog.component';
import {isApiErrorBody} from '../shared/models/api-error-body';
import {ApiErrorEnum} from './api-error.enum';
import {UserService} from '../shared/services/user.service';
import {UserAuthDialogComponent} from '../shared/components/dialogs/user-auth-dialog/user-auth-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {OAUTH} from './api-endpoints';

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
        case ApiErrorEnum.invalid_token:
        case ApiErrorEnum.invalid_grant: { // Authentication Error
          if (httpErrorResponse.url !== OAUTH) { // Global error interceptor does not handle direct calls to the authentication endpoint.
            if (apiError.error_description.startsWith('Access token expired')) { // Refresh the access token if it's expired.
              return this.refreshToken(req, next);
            } else { // Retry login for all other authentication errors.
              return this.retryLogin(req, next);
            }
          }
          break;
        }
      }
    } else if (httpErrorResponse.status == 0) { // The server couldn't be reached.
      const unableToReachServerError = this.dialog.open(ErrorDialogComponent, {
        data: {message: 'The server couldn\'t be reached, please check your internet connection or try again later.'},
        panelClass: 'app-dialog'
      });
    }

    return throwError(httpErrorResponse.error);
  };

  private refreshToken(req, next) {
    return this.userService.refreshAuthToken().pipe(
      switchMap(credentials => {
        return next.handle(req) as Observable<HttpEvent<any>>;
      }),
      catchError(err => {
        return this.retryLogin(req, next); // If the token can't be refreshed then prompt the user to login again.
      })
    );
  }

  private retryLogin(req, next) {
    const loginDialog = this.dialog.open(UserAuthDialogComponent, {
      data: {message: 'Authentication failed, please login again.'},
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
