import {RedirectService} from './redirect.service';

describe('RedirectService', () => {

  let redirectService: RedirectService;

  beforeEach(() => {
    redirectService = new RedirectService();
  });

  it('should return redirect and set it to null', () => {
    // Given
    redirectService.redirect = '/redirect-here'

    // When Then
    expect(redirectService.consume()).toEqual('/redirect-here');
    expect(redirectService.consume()).toBeNull();
  });

});
