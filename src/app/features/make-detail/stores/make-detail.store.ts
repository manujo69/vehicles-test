import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { filter, forkJoin, pipe, switchMap, tap } from 'rxjs';
import { VpicApiService } from '@core/api/vpic-api.service';
import { NotificationService } from '@shared/services/notification.service';
import { VehicleType } from '@domain/vehicle-type.model';
import { VehicleModel } from '@domain/vehicle-model.model';

export interface MakeDetail {
  makeId: number;
  types: VehicleType[];
  models: VehicleModel[];
}

interface MakeDetailState {
  details: Record<number, MakeDetail>;
  loading: boolean;
  error: string | null;
}

const initialState: MakeDetailState = {
  details: {},
  loading: false,
  error: null,
};

export const MakeDetailStore = signalStore(
  withState(initialState),
  withMethods((store, api = inject(VpicApiService), notifications = inject(NotificationService)) => ({
    loadMakeDetail: rxMethod<number>(
      pipe(
        filter((makeId) => !store.details()[makeId]),
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((makeId) =>
          forkJoin({
            types: api.getVehicleTypesForMakeId(makeId),
            models: api.getModelsForMakeId(makeId),
          }).pipe(
            tapResponse({
              next: ({ types, models }) =>
                patchState(store, (state) => ({
                  details: { ...state.details, [makeId]: { makeId, types, models } },
                  loading: false,
                })),
              error: (err: Error) => {
                patchState(store, { error: err.message, loading: false });
                notifications.error(err.message);
              },
            }),
          ),
        ),
      ),
    ),
  })),
);
