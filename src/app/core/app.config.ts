import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {InMemoryScrollingFeature, InMemoryScrollingOptions, provideRouter, withInMemoryScrolling} from '@angular/router';
import {appRoutes} from './app-routing';

import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {ApiErrorInterceptor} from '../api/api-error.interceptor';
import {ApiAuthInterceptor} from '../api/api-auth.interceptor';
import {ApiLoggingInterceptor} from '../api/api-logging.interceptor';
import {provideLottieOptions} from 'ngx-lottie';
import player from 'lottie-web';

const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',
};

const inMemoryScrollingFeature: InMemoryScrollingFeature = withInMemoryScrolling(scrollConfig);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(appRoutes, inMemoryScrollingFeature),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    {provide: HTTP_INTERCEPTORS, useClass: ApiErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ApiAuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ApiLoggingInterceptor, multi: true},
    provideLottieOptions({player: () => player})
  ]
};
