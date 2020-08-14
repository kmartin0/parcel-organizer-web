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
import {ScrollingModule} from '@angular/cdk/scrolling';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {ParcelFilterFormComponent} from './components/parcel-filter-form/parcel-filter-form.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import {MatButtonModule} from '@angular/material/button';
import {ReactiveFormsModule} from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

/**
 * TODO: Add Retour Status.
 * TODO: Add environments (prod, dev).
 * TODO: normalize breakpoints, mobile, tablet etc.
 * TODO: Filter form -> dynamic form (dynamic form needs to support checkbox and Radio button and return a valuechanges observer)
 * TODO: Auth Interceptor Client Credentials heroku environment.
 */
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
    ChangePasswordFormComponent,
    ParcelFilterFormComponent
  ],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        FontAwesomeModule,
        SharedModule,
        HomeModule,
        MatSnackBarModule,
        ClipboardModule,
        MatTooltipModule,
        ScrollingModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatCheckboxModule,
        MatRadioModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatProgressSpinnerModule
    ]
})
export class DashboardModule {
}
