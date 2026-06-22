import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/make-detail-page/make-detail-page.component')
        .then(m => m.MakeDetailPageComponent),
  },
];
