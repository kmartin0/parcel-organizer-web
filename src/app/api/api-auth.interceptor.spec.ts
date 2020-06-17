import {ApiAuthInterceptor} from './api-auth.interceptor';
import {UserService} from '../shared/services/user.service';
import {HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
import {Oauth2Credentials} from '../shared/models/oauth2-credentials';
import * as endpoints from './api-endpoints';
import {shouldBearerTokenAuth} from './api-endpoints';
import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

describe('ApiAuthInterceptor', () => {

  let userServiceSpy = jasmine.createSpyObj<UserService>('UserService', ['getLoggedInUserOAuth2']);

  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {provide: UserService, useValue: userServiceSpy},
        {provide: HTTP_INTERCEPTORS, useClass: ApiAuthInterceptor, multi: true}
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
      req => !req.headers.has('Authorization')
    );

    // Assert that the request is a GET.
    expect(req.request.method).toEqual('GET');

    // Let the Observable resolve.
    req.flush({});
  });

  it('should add user access token as Authorization Bearer header', () => {
    const oauth2stub = new class implements Oauth2Credentials {
      access_token: string = 'ey12f432';
      expires_in: string = '1243568';
      jti: string = '1516239022';
      refresh_token: string = '123am67ee';
      scope: string = 'all';
      token_type: string = 'bearer';
    };

    userServiceSpy.getLoggedInUserOAuth2.and.returnValue(oauth2stub);
    spyOn(endpoints, 'shouldBearerTokenAuth').and.returnValue(true);

    httpClient.get('/test-url').subscribe(() => {
    });

    // Verify that the api request contains the authorization header with the access token.
    const req = httpTestingController.expectOne(
      req => req.headers.has('Authorization') && req.headers.get('Authorization') === 'ey12f432'
    );

    // Assert that the request is a GET.
    expect(req.request.method).toEqual('GET');

    // Let the Observable resolve.
    req.flush({});
  });

  it('should add client authentication token as Authorization Basic header', (done) => {
    spyOn(endpoints, 'shouldBasicAuth').and.returnValue(true);

    httpClient.get('/test-url').subscribe(() => {
      done();
    });

    // Verify that the api request contains the authorization header with the access token.
    const req = httpTestingController.expectOne(
      req => req.headers.has('Authorization') && req.headers.get('Authorization').startsWith('Basic ')
    );

    // Assert that the request is a GET.
    expect(req.request.method).toEqual('GET');

    // Let the Observable resolve.
    req.flush({});
  });

});
