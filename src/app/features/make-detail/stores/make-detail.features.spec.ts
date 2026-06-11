import { adapter, makeDetailFeature, MakeDetailState } from './make-detail.features';
import { makeDetailActions } from './make-detail.actions';
import { VehicleType } from '@domain/vehicle-type.model';
import { VehicleModel } from '@domain/vehicle-model.model';

const reducer = makeDetailFeature.reducer;

const initialState: MakeDetailState = adapter.getInitialState({
  loading: false,
  error: null,
});

const types: VehicleType[] = [{ id: 1, name: 'Passenger Car' }];
const models: VehicleModel[] = [{ id: 10, name: 'Corolla', makeName: 'TOYOTA' }];

describe('makeDetail reducer', () => {
  it('returns initial state for unknown action', () => {
    const state = reducer(undefined as unknown as MakeDetailState, { type: '@@INIT' } as never);
    expect(state.loading).toBeFalse();
    expect(state.error).toBeNull();
    expect(adapter.getSelectors().selectAll(state)).toEqual([]);
  });

  describe('loadMakeDetail', () => {
    it('sets loading to true when makeId is not cached', () => {
      const state = reducer(initialState, makeDetailActions.loadMakeDetail({ makeId: 1 }));
      expect(state.loading).toBeTrue();
      expect(state.error).toBeNull();
    });

    it('returns the same state reference when makeId is already in entities', () => {
      const withEntity = adapter.upsertOne(
        { makeId: 1, types: [], models: [] },
        { ...initialState },
      );
      const state = reducer(withEntity, makeDetailActions.loadMakeDetail({ makeId: 1 }));
      expect(state).toBe(withEntity);
    });
  });

  describe('loadMakeDetailSuccess', () => {
    it('upserts the entity and clears loading', () => {
      const state = reducer(
        { ...initialState, loading: true },
        makeDetailActions.loadMakeDetailSuccess({ makeId: 42, types, models }),
      );
      expect(state.loading).toBeFalse();
      expect(state.entities[42]).toEqual({ makeId: 42, types, models });
    });

    it('does not reset other cached entities', () => {
      const withExisting = adapter.upsertOne({ makeId: 1, types: [], models: [] }, initialState);
      const state = reducer(
        withExisting,
        makeDetailActions.loadMakeDetailSuccess({ makeId: 2, types, models }),
      );
      expect(state.entities[1]).toBeDefined();
      expect(state.entities[2]).toBeDefined();
    });
  });

});
