/**
 * Tests del adapter NgRx
 *
 * Qué prueba: que el adapter mapea los selectores del store a signals del puerto
 * y que cada método despacha la acción correcta.
 * Usa MockStore; no hay red real.
 *
 * Qué NO prueba: lógica HTTP, effects, reducers.
 * Esos tests viven en makes-effects.spec.ts y makes-features.spec.ts.
 */
import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MakesPort } from './makes.port';
import { MakesNgRxAdapter } from './makes-ngrx.adapter';
import { makesFeature } from '../stores/makes-features';
import { makesActions } from '../stores/makes-actions';
import { MAKES_MOCK } from '@shared/consts/testing.constants';

describe('MakesNgRxAdapter', () => {
  let port: MakesPort;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore(),
        MakesNgRxAdapter,
        { provide: MakesPort, useExisting: MakesNgRxAdapter },
      ],
    });

    port = TestBed.inject(MakesPort);
    store = TestBed.inject(MockStore);
  });

  afterEach(() => store.resetSelectors());

  it('exposes makes from selectFilteredMakes', () => {
    store.overrideSelector(makesFeature.selectFilteredMakes, MAKES_MOCK);
    store.refreshState();
    expect(port.makes()).toEqual(MAKES_MOCK);
  });

  it('exposes loading from selectLoading', () => {
    store.overrideSelector(makesFeature.selectLoading, true);
    store.refreshState();
    expect(port.loading()).toBe(true);
  });

  it('exposes filter from selectFilter', () => {
    store.overrideSelector(makesFeature.selectFilter, 'honda');
    store.refreshState();
    expect(port.filter()).toBe('honda');
  });

  it('loadMakes() dispatches the correct action', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    port.loadMakes();
    expect(dispatchSpy).toHaveBeenCalledWith(makesActions.loadMakes());
  });

  it('setFilter() dispatches the correct action', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    port.setFilter('toyota');
    expect(dispatchSpy).toHaveBeenCalledWith(makesActions.setFilter({ searchTerm: 'toyota' }));
  });
});
