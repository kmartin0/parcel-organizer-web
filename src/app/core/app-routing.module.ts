import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from '../modules/home/pages/home/home.component';
import {PageNotFoundComponent} from '../pages/page-not-found/page-not-found.component';

const appRoutes: Routes = [
  {
    path: 'portal',
    loadChildren: () => import('../modules/portal/portal.module').then(m => m.PortalModule),
    // data: { preload: true }
  },

  {
    path: '',
    loadChildren: () => import('../modules/home/home.module').then(m => m.HomeModule),
    // data: { preload: true }
  },

  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes, {enableTracing: true})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
