import {getActivatedRouteTitle} from './routing.helper';
import {ActivatedRouteSnapshot} from '@angular/router';

describe('RoutingHelper', () => {

  it('should return empty string', () => {
    expect(getActivatedRouteTitle(null)).toEqual('');
  });

  it('should return expected title', () => {
    const expectedTitle = 'Title';

    const activatedRouteSnapshot = new ActivatedRouteSnapshot();
    activatedRouteSnapshot.data = {title: expectedTitle};

    expect(getActivatedRouteTitle(activatedRouteSnapshot)).toEqual(expectedTitle);
  });

});
