import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { NbMenuModule, NbSidebarModule, NbThemeModule } from '@nebular/theme';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideHttpClient(),
    ...NbThemeModule.forRoot().providers || [],
    ...NbSidebarModule.forRoot().providers || [],
    ...NbMenuModule.forRoot().providers || [],
  ],
};
