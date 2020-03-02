import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PortalComponent} from './pages/portal/portal.component';
import {MainComponent} from './pages/main/main.component';

const portalRoutes: Routes = [
  {
    path: '',
    component: PortalComponent,
    children: [
      {
        path: '',
        component: MainComponent
      }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(portalRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class PortalRoutingModule { }

// https://stackblitz.com/angular/pbqlrdpbpvx?file=src%2Fapp%2Fcrisis-center%2Fcrisis-center-routing.module.ts
