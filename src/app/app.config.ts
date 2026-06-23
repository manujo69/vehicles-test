import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { VpicApiPort } from './core/api/vpic-api.port';
import { VpicApiService } from './core/api/vpic-api.service';
import { MakesPort } from './features/makes/data/makes.port';
import { MakesNgRxAdapter } from './features/makes/data/makes-ngrx.adapter';
import { MakeDetailPort } from './features/make-detail/data/make-detail.port';
import { MakeDetailNgRxAdapter } from './features/make-detail/data/make-detail-ngrx.adapter';
import { MakeDetailStore } from './features/make-detail/stores/make-detail.store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    { provide: VpicApiPort, useExisting: VpicApiService },
    provideRouter(routes, withComponentInputBinding()),
    MakesNgRxAdapter,
    { provide: MakesPort, useExisting: MakesNgRxAdapter },
    MakeDetailStore,
    MakeDetailNgRxAdapter,
    { provide: MakeDetailPort, useExisting: MakeDetailNgRxAdapter },
  ],
};
