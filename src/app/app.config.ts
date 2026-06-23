import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { provideStore } from '@ngrx/store';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideHttpClient } from '@angular/common/http';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { makesFeature } from './features/makes/stores/makes-features';
import { MakesEffects } from './features/makes/stores/makes-effects';
import { MakesPort } from './features/makes/data/makes.port';
import { MakesNgRxAdapter } from './features/makes/data/makes-ngrx.adapter';
import { VehicleRepositoryPort } from './_ports/vehicle-repository.port';
import { VpicHttpAdapter } from './_adapters/http/vpic-http.adapter';
import { NotificationPort } from './_ports/notification.port';
import { SnackbarNotificationAdapter } from './_adapters/notification/snackbar-notification.adapter';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideRouter(routes, withComponentInputBinding()),
    provideStore(),
    provideState(makesFeature),
    provideEffects(MakesEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: environment.production }),
    MakesNgRxAdapter,
    { provide: MakesPort, useExisting: MakesNgRxAdapter },
    { provide: VehicleRepositoryPort, useClass: VpicHttpAdapter },
    { provide: NotificationPort, useClass: SnackbarNotificationAdapter },
  ],
};
