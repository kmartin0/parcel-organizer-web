import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {BaseApiService} from './base-api.service';
import {User} from '../models/user';
import {CHANGE_PASSWORD, GET_USER, OAUTH, SAVE_USER, UPDATE_USER} from '../../api/api-endpoints';
import {HttpParams} from '@angular/common/http';
import {map, switchMap, tap} from 'rxjs/operators';
import {Oauth2Credentials} from '../models/oauth2-credentials';
import {HOME} from '../constants/endpoints';
import {Router} from '@angular/router';
import {ChangePassword} from '../models/change-password';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private STORAGE_OAUTH2_CREDENTIALS_KEY = 'logged_in_user_oauth2';

  constructor(private baseApiService: BaseApiService, private router: Router) {
  }

  registerUser(user: User): Observable<User> {
    return this.baseApiService.makePost(SAVE_USER, user);
  }

  loginUser(email: string, password: string) {
    return this.authenticateUser(email, password).pipe(
      tap(credentials => {
        this.persistOAuth2Credentials(credentials);
      })
    );
  }

  refreshAuthToken(): Observable<Oauth2Credentials> {
    const refreshToken = this.getLoggedInUserOAuth2().refresh_token;
    const body = new HttpParams()
      .set('grant_type', 'refresh_token')
      .set('refresh_token', refreshToken);

    return this.baseApiService.makePostFormUrlEncoded<Oauth2Credentials>(OAUTH, body).pipe(
      tap(credentials => {
        this.persistOAuth2Credentials(credentials);
      })
    );
  }

  updateUser(user: User): Observable<User> {
    return this.baseApiService.makePut<User>(UPDATE_USER, user).pipe(
      switchMap(updatedUser => this.authenticateUser(user.email, user.password).pipe(
        map(credentials => {
          this.persistOAuth2Credentials(credentials);
          return updatedUser;
        })
      ))
    );
  }

  changePassword(changePassword: ChangePassword): Observable<User> {
    return this.baseApiService.makePost<User>(CHANGE_PASSWORD, changePassword);
  }

  private authenticateUser(email: string, password: string) {
    const body = new HttpParams()
      .set('grant_type', 'password')
      .set('username', email)
      .set('password', password);

    return this.baseApiService.makePostFormUrlEncoded<Oauth2Credentials>(OAUTH, body);
  }

  getLoggedInUser(): Observable<User> {
    return this.baseApiService.makeGet<User>(GET_USER).pipe(
      map(result => {
        const user: User = {
          id: result.id,
          email: result.email,
          name: result.name
        };

        return user;
      })
    );
  }

  logoutUser() {
    localStorage.removeItem(this.STORAGE_OAUTH2_CREDENTIALS_KEY);
    this.router.navigate([HOME]);
  }

  isUserLoggedIn(): boolean {
    return localStorage.getItem(this.STORAGE_OAUTH2_CREDENTIALS_KEY) != null;
  }

  getLoggedInUserOAuth2(): Oauth2Credentials {
    return JSON.parse(localStorage.getItem(this.STORAGE_OAUTH2_CREDENTIALS_KEY));
  }

  persistOAuth2Credentials(oauth2Credentials: Oauth2Credentials) {
    if (!oauth2Credentials.access_token.startsWith('Bearer')) {
      oauth2Credentials.access_token = `Bearer ${oauth2Credentials.access_token}`;
    }
    localStorage.setItem(this.STORAGE_OAUTH2_CREDENTIALS_KEY, JSON.stringify(oauth2Credentials));
  }

}


