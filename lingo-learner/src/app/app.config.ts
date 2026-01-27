import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { AppSettingsService } from './services/app-settings.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideAppInitializer(() => {
      const settingsService = inject(AppSettingsService);
      return settingsService.loadAppSettings();
    }),
  ],
};
