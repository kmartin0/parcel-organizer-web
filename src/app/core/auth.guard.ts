import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanMatch, GuardResult, MaybeAsync,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree
} from '@angular/router';
import {Observable} from 'rxjs';
import {UserService} from '../shared/services/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanMatch, CanActivate, CanActivateChild {

  constructor(private userService: UserService, private router: Router) {
  }

  canMatch(route: Route, segments: UrlSegment[]): MaybeAsync<GuardResult> {
    return this.checkLogin();
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.checkLogin();
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.canActivate(route, state);
  }

  checkLogin(): boolean {
    if (this.userService.isUserLoggedIn()) {
      return true;
    } else {
      const path = window.location.pathname;

      this.router.navigateByUrl('/unauthenticated', {skipLocationChange: true, replaceUrl: true}).then(r => {
        window.history.replaceState(null, '', path); // Workaround to keep url in browser, side effect url blinks once.
      });
      return false;
    }
  }
}
