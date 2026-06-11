import { adapter, makesFeature, MakesState } from './makes-features';
import { makesActions } from './makes-actions';
import { Make } from '../../../domain/make.model';
import { MAKES_MOCK } from '@shared/consts/testing.constants';

const reducer = makesFeature.reducer;

const initialState: MakesState = adapter.getInitialState({
  filter: '',
  loading: false,
  loaded: false,
  error: null,
});

describe('makes reducer', () => {
  it('returns initial state for unknown action', () => {
    const state = reducer(undefined as unknown as MakesState, { type: '@@INIT' } as never);
    expect(state.loading).toBeFalse();
    expect(state.loaded).toBeFalse();
    expect(state.filter).toBe('');
    expect(state.error).toBeNull();
    expect(adapter.getSelectors().selectAll(state)).toEqual([]);
  });

  describe('loadMakes', () => {
    it('sets loading to true when not yet loaded', () => {
      const state = reducer(initialState, makesActions.loadMakes());
      expect(state.loading).toBeTrue();
      expect(state.error).toBeNull();
    });

    it('returns the same state reference when already loaded', () => {
      const loaded: MakesState = { ...initialState, loaded: true, loading: false };
      const state = reducer(loaded, makesActions.loadMakes());
      expect(state).toBe(loaded);
    });
  });

  describe('loadMakesSuccess', () => {
    it('stores makes and clears loading flag', () => {
      const makes: Make[] = [{ id: 1, name: 'TOYOTA' }, { id: 2, name: 'HONDA' }];
      const state = reducer(
        { ...initialState, loading: true },
        makesActions.loadMakesSuccess({ makes }),
      );
      expect(state.loading).toBeFalse();
      expect(state.loaded).toBeTrue();
      expect(adapter.getSelectors().selectAll(state)).toEqual(makes);
    });

    it('replaces any previously loaded makes', () => {
      const first: Make[] = [{ id: 1, name: 'TOYOTA' }];
      const second: Make[] = [{ id: 2, name: 'HONDA' }];
      const afterFirst = reducer(initialState, makesActions.loadMakesSuccess({ makes: first }));
      const afterSecond = reducer(afterFirst, makesActions.loadMakesSuccess({ makes: second }));
      expect(adapter.getSelectors().selectAll(afterSecond)).toEqual(second);
    });
  });

  describe('loadMakesFailure', () => {
    it('stores error message and clears loading', () => {
      const state = reducer(
        { ...initialState, loading: true },
        makesActions.loadMakesFailure({ error: 'Network error' }),
      );
      expect(state.loading).toBeFalse();
      expect(state.error).toBe('Network error');
    });
  });

  describe('setFilter', () => {
    it('updates the filter term', () => {
      const state = reducer(initialState, makesActions.setFilter({ searchTerm: 'toy' }));
      expect(state.filter).toBe('toy');
    });

    it('allows clearing the filter', () => {
      const withFilter: MakesState = { ...initialState, filter: 'toy' };
      const state = reducer(withFilter, makesActions.setFilter({ searchTerm: '' }));
      expect(state.filter).toBe('');
    });
  });
});

describe('makesFeature selectors', () => {

  describe('selectFilteredMakes', () => {
    it('returns all makes when filter is empty', () => {
      const result = makesFeature.selectFilteredMakes.projector(MAKES_MOCK, '');
      expect(result).toEqual(MAKES_MOCK);
    });

    it('filters by term case-insensitively', () => {
      const result = makesFeature.selectFilteredMakes.projector(MAKES_MOCK, 'toy');
      expect(result).toEqual([{ id: 1, name: 'TOYOTA' }]);
    });

    it('trims leading and trailing whitespace from the term', () => {
      const result = makesFeature.selectFilteredMakes.projector(MAKES_MOCK, '  honda  ');
      expect(result).toEqual([{ id: 2, name: 'HONDA' }]);
    });

    it('returns empty array when no makes match the term', () => {
      const result = makesFeature.selectFilteredMakes.projector(MAKES_MOCK, 'zzz');
      expect(result).toEqual([]);
    });

    it('matches partial names', () => {
      const result = makesFeature.selectFilteredMakes.projector(MAKES_MOCK, 'M');
      expect(result).toEqual([{ id: 3, name: 'BMW' }]);
    });
  });
});
