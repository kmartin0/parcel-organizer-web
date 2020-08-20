import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiService} from '../api/api.service';
import {User} from '../../models/user';
import {CHANGE_PASSWORD, FORGOT_PASSWORD, GET_USER, OAUTH, SAVE_USER, UPDATE_USER} from '../../../api/api-endpoints';
import {HttpParams} from '@angular/common/http';
import {map, switchMap, tap} from 'rxjs/operators';
import {Oauth2Credentials} from '../../models/oauth2-credentials';
import {HOME} from '../../constants/endpoints';
import {Router} from '@angular/router';
import {ChangePassword} from '../../models/change-password';
import {UserAuthentication} from '../../models/user-authentication';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private apiService: ApiService, private router: Router) {
  }

  registerUser(user: User): Observable<User> {
    return this.apiService.makePost(SAVE_USER, user);
  }

  loginUser(userAuthentication: UserAuthentication): Observable<Oauth2Credentials> {
    return this.authenticateUser(userAuthentication).pipe(
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

    return this.apiService.makePostFormUrlEncoded<Oauth2Credentials>(OAUTH, body).pipe(
      tap(credentials => {
        this.persistOAuth2Credentials(credentials);
      })
    );
  }

  updateUser(user: User): Observable<User> {
    return this.apiService.makePut<User>(UPDATE_USER, user).pipe(
      switchMap(updatedUser => this.authenticateUser({email: user.email, password: user.password}).pipe(
        map(credentials => {
          this.persistOAuth2Credentials(credentials);
          return updatedUser;
        })
      ))
    );
  }

  changePassword(changePassword: ChangePassword): Observable<any> {
    return this.apiService.makePost<User>(CHANGE_PASSWORD, changePassword);
  }

  forgotPassword(email: string): Observable<any> {
    return this.apiService.makePost<any>(FORGOT_PASSWORD, {email: email});
  }

  getLoggedInUser(): Observable<User> {
    return this.apiService.makeGet<User>(GET_USER);
  }

  logoutUser() {
    localStorage.removeItem(STORAGE_OAUTH2_CREDENTIALS_KEY);
    this.router.navigate([HOME]);
  }

  isUserLoggedIn(): boolean {
    return localStorage.getItem(STORAGE_OAUTH2_CREDENTIALS_KEY) != null;
  }

  getLoggedInUserOAuth2(): Oauth2Credentials {
    return JSON.parse(localStorage.getItem(STORAGE_OAUTH2_CREDENTIALS_KEY));
  }

  authenticateUser(userAuthentication: UserAuthentication): Observable<Oauth2Credentials> {
    const body = new HttpParams()
      .set('grant_type', 'password')
      .set('username', userAuthentication.email)
      .set('password', userAuthentication.password);

    return this.apiService.makePostFormUrlEncoded<Oauth2Credentials>(OAUTH, body);
  }

  persistOAuth2Credentials(oauth2Credentials: Oauth2Credentials) {
    if (!oauth2Credentials.access_token.startsWith('Bearer')) {
      oauth2Credentials.access_token = `Bearer ${oauth2Credentials.access_token}`;
    }

    localStorage.setItem(STORAGE_OAUTH2_CREDENTIALS_KEY, JSON.stringify(oauth2Credentials));
  }

}

export const STORAGE_OAUTH2_CREDENTIALS_KEY = 'logged_in_user_oauth2';

