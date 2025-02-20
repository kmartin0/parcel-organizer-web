import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserService} from '../shared/services/user/user.service';
import {Oauth2Credentials} from '../shared/models/oauth2-credentials';
import {environment} from '../../environments/environment';
import {ApiService} from '../shared/services/api/api.service';

@Injectable()
export class ApiAuthInterceptor implements HttpInterceptor {

  constructor(private userService: UserService, private apiService: ApiService ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let url = req.url;
    let method = req.method;
    if (this.apiService.shouldBasicAuth(url, method)) {
      const authReq = req.clone({
        headers: req.headers.set(
          'Authorization', 'Basic ' + btoa(`${environment.parcelOrganizerClientId}:${environment.parcelOrganizerClientSecret}`)
        )
      });

      return next.handle(authReq);
    } else if (this.apiService.shouldBearerTokenAuth(url, method)) {
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

