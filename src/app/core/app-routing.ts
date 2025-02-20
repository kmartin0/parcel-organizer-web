import {Routes} from '@angular/router';
import {UnauthenticatedComponent} from '../shared/components/unauthenticated/unauthenticated.component';
import {PageNotFoundComponent} from '../shared/components/page-not-found/page-not-found.component';
import {dashboardRoutes} from '../modules/dashboard/dashboard-routing';
import {homeRoutes} from '../modules/home/home-routing';
import {AuthGuard} from './auth.guard';
import {AnonymousGuard} from './anonymous.guard';

export const appRoutes: Routes = [
  {
    path: 'dashboard',
    children: dashboardRoutes,
    canMatch: [AuthGuard]
  },
  {
    path: '',
    children: homeRoutes,
    canActivate: [AnonymousGuard]
  },
  {path: 'unauthenticated', component: UnauthenticatedComponent},
  {path: '**', component: PageNotFoundComponent}
];
