import {UrlHelperService} from './url.helper.service';

let service: UrlHelperService;

beforeEach(() => {
  service = new UrlHelperService(); // Directly instantiate the service
});

describe('UrlHelper', () => {

  it('should prefix url with https://', () => {
    expect(service.prefixUrl('xyz.com')).toEqual('http://xyz.com');
  });

  it('should return null', () => {
    expect(service.prefixUrl(null)).toEqual(undefined);
  });

  it('should not prefix url starting with http://', () => {
    expect(service.prefixUrl('http://xyz.com')).toEqual('http://xyz.com');
  });

  it('should not prefix url starting with https://', () => {
    expect(service.prefixUrl('https://xyz.com')).toEqual('https://xyz.com');
  });

});
