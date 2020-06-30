import {prefixUrl} from './url.helper';

describe('UrlHelper', () => {

  it('should prefix url with https://', () => {
    expect(prefixUrl('xyz.com')).toEqual('http://xyz.com');
  });

  it('should return null', () => {
    expect(prefixUrl(null)).toEqual(null);
  });

  it('should not prefix url starting with http://', () => {
    expect(prefixUrl('http://xyz.com')).toEqual('http://xyz.com');
  });

  it('should not prefix url starting with https://', () => {
    expect(prefixUrl('https://xyz.com')).toEqual('https://xyz.com');
  });

});
