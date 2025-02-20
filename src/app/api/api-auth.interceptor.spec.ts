import {ApiAuthInterceptor} from './api-auth.interceptor';
import {UserService} from '../shared/services/user/user.service';
import {HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {Oauth2Credentials} from '../shared/models/oauth2-credentials';
import {TestBed} from '@angular/core/testing';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {ApiService} from '../shared/services/api/api.service';

describe('ApiAuthInterceptor', () => {

  let userServiceSpy: jasmine.SpyObj<UserService>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    userServiceSpy = jasmine.createSpyObj<UserService>('UserService', ['getLoggedInUserOAuth2']);
    apiServiceSpy = jasmine.createSpyObj<ApiService>('ApiService', ['shouldBasicAuth', 'shouldBearerTokenAuth']);
  });

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        {provide: UserService, useValue: userServiceSpy},
        {provide: ApiService, useValue: apiServiceSpy},
        {provide: HTTP_INTERCEPTORS, useClass: ApiAuthInterceptor, multi: true},
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });

    // Inject the http client and test controller for each test
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('should call next.handle without altering the header', () => {

    httpClient.get('/test-url').subscribe(() => {
    });

    // Verify that the api request contains no authorization header.
    const req = httpTestingController.expectOne(
      _req => !_req.headers.has('Authorization')
    );

    // Assert that the request is a GET.
    expect(req.request.method).toEqual('GET');

    // Let the Observable resolve.
    req.flush({});
  });


  it('should add user access token as Authorization Bearer header', () => {
    /* tslint:disable: variable-name */
    const oauth2stub = new (class implements Oauth2Credentials {
      access_token = 'ey12f432';
      expires_in = '1243568';
      jti = '1516239022';
      refresh_token = '123am67ee';
      scope = 'all';
      token_type = 'bearer';
    })();
    /* tslint:enable: variable-name */
    userServiceSpy.getLoggedInUserOAuth2.and.returnValue(oauth2stub);
    apiServiceSpy.shouldBearerTokenAuth.and.returnValue(true);

    httpClient.get('/test-url').subscribe(() => {
    });

    // Verify that the api request contains the authorization header with the access token.
    const req = httpTestingController.expectOne(
      _req => _req.headers.has('Authorization') && _req.headers.get('Authorization') === 'ey12f432'
    );

    // Assert that the request is a GET.
    expect(req.request.method).toEqual('GET');

    // Let the Observable resolve.
    req.flush({});
  });

  it('should add client authentication token as Authorization Basic header', (done) => {
    apiServiceSpy.shouldBasicAuth.and.returnValue(true);

    httpClient.get('/test-url').subscribe(() => {
      done();
    });

    // Verify that the api request contains the authorization header with the access token.
    const req = httpTestingController.expectOne(
      _req => {
        const authHeader = _req.headers.get('Authorization');
        return authHeader !== null && authHeader.startsWith('Basic ');
      }
    );

    // Assert that the request is a GET.
    expect(req.request.method).toEqual('GET');

    // Let the Observable resolve.
    req.flush({});
  });

});
