import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, filter, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { VehicleRepositoryPort } from '../../../_ports/vehicle-repository.port';
import { NotificationPort } from '../../../_ports/notification.port';
import { makeDetailActions } from './make-detail.actions';
import { makeDetailFeature } from './make-detail.features';

@Injectable()
export class MakeDetailEffects {
  private readonly actions$ = inject(Actions);
  private readonly repository = inject(VehicleRepositoryPort);
  private readonly store = inject(Store);
  private readonly notifications = inject(NotificationPort);

  loadMakeDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(makeDetailActions.loadMakeDetail),
      concatLatestFrom(() => this.store.select(makeDetailFeature.selectEntities)),
      // no refetch si ese makeId ya está cargado
      filter(([{ makeId }, entities]) => !entities[makeId]),
      switchMap(([{ makeId }]) =>
        forkJoin({
          types: this.repository.getVehicleTypesForMakeId(makeId),
          models: this.repository.getModelsForMakeId(makeId),
        }).pipe(
          map(({ types, models }) =>
            makeDetailActions.loadMakeDetailSuccess({ makeId, types, models })),
          catchError(err =>
            of(makeDetailActions.loadMakeDetailFailure({ makeId, error: err.message }))),
        ),
      ),
    ),
  );

  notifyError$ = createEffect(
    () => this.actions$.pipe(
      ofType(makeDetailActions.loadMakeDetailFailure),
      tap(({ error }) => this.notifications.error(error)),
    ),
    { dispatch: false },
  );
}
