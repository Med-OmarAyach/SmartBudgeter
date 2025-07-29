import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),importProvidersFrom(HttpClientModule),provideHttpClient(
      withInterceptors([authInterceptor]) // Register the interceptor
    ),]
};
