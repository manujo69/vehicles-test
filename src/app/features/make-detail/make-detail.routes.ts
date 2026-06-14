import { Routes } from '@angular/router';
import { MakeDetailStore } from './stores/make-detail.store';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/make-detail-page/make-detail-page.component')
        .then(m => m.MakeDetailPageComponent),
    providers: [MakeDetailStore],
  },
];
