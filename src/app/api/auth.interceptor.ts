import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {shouldBasicAuth, shouldBearerTokenAuth} from './api-endpoints';
import {User} from '../models/user';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let url = req.url;
    let method = req.method;
    console.log(req);
    if (shouldBasicAuth(url, method)) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', 'Basic ' + btoa('parcel-organizer-android:secret'))
      });

      return next.handle(authReq);
    } else if (shouldBearerTokenAuth(url, method)) {
      const user: User = JSON.parse(localStorage.getItem('user'));
      if (user != null && user.oauth2Credentials != null) {
        const authReq = req.clone({
          headers: req.headers.set('Authorization', user.oauth2Credentials.access_token)
        });

        return next.handle(authReq);
      }
    }

    return next.handle(req);
  }
}

