import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap, tap } from 'rxjs';
import { VpicApiService } from '@core/api/vpic-api.service';
import { NotificationService } from '@shared/services/notification.service';
import { makesFeature } from './makes-features';
import { makesActions } from './makes-actions';


@Injectable()
export class MakesEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(VpicApiService);
  private readonly store = inject(Store);
  private readonly notifications = inject(NotificationService);

  loadMakes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(makesActions.loadMakes),
      concatLatestFrom(() => this.store.select(makesFeature.selectLoaded)),
      filter(([, loaded]) => !loaded),  // no refetch si ya cargado
      switchMap(() =>
        this.api.getAllMakes().pipe(
          // next:
          map(makes =>
            makesActions.loadMakesSuccess({ makes })
          ),
          // error:
          catchError(err =>
            of(makesActions.loadMakesFailure({ error: err.message }))
          ),
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
