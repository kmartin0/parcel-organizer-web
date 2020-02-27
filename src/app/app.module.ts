import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {FormComponent} from './components/dynamic-form/form/form.component';
import {TextInputComponent} from './components/dynamic-form/input/text-input/text-input.component';
import {ButtonComponent} from './components/button/button.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {LottieModule} from 'ngx-lottie';
import player from 'lottie-web';
import {SuccessComponent} from './components/success/success.component';
import {AuthInterceptor} from './api/auth.interceptor';

// Note we need a separate function as it's required
// by the AOT compiler
export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    FormComponent,
    TextInputComponent,
    ButtonComponent,
    SuccessComponent,
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    LottieModule.forRoot({player: playerFactory})
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
