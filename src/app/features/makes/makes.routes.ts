import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/makes-page/makes-page.component').then(m => m.MakesPageComponent),
  },
];
