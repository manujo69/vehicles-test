import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { makesActions } from './makes-actions';
import { Make } from '@domain/make.model';

export interface MakesState extends EntityState<Make> {
  filter: string;
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

export const adapter = createEntityAdapter<Make>();

const initialState: MakesState = adapter.getInitialState({
  filter: '',
  loading: false,
  loaded: false,
  error: null,
});

export const makesFeature = createFeature({
  name: 'makes',
  reducer: createReducer(
    initialState,

    // Loading makes starts
    on(makesActions.loadMakes, state =>
      state.loaded ? state : { ...state, loading: true, error: null }),

    // Makes loaded successfully
    on(makesActions.loadMakesSuccess, (state, { makes }) =>
      adapter.setAll(makes, { ...state, loading: false, loaded: true })),

    // Loading makes failed!
    on(makesActions.loadMakesFailure, (state, { error }) =>
      ({ ...state, loading: false, error })),

    // Filtering by text
    on(makesActions.setFilter, (state, { searchTerm }) =>
      ({ ...state, filter: searchTerm })),
  ),
  extraSelectors: ({ selectMakesState, selectFilter }) => {
    const selectAllMakes = createSelector(selectMakesState, adapter.getSelectors().selectAll);
    return {
      selectAllMakes,
      selectFilteredMakes: createSelector(selectAllMakes, selectFilter, (makes, filter) => {
        const term = filter.trim().toLowerCase();
        return term ? makes.filter(m => m.name.toLowerCase().includes(term)) : makes;
      }),
    };
  },
});
