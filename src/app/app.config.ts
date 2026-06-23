import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideStore, provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { VpicApiPort } from './core/api/vpic-api.port';
import { VpicApiService } from './core/api/vpic-api.service';
import { VpicApiMockService } from './core/api/vpic-api-mock.service';
import { makesFeature } from './features/makes/stores/makes-features';
import { MakesEffects } from './features/makes/stores/makes-effects';
import { makeDetailFeature } from './features/make-detail/stores/make-detail.features';
import { MakeDetailEffects } from './features/make-detail/stores/make-detail.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideRouter(routes, withComponentInputBinding()),
    provideStore(),
    provideState(makesFeature),
    provideState(makeDetailFeature),
    provideEffects(MakesEffects, MakeDetailEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: environment.production }),
    {
      provide: VpicApiPort,
      useClass: environment.useMockApi ? VpicApiMockService : VpicApiService,
    },
  ],
};
