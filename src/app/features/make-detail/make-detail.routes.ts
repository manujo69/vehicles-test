import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { makeDetailFeature } from './stores/make-detail.features';
import { MakeDetailEffects } from './stores/make-detail.effects';


export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/make-detail-page/make-detail-page.component')
        .then(m => m.MakeDetailPageComponent),
    providers: [provideState(makeDetailFeature), provideEffects(MakeDetailEffects)],
  },
];
