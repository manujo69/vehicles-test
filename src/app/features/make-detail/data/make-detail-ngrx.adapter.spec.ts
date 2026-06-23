/**
 * Tests del adapter NgRx
 *
 * Qué prueba: que el adapter mapea los selectores del store a signals del puerto
 * y que loadMakeDetail() actualiza el detail reactivo y despacha la acción correcta.
 * Usa MockStore; no hay red real.
 *
 * Qué NO prueba: lógica HTTP, effects, reducers.
 * Esos tests viven en make-detail.effects.spec.ts y make-detail.features.spec.ts.
 */
import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MakeDetailPort } from './make-detail.port';
import { MakeDetailNgRxAdapter } from './make-detail-ngrx.adapter';
import { makeDetailFeature } from '../stores/make-detail.features';
import { makeDetailActions } from '../stores/make-detail.actions';

const SAMPLE_DETAIL = { makeId: 42, types: [], models: [] };

describe('MakeDetailNgRxAdapter', () => {
  let port: MakeDetailPort;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore(),
        MakeDetailNgRxAdapter,
        { provide: MakeDetailPort, useExisting: MakeDetailNgRxAdapter },
      ],
    });

    port = TestBed.inject(MakeDetailPort);
    store = TestBed.inject(MockStore);
  });

  afterEach(() => store.resetSelectors());

  it('exposes loading from selectLoading', () => {
    store.overrideSelector(makeDetailFeature.selectLoading, true);
    store.refreshState();
    expect(port.loading()).toBe(true);
  });

  it('detail() is undefined before any makeId is requested', () => {
    expect(port.detail()).toBeUndefined();
  });

  it('detail() returns the entity matching the last requested makeId', () => {
    store.overrideSelector(makeDetailFeature.selectEntities, { 42: SAMPLE_DETAIL });
    store.refreshState();
    port.loadMakeDetail(42);
    expect(port.detail()).toEqual(SAMPLE_DETAIL);
  });

  it('loadMakeDetail() dispatches the correct action', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    port.loadMakeDetail(7);
    expect(dispatchSpy).toHaveBeenCalledWith(makeDetailActions.loadMakeDetail({ makeId: 7 }));
  });
});
