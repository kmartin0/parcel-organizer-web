import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {ParcelsComponent} from './pages/parcels/parcels.component';
import {CreateParcelComponent} from './pages/create-parcel/create-parcel.component';
import {AccountComponent} from './pages/account/account.component';
import {AuthGuard} from '../../core/auth.guard';

const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        canActivateChild: [AuthGuard],
        children: [
          {
            path: '',
            redirectTo: 'parcels',
          },
          {
            path: 'parcels',
            component: ParcelsComponent,
            data: {title: 'Parcels'}
          },
          {
            path: 'create-parcel',
            component: CreateParcelComponent,
            data: {title: 'Create Parcel'}
          },
          {
            path: 'account',
            component: AccountComponent,
            data: {title: 'Account'}
          }
        ]
      }
    ]
  },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(dashboardRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class DashboardRoutingModule {
}
