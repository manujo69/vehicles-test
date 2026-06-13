import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap, tap } from 'rxjs';
import { VehicleRepositoryPort } from '../../../_ports/vehicle-repository.port';
import { NotificationPort } from '../../../_ports/notification.port';
import { makesFeature } from './makes-features';
import { makesActions } from './makes-actions';


@Injectable()
export class MakesEffects {
  private readonly actions$ = inject(Actions);
  private readonly repository = inject(VehicleRepositoryPort);
  private readonly store = inject(Store);
  private readonly notifications = inject(NotificationPort);

  loadMakes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(makesActions.loadMakes),
      concatLatestFrom(() => this.store.select(makesFeature.selectLoaded)),
      filter(([, loaded]) => !loaded),  // no refetch si ya cargado
      switchMap(() =>
        this.repository.getAllMakes().pipe(
          map(makes => makesActions.loadMakesSuccess({ makes })),
          catchError(err => of(makesActions.loadMakesFailure({ error: err.message }))),
        ),
      ),
    ),
  );

  notifyError$ = createEffect(
    () => this.actions$.pipe(
      ofType(makesActions.loadMakesFailure),
      tap(({ error }) => this.notifications.error(error)),
    ),
    { dispatch: false },
  );
}
