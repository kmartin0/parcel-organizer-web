import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {PageNotFoundComponent} from '../shared/components/page-not-found/page-not-found.component';
import {AuthGuard} from './auth.guard';
import {UnauthenticatedComponent} from '../shared/components/unauthenticated/unauthenticated.component';
import {AnonymousGuard} from './anonymous.guard';

const appRoutes: Routes = [
  {
    path: 'portal',
    loadChildren: () => import('../modules/portal/portal.module').then(m => m.PortalModule),
    canLoad: [AuthGuard]
  },
  {
    path: '',
    loadChildren: () => import('../modules/home/home.module').then(m => m.HomeModule),
    canActivate: [AnonymousGuard]
  },
  {path: 'unauthenticated', component: UnauthenticatedComponent},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
