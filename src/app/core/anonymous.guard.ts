import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  UrlSegment,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import {UserService} from '../shared/services/user.service';
import {PORTAL} from '../shared/constants/endpoints';

@Injectable({
  providedIn: 'root'
})
export class AnonymousGuard implements CanActivate, CanActivateChild, CanLoad {
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
    if (!this.userService.isUserLoggedIn()) {
      return true;
    } else {
      this.router.navigateByUrl(PORTAL);
      return false;
    }
  }
}
