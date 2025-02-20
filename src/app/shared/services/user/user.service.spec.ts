import {STORAGE_OAUTH2_CREDENTIALS_KEY, UserService} from './user.service';
import {ApiService} from '../api/api.service';
import {Router} from '@angular/router';
import {User} from '../../models/user';
import {CHANGE_PASSWORD, GET_USER, OAUTH, SAVE_USER, UPDATE_USER} from '../../../api/api-endpoints';
import {of} from 'rxjs';
import {UserAuthentication} from '../../models/user-authentication';
import {HttpParams} from '@angular/common/http';
import {Oauth2Credentials} from '../../models/oauth2-credentials';
import {ChangePassword} from '../../models/change-password';
import {HOME} from '../../constants/endpoints';

describe('UserService', () => {

  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let userService: UserService;

  beforeEach(() => {
    apiServiceSpy = jasmine.createSpyObj('ApiService', ['makePost', 'makePostFormUrlEncoded', 'makePut', 'makeGet']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    userService = new UserService(apiServiceSpy, routerSpy);
  });

  it('should register user using api', (done) => {
    // Given
    const user: User = {
      id: '0',
      email: 'xyz@gmail.com',
      name: 'xyz',
      password: '1234'
    };

    apiServiceSpy.makePost.withArgs(SAVE_USER, user).and.returnValue(of(user));

    // When
    userService.registerUser(user).subscribe(value => {
      expect(value).toEqual(user);
      done();
    }, fail);
  });

  it('should login user using api', (done) => {
    // Given
    const userAuthentication: UserAuthentication = {
      password: '1234',
      email: 'xyz@gmail.com'
    };

    const expectedOauthBody = new HttpParams()
      .set('grant_type', 'password')
      .set('username', userAuthentication.email ?? '')
      .set('password', userAuthentication.password ?? '');

    const oauth2Credentials: Oauth2Credentials = {
      access_token: 'ey123mgf',
      expires_in: '20000',
      jti: '1234-1223',
      refresh_token: 'eyk350',
      scope: 'all',
      token_type: 'bearer'
    };

    apiServiceSpy.makePostFormUrlEncoded.withArgs(OAUTH, expectedOauthBody).and.returnValue(of(oauth2Credentials));
    spyOn(userService, 'persistOAuth2Credentials').withArgs(oauth2Credentials);

    // When
    userService.loginUser(userAuthentication).subscribe(value => {
      // Then
      expect(value).toEqual(oauth2Credentials);
      done();
    }, fail);

    expect(userService.persistOAuth2Credentials).toHaveBeenCalledTimes(1);
    expect(userService.persistOAuth2Credentials).toHaveBeenCalledWith(oauth2Credentials);
  });

  it('should refresh authentication credentials using api', (done) => {
    // Given
    const oauth2Credentials: Oauth2Credentials = {
      access_token: 'ey123mgf',
      expires_in: '20000',
      jti: '1234-1223',
      refresh_token: 'eyk350',
      scope: 'all',
      token_type: 'bearer'
    };

    const expectedBody = new HttpParams()
      .set('grant_type', 'refresh_token')
      .set('refresh_token', oauth2Credentials.refresh_token);

    apiServiceSpy.makePostFormUrlEncoded.withArgs(OAUTH, expectedBody).and.returnValue(of(oauth2Credentials));
    spyOn(userService, 'getLoggedInUserOAuth2').and.returnValue(oauth2Credentials);
    spyOn(userService, 'persistOAuth2Credentials').withArgs(oauth2Credentials);

    // When
    userService.refreshAuthToken().subscribe(value => {
      expect(value).toEqual(oauth2Credentials);
      done();
    }, fail);

    expect(userService.persistOAuth2Credentials).toHaveBeenCalledTimes(1);
    expect(userService.persistOAuth2Credentials).toHaveBeenCalledWith(oauth2Credentials);
  });

  it('should update user using api', (done) => {
    // Given
    const user: User = {
      id: '0',
      email: 'xyz@gmail.com',
      name: 'xyz',
      password: '1234'
    };

    const userAuthentication: UserAuthentication = {
      email: user.email,
      password: user.password
    };

    const oauth2Credentials: Oauth2Credentials = {
      access_token: 'ey123mgf',
      expires_in: '20000',
      jti: '1234-1223',
      refresh_token: 'eyk350',
      scope: 'all',
      token_type: 'bearer'
    };

    apiServiceSpy.makePut.withArgs(UPDATE_USER, user).and.returnValue(of(user));
    spyOn(userService, 'authenticateUser').and.returnValue(of(oauth2Credentials));
    spyOn(userService, 'persistOAuth2Credentials');

    // When
    userService.updateUser(user).subscribe(value => {
      expect(value).toEqual(user);
      done();
    }, fail);

    expect(userService.authenticateUser).toHaveBeenCalledTimes(1);
    expect(userService.authenticateUser).toHaveBeenCalledWith(userAuthentication);

    expect(userService.persistOAuth2Credentials).toHaveBeenCalledTimes(1);
    expect(userService.persistOAuth2Credentials).toHaveBeenCalledWith(oauth2Credentials);
  });

  it('should change password using api', (done) => {
    // Given
    const changePassword: ChangePassword = {
      confirmPassword: '1234',
      currentPassword: '12',
      newPassword: '1234'
    };

    apiServiceSpy.makePost.withArgs(CHANGE_PASSWORD, changePassword).and.returnValue(of({}));

    // When
    userService.changePassword(changePassword).subscribe(value => {
      expect(value).toEqual({});
      done();
    }, fail);
  });

  it('should get logged in user details from api', (done) => {
    // Given
    const user: User = {
      id: '0',
      email: 'xyz@gmail.com',
      name: 'xyz',
    };

    apiServiceSpy.makeGet.withArgs(GET_USER).and.returnValue(of(user));

    // When
    userService.getLoggedInUser().subscribe(value => {
      expect(value).toEqual(user);
      done();
    }, fail);
  });

  it('should remove user from local storage and navigate to home', () => {
    // Given
    spyOn(localStorage, 'removeItem');

    // When
    userService.logoutUser();

    // Then
    expect(localStorage.removeItem).toHaveBeenCalledTimes(1);
    expect(localStorage.removeItem).toHaveBeenCalledWith(STORAGE_OAUTH2_CREDENTIALS_KEY);

    expect(routerSpy.navigate).toHaveBeenCalledTimes(1);
    expect(routerSpy.navigate).toHaveBeenCalledWith([HOME]);
  });

  it('should return true when user in local storage', () => {
    // Given
    const oauth2Credentials: Oauth2Credentials = {
      access_token: 'ey123mgf',
      expires_in: '20000',
      jti: '1234-1223',
      refresh_token: 'eyk350',
      scope: 'all',
      token_type: 'bearer'
    };

    spyOn(localStorage, 'getItem').withArgs(STORAGE_OAUTH2_CREDENTIALS_KEY).and.returnValue(JSON.stringify(oauth2Credentials));

    // When Then
    expect(userService.isUserLoggedIn()).toBeTrue();
  });

  it('should return false when user not in local storage', () => {
    // Given
    const oauth2Credentials: Oauth2Credentials = {
      access_token: 'ey123mgf',
      expires_in: '20000',
      jti: '1234-1223',
      refresh_token: 'eyk350',
      scope: 'all',
      token_type: 'bearer'
    };

    spyOn(localStorage, 'getItem').withArgs(STORAGE_OAUTH2_CREDENTIALS_KEY).and.returnValue(null);

    // When Then
    expect(userService.isUserLoggedIn()).toBeFalse();
  });

  it('should return oauth2 credentials from local storage', () => {
    // Given
    const oauth2Credentials: Oauth2Credentials = {
      access_token: 'ey123mgf',
      expires_in: '20000',
      jti: '1234-1223',
      refresh_token: 'eyk350',
      scope: 'all',
      token_type: 'bearer'
    };

    spyOn(localStorage, 'getItem').withArgs(STORAGE_OAUTH2_CREDENTIALS_KEY).and.returnValue(JSON.stringify(oauth2Credentials));

    // When Then
    expect(userService.getLoggedInUserOAuth2()).toEqual(oauth2Credentials);
  });

  it('should authenticate user using api', (done) => {
    // Given
    const userAuthentication: UserAuthentication = {
      email: 'xyz@gmail.com',
      password: '1234'
    };

    const oauth2Credentials: Oauth2Credentials = {
      access_token: 'ey123mgf',
      expires_in: '20000',
      jti: '1234-1223',
      refresh_token: 'eyk350',
      scope: 'all',
      token_type: 'bearer'
    };

    const expectedBody = new HttpParams()
      .set('grant_type', 'password')
      .set('username', userAuthentication.email ?? '')
      .set('password', userAuthentication.password ?? '');

    apiServiceSpy.makePostFormUrlEncoded.withArgs(OAUTH, expectedBody).and.returnValue(of(oauth2Credentials));

    // When
    userService.authenticateUser(userAuthentication).subscribe(value => {
      expect(value).toEqual(oauth2Credentials);
      done();
    }, fail);
  });

  it('should persist oauth2 credential in local storage and prefix with Bearer', () => {
    // Given
    const oauth2Credentials: Oauth2Credentials = {
      access_token: 'ey123mgf',
      expires_in: '20000',
      jti: '1234-1223',
      refresh_token: 'eyk350',
      scope: 'all',
      token_type: 'bearer'
    };

    const expected: Oauth2Credentials = {
      access_token: 'Bearer ey123mgf',
      expires_in: '20000',
      jti: '1234-1223',
      refresh_token: 'eyk350',
      scope: 'all',
      token_type: 'bearer'
    };

    spyOn(localStorage, 'setItem');

    // When
    userService.persistOAuth2Credentials(oauth2Credentials);

    // Then
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith(STORAGE_OAUTH2_CREDENTIALS_KEY, JSON.stringify(expected));
  });

  it('should persist oauth2 credential in local storage and don\'t prefix with bearer when already prefixed', () => {
    // Given
    const oauth2Credentials: Oauth2Credentials = {
      access_token: 'Bearer ey123mgf',
      expires_in: '20000',
      jti: '1234-1223',
      refresh_token: 'eyk350',
      scope: 'all',
      token_type: 'bearer'
    };

    const expected: Oauth2Credentials = {
      access_token: 'Bearer ey123mgf',
      expires_in: '20000',
      jti: '1234-1223',
      refresh_token: 'eyk350',
      scope: 'all',
      token_type: 'bearer'
    };

    spyOn(localStorage, 'setItem');

    // When
    userService.persistOAuth2Credentials(oauth2Credentials);

    // Then
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith(STORAGE_OAUTH2_CREDENTIALS_KEY, JSON.stringify(expected));
  });

});
