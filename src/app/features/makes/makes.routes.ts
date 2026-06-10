import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { makesFeature } from './stores/makes-features';
import { MakesEffects } from './stores/makes-effects';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/makes-page/makes-page.component').then(m => m.MakesPageComponent),
    providers: [provideState(makesFeature), provideEffects(MakesEffects)],
  },
];
