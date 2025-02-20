import {HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {TestBed, waitForAsync} from '@angular/core/testing';
import {ApiErrorInterceptor} from './api-error.interceptor';
import {ApiErrorBody} from '../shared/models/api-error-body';
import {ApiErrorEnum} from './api-error.enum';
import {UserService} from '../shared/services/user/user.service';
import {MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {ErrorDialogComponent} from '../shared/components/dialogs/error-dialog/error-dialog.component';
import {Oauth2Credentials} from '../shared/models/oauth2-credentials';
import {Observable, of} from 'rxjs';
import {UserAuthDialogComponent} from '../shared/components/dialogs/user-auth-dialog/user-auth-dialog.component';

describe('ApiErrorInterceptor', () => {

  let userServiceSpy: jasmine.SpyObj<UserService>;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let testUrl = '/test-url';

  beforeEach(() => {
    // Initialize spies
    userServiceSpy = jasmine.createSpyObj<UserService>('UserService', ['refreshAuthToken', 'logoutUser']);
    matDialogSpy = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
  });

  beforeEach(waitForAsync(() => {
    // Initialize testing module
    TestBed.configureTestingModule({
    imports: [MatDialogModule],
    providers: [
        { provide: MatDialog, useValue: matDialogSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: HTTP_INTERCEPTORS, useClass: ApiErrorInterceptor, multi: true },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});

    // Inject the http client and test controller for each test
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('should open ErrorDialogComponent when the server responds with an internal server error.', () => {
    httpClient.get(testUrl).subscribe(data => {
    }, (error: HttpErrorResponse) => {
    });

    // Get the request.
    const req = httpTestingController.expectOne(testUrl);

    // Resolve the request with an internal server error.
    const apiErrorBody: ApiErrorBody = {
      code: 500,
      description: 'An internal error occurred.',
      error: ApiErrorEnum.INTERNAL,
    };

    req.flush(apiErrorBody, {status: 500, statusText: ''});

    // Validate that the ErrorDialogComponent is opened.
    expect(matDialogSpy.open).toHaveBeenCalledTimes(1);
    expect(matDialogSpy.open).toHaveBeenCalledWith(ErrorDialogComponent, jasmine.any(Object));
  });

  it('should refresh expired access token and try again.', () => {
    const refreshUrl = '/refresh';

    const responseBody = {data: 'Personal Data'};

    // Create the access token expired error body.
    const accessExpiredErrorBody: ApiErrorBody = {
      code: 401,
      error: ApiErrorEnum.invalid_token,
      error_description: 'Access token expired'
    };

    // Create the mock response for refresh token request.
    const refreshTokenResult = new Observable<Oauth2Credentials>(subscriber => {
      subscriber.next({expires_in: '', jti: '', refresh_token: '', scope: '', token_type: '', access_token: ''});
      subscriber.complete();
    });

    // Setup user service refreshAuthToken method to return a mock http request.
    const refreshReq = httpClient.get<Oauth2Credentials>(refreshUrl);
    userServiceSpy.refreshAuthToken.and.returnValue(refreshReq);

    // Make the get request.
    httpClient.get(testUrl).subscribe(data => {
      expect(data).toEqual(responseBody); // Verify the data equals the mock data.
    }, (error: HttpErrorResponse) => {
    });

    // Get the request.
    const req = httpTestingController.expectOne(testUrl);

    // Resolve the request to return access token expired.
    req.flush(accessExpiredErrorBody, {status: 401, statusText: ''});

    // Verify an outstanding refresh token http request is present
    const refreshRequest = httpTestingController.expectOne(refreshUrl);

    // Resolve the refresh token request.
    refreshRequest.flush(refreshTokenResult);

    // Verify the refresh auth token method is called once.
    expect(userServiceSpy.refreshAuthToken).toHaveBeenCalledTimes(1);

    // Verify the request is called again. And resolve it.
    const newRequest = httpTestingController.expectOne(testUrl);
    newRequest.flush(responseBody);

  });

  it('should logout user when refresh token and retry login fails.', () => {
    const refreshUrl = '/refresh';

    // Create the access token expired error body.
    const accessExpiredErrorBody: ApiErrorBody = {
      code: 401,
      error: ApiErrorEnum.invalid_token,
      error_description: 'Access token expired'
    };

    // Setup user service refreshAuthToken method to return a mock http request.
    const refreshReq = httpClient.get<Oauth2Credentials>(refreshUrl);
    userServiceSpy.refreshAuthToken.and.returnValue(refreshReq);

    // Setup retry login dialog.
    const loginDialogRefSpy = jasmine.createSpyObj<MatDialogRef<any>>(['afterClosed']);
    matDialogSpy.open.and.returnValue(loginDialogRefSpy);
    loginDialogRefSpy.afterClosed.and.returnValue(of(false));

    // Make the get request.
    httpClient.get(testUrl).subscribe(data => {
    });

    // Get the request.
    const req = httpTestingController.expectOne(testUrl);

    // Resolve the request to return access token expired.
    req.flush(accessExpiredErrorBody, {status: 401, statusText: ''});

    // Verify an outstanding refresh token http request is present
    const refreshRequest = httpTestingController.expectOne(refreshUrl);

    // Resolve the refresh token request.
    refreshRequest.flush({}, {status: 401, statusText: 'Error while refreshing token.'});

    // Verify the logoutUser method is called.
    expect(userServiceSpy.logoutUser).toHaveBeenCalledTimes(1);

  });

  it('should retry login and try again if authorization error that is not access token expired.', () => {
    const loginDialogRefSpy = jasmine.createSpyObj<MatDialogRef<any>>(['afterClosed']);

    matDialogSpy.open.and.returnValue(loginDialogRefSpy);
    loginDialogRefSpy.afterClosed.and.returnValue(of(true));

    const responseBody = {data: 'Personal Data'};

    // Create the access token expired error body.
    const accessExpiredErrorBody: ApiErrorBody = {
      code: 403,
      error: ApiErrorEnum.invalid_grant,
      error_description: 'Refresh token expired'
    };

    httpClient.get(testUrl).subscribe(value => {
      expect(value).toEqual(responseBody);
    });

    const req = httpTestingController.expectOne(testUrl);

    req.flush(accessExpiredErrorBody, {status: 403, statusText: ''});

    // Verify the UserAuthDialogComponent has been opened.
    expect(matDialogSpy.open).toHaveBeenCalledTimes(1);
    expect(matDialogSpy.open).toHaveBeenCalledWith(UserAuthDialogComponent, jasmine.any(Object));
    expect(loginDialogRefSpy.afterClosed).toHaveBeenCalledTimes(1);

    // Verify that the request has been retried.
    const retryReq = httpTestingController.expectOne(testUrl);
    retryReq.flush(responseBody);

  });

  it('should open unableToReachServerError when the api can\'t be reached.', () => {
    httpClient.get(testUrl).subscribe(value => {
    }, error => {
    });

    const req = httpTestingController.expectOne(testUrl);

    req.flush({}, {status: 0, statusText: ''});

    // Verify the UserAuthDialogComponent has been opened.
    expect(matDialogSpy.open).toHaveBeenCalledTimes(1);
    expect(matDialogSpy.open).toHaveBeenCalledWith(ErrorDialogComponent, jasmine.any(Object));

  });

});
