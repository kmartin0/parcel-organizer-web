import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {PageNotFoundComponent} from '../pages/page-not-found/page-not-found.component';

const appRoutes: Routes = [
  {
    path: 'portal',
    loadChildren: () => import('../modules/portal/portal.module').then(m => m.PortalModule),
  },
  {
    path: '',
    loadChildren: () => import('../modules/home/home.module').then(m => m.HomeModule),
  },
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes, {enableTracing: true, preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
