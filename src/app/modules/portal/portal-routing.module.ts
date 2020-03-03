import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PortalComponent} from './pages/portal/portal.component';
import {ParcelsComponent} from './pages/parcels/parcels.component';
import {CreateParcelComponent} from './pages/create-parcel/create-parcel.component';
import {AccountComponent} from './pages/account/account.component';

const portalRoutes: Routes = [
  {
    path: '',
    component: PortalComponent,
    children: [
      {
        path: '',
        redirectTo: 'parcels'
      },
      {
        path: 'parcels',
        component: ParcelsComponent,
      },
      {
        path: 'create-parcel',
        component: CreateParcelComponent
      },
      {
        path: 'account',
        component: AccountComponent
      },
    ]
  },
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
export class PortalRoutingModule {
}
