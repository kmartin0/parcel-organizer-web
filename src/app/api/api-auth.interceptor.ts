import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {shouldBasicAuth, shouldBearerTokenAuth} from './api-endpoints';
import {User} from '../shared/models/user';
import {UserService} from '../shared/services/user.service';

@Injectable()
export class ApiAuthInterceptor implements HttpInterceptor {

  constructor(private userService: UserService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let url = req.url;
    let method = req.method;
    if (shouldBasicAuth(url, method)) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', 'Basic ' + btoa('parcel-organizer-android:secret'))
      });

      return next.handle(authReq);
    } else if (shouldBearerTokenAuth(url, method)) {
      const user: User = this.userService.getLoggedInUser();
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

