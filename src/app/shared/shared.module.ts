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
import {DeleteDialogComponent} from './components/dialogs/delete-dialog/delete-dialog.component';
import {ErrorDialogComponent} from './components/dialogs/error-dialog/error-dialog.component';
import {UserAuthDialogComponent} from './components/dialogs/user-auth-dialog/user-auth-dialog.component';
import {UserAuthFormComponent} from './components/user-authentication-form/user-auth-form.component';
import {AccessDeniedComponent} from './components/access-denied/access-denied.component';
import {DropdownInputComponent} from './components/dynamic-form/input/dropdown/dropdown-input.component';
import {TypeOfPipe} from './pipes/type-of.pipe';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {UserFormComponent} from './components/user-form/user-form.component';
import {PaginatorComponent} from './components/paginator/paginator.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {ForgotPasswordFormComponent} from './components/forgot-password-form/forgot-password-form.component';

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
    UserAuthDialogComponent,
    UserAuthFormComponent,
    AccessDeniedComponent,
    TypeOfPipe,
    UserFormComponent,
    PaginatorComponent,
    ForgotPasswordFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    MatDialogModule,
    MatButtonModule,
    FontAwesomeModule,
    LottieModule.forRoot({player: playerFactory}),
    RouterModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule
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
    UserAuthDialogComponent,
    UserAuthFormComponent,
    AccessDeniedComponent,
    TypeOfPipe,
    UserFormComponent,
    PaginatorComponent,
    ForgotPasswordFormComponent
  ],
  entryComponents: [DeleteDialogComponent, ErrorDialogComponent, UserAuthDialogComponent]
})
export class SharedModule {
}
