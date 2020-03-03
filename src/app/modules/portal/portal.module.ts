import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PortalRoutingModule} from './portal-routing.module';
import {PortalComponent} from './pages/portal/portal.component';
import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';
import {NavComponent} from './components/nav/nav.component';
import {PortalPageComponent} from './components/portal-page/portal-page.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {SharedModule} from '../../shared/shared.module';
import {HomeModule} from '../home/home.module';
import {ParcelsComponent} from './pages/parcels/parcels.component';
import {CreateParcelComponent} from './pages/create-parcel/create-parcel.component';
import {AccountComponent} from './pages/account/account.component';

@NgModule({
  declarations: [
    PortalComponent,
    PortalPageComponent,
    HeaderComponent,
    FooterComponent,
    NavComponent,
    ParcelsComponent,
    CreateParcelComponent,
    AccountComponent
  ],
  imports: [
    CommonModule,
    PortalRoutingModule,
    FontAwesomeModule,
    SharedModule,
    HomeModule
  ]
})
export class PortalModule {
}
