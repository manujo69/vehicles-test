import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { filter, pipe, switchMap, tap } from 'rxjs';
import { VpicApiPort } from '@core/api/vpic-api.port';
import { NotificationService } from '@shared/services/notification.service';
import { Make } from '@domain/make.model';

interface MakesState {
  makes: Make[];
  filter: string;
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

const initialState: MakesState = {
  makes: [],
  filter: '',
  loading: false,
  loaded: false,
  error: null,
};

export const MakesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ makes, filter }) => ({
    filteredMakes: computed(() => {
      const term = filter().trim().toLowerCase();
      return term ? makes().filter(m => m.name.toLowerCase().includes(term)) : makes();
    }),
  })),
  withMethods((store, api = inject(VpicApiPort), notifications = inject(NotificationService)) => ({
    setFilter(searchTerm: string): void {
      patchState(store, { filter: searchTerm });
    },
    loadMakes: rxMethod<void>(
      pipe(
        filter(() => !store.loaded()),
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() =>
          api.getAllMakes().pipe(
            tapResponse({
              next: (makes) => patchState(store, { makes, loading: false, loaded: true }),
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
