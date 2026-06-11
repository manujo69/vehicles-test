import { createFeature, createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { VehicleType } from '@domain/vehicle-type.model';
import { VehicleModel } from '@domain/vehicle-model.model';
import { makeDetailActions } from './make-detail.actions';

export interface MakeDetail {
  makeId: number;
  types: VehicleType[];
  models: VehicleModel[];
}

export interface MakeDetailState extends EntityState<MakeDetail> {
  loading: boolean;
  error: string | null;
}

export const adapter = createEntityAdapter<MakeDetail>({
  selectId: makeDetail => makeDetail.makeId,
});

const initialState: MakeDetailState = adapter.getInitialState({
  loading: false,
  error: null,
});

export const makeDetailFeature = createFeature({
  name: 'makeDetail',
  reducer: createReducer(
    initialState,

    // Loading make-detail starts
    on(makeDetailActions.loadMakeDetail, (state, { makeId }) =>
      state.entities[makeId] ? state : { ...state, loading: true, error: null }),

    // Make-detail loaded successfully
    on(makeDetailActions.loadMakeDetailSuccess, (state, { makeId, types, models }) =>
      adapter.upsertOne({ makeId, types, models }, { ...state, loading: false })),

    // Loading make-detail failed!
    on(makeDetailActions.loadMakeDetailFailure, (state, { error }) =>
      ({ ...state, loading: false, error })),
  ),
});
