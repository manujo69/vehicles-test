import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, filter, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { VpicApiService } from '@core/api/vpic-api.service';
import { NotificationService } from '@shared/services/notification.service';
import { makeDetailActions } from './make-detail.actions';
import { makeDetailFeature } from './make-detail.features';

@Injectable()
export class MakeDetailEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(VpicApiService);
  private readonly store = inject(Store);
  private readonly notifications = inject(NotificationService);

  loadMakeDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(makeDetailActions.loadMakeDetail),
      concatLatestFrom(() => this.store.select(makeDetailFeature.selectEntities)),
      // no refetch si ese makeId ya está cargado
      filter(([{ makeId }, entities]) => !entities[makeId]),
      switchMap(([{ makeId }]) =>
        forkJoin({
          types: this.api.getVehicleTypesForMakeId(makeId),
          models: this.api.getModelsForMakeId(makeId),
        }).pipe(
           // next:
          map(({ types, models }) =>
            makeDetailActions.loadMakeDetailSuccess({ makeId, types, models })),
          // error:
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
