import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormComponent} from './components/dynamic-form/form/form.component';
import {TextInputComponent} from './components/dynamic-form/input/textbox/text-input.component';
import {ButtonComponent} from './components/button/button.component';
import {SuccessComponent} from './components/success/success.component';
import {LottieModule} from 'ngx-lottie';
import {ReactiveFormsModule} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import player from 'lottie-web';
import {PageNotFoundComponent} from './components/page-not-found/page-not-found.component';
import {UnauthenticatedComponent} from './components/unauthenticated/unauthenticated.component';
import {RouterModule} from '@angular/router';
import {LoadingComponent} from './components/loading/loading.component';
import {MatButtonModule, MatDialogModule} from '@angular/material';
import {DeleteDialogComponent} from './dialogs/delete-dialog/delete-dialog.component';
import {ErrorDialogComponent} from './dialogs/error-dialog/error-dialog.component';
import {LoginDialogComponent} from './dialogs/login-dialog/login-dialog.component';
import {LoginFormComponent} from './components/login-form/login-form.component';
import {AccessDeniedComponent} from './components/access-denied/access-denied.component';
import {DropdownInputComponent} from './components/dynamic-form/input/dropdown/dropdown-input.component';
import {TypeOfPipe} from './pipes/type-of.pipe';

// Note we need a separate function as it's required
// by the AOT compiler
export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [
    FormComponent,
    TextInputComponent,
    DropdownInputComponent,
    ButtonComponent,
    SuccessComponent,
    PageNotFoundComponent,
    UnauthenticatedComponent,
    LoadingComponent,
    DeleteDialogComponent,
    ErrorDialogComponent,
    LoginDialogComponent,
    LoginFormComponent,
    AccessDeniedComponent,
    TypeOfPipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    MatDialogModule,
    MatButtonModule,
    FontAwesomeModule,
    LottieModule.forRoot({player: playerFactory}),
    RouterModule
  ],
  exports: [
    FormComponent,
    TextInputComponent,
    DropdownInputComponent,
    ButtonComponent,
    SuccessComponent,
    PageNotFoundComponent,
    UnauthenticatedComponent,
    LoadingComponent,
    DeleteDialogComponent,
    ErrorDialogComponent,
    LoginDialogComponent,
    LoginFormComponent,
    AccessDeniedComponent,
    TypeOfPipe
  ],
  entryComponents: [DeleteDialogComponent, ErrorDialogComponent, LoginDialogComponent]
})
export class SharedModule {
}
