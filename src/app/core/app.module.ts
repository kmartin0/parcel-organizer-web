import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthInterceptor} from '../api/auth.interceptor';
import {AppRoutingModule} from './app-routing.module';
import {SharedModule} from '../shared/shared.module';
import {HttpLoggingInterceptor} from '../api/http-logging.interceptor';
import {MatButtonModule, MatDialogModule} from '@angular/material';
import {DeleteDialogComponent} from '../shared/dialogs/delete-dialog/delete-dialog.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    AppRoutingModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: HttpLoggingInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule {
}
