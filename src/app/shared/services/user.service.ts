import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {BaseApiService} from './base-api.service';
import {User} from '../models/user';
import {GET_USER, LOGIN, SAVE_USER} from '../../api/api-endpoints';
import {HttpParams} from '@angular/common/http';
import {map, mergeMap, tap} from 'rxjs/operators';
import {Oauth2Credentials} from '../models/oauth2-credentials';
import {HOME} from '../constants/endpoints';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private baseApiService: BaseApiService, private router: Router) {
  }

  registerUser(user: User): Observable<User> {
    return this.baseApiService.makePost(SAVE_USER, user);
  }

  loginUser(email: string, password: string) {
    return this.authenticateUser(email, password).pipe(
      mergeMap((credentials) => {
        credentials.access_token = `Bearer ${credentials.access_token}`;
        this.persistUser({oauth2Credentials: credentials});
        return this.getUser(credentials);
      })
    );
  }

  refreshAuthToken(): Observable<Oauth2Credentials> {
    const refreshToken = this.getLoggedInUser().oauth2Credentials.refresh_token;
    const body = new HttpParams()
      .set('grant_type', 'refresh_token')
      .set('refresh_token', refreshToken + 'hello');

    return this.baseApiService.makePostFormUrlEncoded<Oauth2Credentials>(LOGIN, body).pipe(
      tap(credentials => {
        const user = this.getLoggedInUser();
        credentials.access_token = `Bearer ${credentials.access_token}`;
        user.oauth2Credentials = credentials;
        this.persistUser(user);
      })
    );
  }

  logoutUser() {
    localStorage.removeItem('user');
    this.router.navigate([HOME]);
  }

  isUserLoggedIn(): boolean {
    return localStorage.getItem('user') != null;
  }

  getLoggedInUser(): User {
    return JSON.parse(localStorage.getItem('user'));
  }

  private authenticateUser(email: string, password: string) {
    const body = new HttpParams()
      .set('grant_type', 'password')
      .set('username', email)
      .set('password', password);

    return this.baseApiService.makePostFormUrlEncoded<Oauth2Credentials>(LOGIN, body);
  }

  private getUser(credentials: Oauth2Credentials) {
    return this.baseApiService.makeGet<User>(GET_USER).pipe(
      map(result => {
        const user: User = {
          id: result.id,
          email: result.email,
          name: result.name,
          oauth2Credentials: credentials
        };
        this.persistUser(user);
        return user;
      })
    );
  }

  private persistUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  }

}


