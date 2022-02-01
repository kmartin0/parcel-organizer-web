import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ApiAuthInterceptor} from '../api/api-auth.interceptor';
import {AppRoutingModule} from './app-routing.module';
import {SharedModule} from '../shared/shared.module';
import {ApiErrorInterceptor} from '../api/api-error.interceptor';
import {ApiLoggingInterceptor} from '../api/api-logging.interceptor';


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
        { provide: HTTP_INTERCEPTORS, useClass: ApiErrorInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ApiAuthInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ApiLoggingInterceptor, multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
