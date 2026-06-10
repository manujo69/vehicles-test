import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'makes',
    loadChildren: () => import('./features/makes/makes.routes').then(m => m.routes),
  },
  {
    path: 'makes/:makeId',
    loadChildren: () => import('./features/make-detail/make-detail.routes').then(m => m.routes),
  },
  { path: '', redirectTo: 'makes', pathMatch: 'full' },
  { path: '**', redirectTo: 'makes' },
];
