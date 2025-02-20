import {ActivatedRouteSnapshot} from '@angular/router';

/**
 * Recursive function to find a title in an activated route or it's children.
 *
 * @param activatedRouteSnapshot
 */
export function getActivatedRouteTitle(activatedRouteSnapshot: ActivatedRouteSnapshot | null): string {
  if (!activatedRouteSnapshot) {
    return '';
  }

  if (activatedRouteSnapshot.data && activatedRouteSnapshot.data.hasOwnProperty('title') && activatedRouteSnapshot.data['title']) {
    return activatedRouteSnapshot.data['title'];
  }

  return getActivatedRouteTitle(activatedRouteSnapshot.firstChild);
}
