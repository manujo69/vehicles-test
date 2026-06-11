import { Routes } from '@angular/router';
import { ROUTES } from './shared/consts/routes.constants';

export const routes: Routes = [
  {
    path: ROUTES.MAKES,
    loadChildren: () => import('./features/makes/makes.routes').then(m => m.routes),
  },
  {
    path: `${ROUTES.MAKES}/:${ROUTES.MAKE_ID_PARAM}`,
    loadChildren: () => import('./features/make-detail/make-detail.routes').then(m => m.routes),
  },
  { path: '', redirectTo: ROUTES.MAKES, pathMatch: 'full' },
  { path: '**', redirectTo: ROUTES.MAKES },
];
