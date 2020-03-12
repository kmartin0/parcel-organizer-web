import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardRoutingModule} from './dashboard-routing.module';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';
import {NavComponent} from './components/nav/nav.component';
import {DashboardPageComponent} from './components/dashboard-page/dashboard-page.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {SharedModule} from '../../shared/shared.module';
import {HomeModule} from '../home/home.module';
import {ParcelsComponent} from './pages/parcels/parcels.component';
import {CreateParcelComponent} from './pages/create-parcel/create-parcel.component';
import {AccountComponent} from './pages/account/account.component';
import {ParcelItemComponent} from './components/parcel-item/parcel-item.component';
import {EditParcelComponent} from './pages/edit-parcel/edit-parcel.component';
import {ParcelFormComponent} from './components/parcel-form/parcel-form.component';

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardPageComponent,
    HeaderComponent,
    FooterComponent,
    NavComponent,
    ParcelsComponent,
    CreateParcelComponent,
    AccountComponent,
    ParcelItemComponent,
    EditParcelComponent,
    ParcelFormComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FontAwesomeModule,
    SharedModule,
    HomeModule
  ]
})
export class DashboardModule {
}
