import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardRoutingModule} from './dashboard-routing.module';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';
import {NavComponent} from './components/nav/nav.component';
import {DashboardContentComponent} from './components/dashboard-content/dashboard-content.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {SharedModule} from '../../shared/shared.module';
import {HomeModule} from '../home/home.module';
import {ParcelsComponent} from './pages/parcels/parcels.component';
import {CreateParcelComponent} from './pages/create-parcel/create-parcel.component';
import {AccountComponent} from './pages/account/account.component';
import {ParcelItemComponent} from './components/parcel-item/parcel-item.component';
import {EditParcelComponent} from './pages/edit-parcel/edit-parcel.component';
import {ParcelFormComponent} from './components/parcel-form/parcel-form.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ChangePasswordFormComponent} from './components/change-password-form/change-password-form.component';

//TODO: parcels paginate, sort, filter.
//TODO: abstract forms/form components.
//TODO: check email changed elsewhere (android). authentication (retry login when invalid token/grant but not on login or something.)
@NgModule({
  declarations: [
    DashboardComponent,
    DashboardContentComponent,
    HeaderComponent,
    FooterComponent,
    NavComponent,
    ParcelsComponent,
    CreateParcelComponent,
    AccountComponent,
    ParcelItemComponent,
    EditParcelComponent,
    ParcelFormComponent,
    ChangePasswordFormComponent
  ],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        FontAwesomeModule,
        SharedModule,
        HomeModule,
        MatSnackBarModule,
        ClipboardModule,
        MatTooltipModule
    ]
})
export class DashboardModule {
}
