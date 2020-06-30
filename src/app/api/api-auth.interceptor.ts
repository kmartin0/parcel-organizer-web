import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {shouldBasicAuth, shouldBearerTokenAuth} from './api-endpoints';
import {UserService} from '../shared/services/user/user.service';
import {Oauth2Credentials} from '../shared/models/oauth2-credentials';

@Injectable()
export class ApiAuthInterceptor implements HttpInterceptor {

  constructor(private userService: UserService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let url = req.url;
    let method = req.method;
    if (shouldBasicAuth(url, method)) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', 'Basic ' + btoa('parcel-organizer-web:secret'))
      });

      return next.handle(authReq);
    } else if (shouldBearerTokenAuth(url, method)) {
      const credentials: Oauth2Credentials = this.userService.getLoggedInUserOAuth2();
      if (credentials != null) {
        const authReq = req.clone({
          headers: req.headers.set('Authorization', credentials.access_token)
        });

        return next.handle(authReq);
      }
    }

    return next.handle(req);
  }
}

