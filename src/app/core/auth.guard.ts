import {Injectable} from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  UrlSegment,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree, Router
} from '@angular/router';
import {Observable} from 'rxjs';
import {UserService} from '../shared/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(private userService: UserService, private router: Router) {
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

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {

    return this.checkLogin();
  }

  checkLogin(): boolean {
    if (this.userService.isUserLoggedIn()) {
      return true;
    } else {
      const path = window.location.pathname;

      this.router.navigateByUrl('/unauthenticated', {skipLocationChange: true, replaceUrl: true}).then(r => {
        window.history.replaceState(null, null, path); // Workaround to keep url in browser, side effect url blinks once.
      });
      return false;
    }
  }
}
