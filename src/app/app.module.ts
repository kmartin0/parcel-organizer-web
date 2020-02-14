import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {InputComponent} from './input/input.component';
import {LoginComponent} from './login/login.component';
import {FormSubmitDirective} from './directive/form-submit.directive';
import {RegisterComponent} from './register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    InputComponent,
    LoginComponent,
    FormSubmitDirective,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
