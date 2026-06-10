import { createFeature, createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { VehicleType } from '../../../domain/vehicle-type.model';
import { VehicleModel } from '../../../domain/vehicle-model.model';
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
  selectId: detail => detail.makeId,
});

const initialState: MakeDetailState = adapter.getInitialState({
  loading: false,
  error: null,
});

export const makeDetailFeature = createFeature({
  name: 'makeDetail',
  reducer: createReducer(
    initialState,
    on(makeDetailActions.loadMakeDetail, (state, { makeId }) =>
      state.entities[makeId] ? state : { ...state, loading: true, error: null }),
    on(makeDetailActions.loadMakeDetailSuccess, (state, { makeId, types, models }) =>
      adapter.upsertOne({ makeId, types, models }, { ...state, loading: false })),
    on(makeDetailActions.loadMakeDetailFailure, (state, { error }) =>
      ({ ...state, loading: false, error })),
  ),
});
