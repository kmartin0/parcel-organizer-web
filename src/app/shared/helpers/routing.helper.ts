import {ActivatedRouteSnapshot} from '@angular/router';

/**
 * Recursive function to find a title in an activated route or it's children.
 *
 * @param activatedRouteSnapshot
 */
export function getActivatedRouteTitle(activatedRouteSnapshot: ActivatedRouteSnapshot): string {
  if (!activatedRouteSnapshot) {
    return '';
  }

  if (activatedRouteSnapshot.data.title) {
    return activatedRouteSnapshot.data.title;
  }

  return getActivatedRouteTitle(activatedRouteSnapshot.firstChild);
}
