import {HttpParams, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {ApiService} from './api.service';
import {TestBed} from '@angular/core/testing';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';

describe('ApiService', () => {

  interface ResponseStub {
    message: string,
    code: number
  }

  let httpTestingController: HttpTestingController;
  let apiService: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});

    apiService = TestBed.inject(ApiService);
    httpTestingController = TestBed.inject(HttpTestingController);

  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('should make a post request', (done) => {
    // Given
    const url = '10.0.0.1/test';
    const body = {name: 'john', surname: 'Doe'};
    const response: ResponseStub = {message: 'success', code: 200};

    apiService.makePost<ResponseStub>(url, body).subscribe(value => {
      expect(value).toEqual(response);
      done();
    }, fail);

    // Assert that the request was made
    const req = httpTestingController.expectOne(url);

    // Assert that the request is a POST.
    expect(req.request.method).toEqual('POST');

    // Let the request resolve.
    req.flush(response);
  });

  it('should make a post form url encoded request', (done) => {
    // Given
    const url = '10.0.0.1/test';
    const body = new HttpParams().set('name', 'John').set('surname', 'Doe');
    const response: ResponseStub = {message: 'success', code: 200};

    apiService.makePostFormUrlEncoded<ResponseStub>(url, body).subscribe(value => {
      expect(value).toEqual(response);
      done();
    }, fail);

    // Assert the request was made
    const req = httpTestingController.expectOne(req =>
      req.url === url &&
      req.body === body.toString() &&
      req.headers.has('Content-type') && req.headers.get('Content-type') === 'application/x-www-form-urlencoded'
    );

    // Assert that the request is a POST.
    expect(req.request.method).toEqual('POST');

    // Let the request resolve.
    req.flush(response);
  });

  it('should make a post form url encoded request without body', (done) => {
    // Given
    const url = '10.0.0.1/test';
    const response: ResponseStub = {message: 'success', code: 200};

    apiService.makePostFormUrlEncoded<ResponseStub>(url, new HttpParams()).subscribe(value => {
      expect(value).toEqual(response);
      done();
    }, fail);

    // Assert the request was made
    const req = httpTestingController.expectOne(req =>
      req.url === url &&
      req.body === "" &&
      req.headers.has('Content-type') && req.headers.get('Content-type') === 'application/x-www-form-urlencoded'
    );

    // Assert that the request is a POST.
    expect(req.request.method).toEqual('POST');

    // Let the request resolve.
    req.flush(response);
  });

  it('should make a get request', (done) => {
    // Given
    const url = '10.0.0.1/test';
    const response: ResponseStub = {message: 'success', code: 200};

    apiService.makeGet<ResponseStub>(url).subscribe(value => {
      expect(value).toEqual(response);
      done();
    }, fail);

    // Assert that the request was made
    const req = httpTestingController.expectOne(url);

    // Assert that the request is a POST.
    expect(req.request.method).toEqual('GET');

    // Let the request resolve.
    req.flush(response);
  });

  it('should make a delete request', (done) => {
    // Given
    const url = '10.0.0.1/test';

    apiService.makeDelete(url).subscribe(value => {
      expect(value).toEqual({});
      done();
    }, fail);

    // Assert that the request was made
    const req = httpTestingController.expectOne(url);

    // Assert that the request is a POST.
    expect(req.request.method).toEqual('DELETE');

    // Let the request resolve.
    req.flush({});
  });

  it('should make a put request', (done) => {
    // Given
    const url = '10.0.0.1/test';
    const body = {name: 'john', surname: 'Doe'};
    const response: ResponseStub = {message: 'success', code: 200};

    apiService.makePut<ResponseStub>(url, body).subscribe(value => {
      expect(value).toEqual(response);
      done();
    }, fail);

    // Assert that the request was made
    const req = httpTestingController.expectOne(url);

    // Assert that the request is a POST.
    expect(req.request.method).toEqual('PUT');

    // Let the request resolve.
    req.flush(response);
  });

});
