import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ReplaySubject, of } from 'rxjs';
import { MakesEffects } from './makes-effects';
import { makesActions } from './makes-actions';
import { makesFeature } from './makes-features';
import { VehicleRepositoryPort } from '@core/vehicle-repository.port';
import { NotificationPort } from '@core/notification.port';
import { MAKES_MOCK } from '@shared/consts/testing.constants';

describe('MakesEffects', () => {
  let effects: MakesEffects;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let actions$: ReplaySubject<any>;
  let store: MockStore;
  let repositorySpy: jasmine.SpyObj<VehicleRepositoryPort>;
  let notificationSpy: jasmine.SpyObj<NotificationPort>;


  beforeEach(() => {
    actions$ = new ReplaySubject(1);
    repositorySpy = jasmine.createSpyObj<VehicleRepositoryPort>('VehicleRepositoryPort', ['getAllMakes']);
    notificationSpy = jasmine.createSpyObj<NotificationPort>('NotificationPort', ['error']);

    TestBed.configureTestingModule({
      providers: [
        MakesEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: VehicleRepositoryPort, useValue: repositorySpy },
        { provide: NotificationPort, useValue: notificationSpy },
      ],
    });

    effects = TestBed.inject(MakesEffects);
    store = TestBed.inject(MockStore);
  });

  afterEach(() => store.resetSelectors());

  describe('loadMakes$', () => {
    it('dispatches loadMakesSuccess when data is not yet loaded', done => {
      store.overrideSelector(makesFeature.selectLoaded, false);
      store.refreshState();
      repositorySpy.getAllMakes.and.returnValue(of(MAKES_MOCK));

      effects.loadMakes$.subscribe(action => {
        expect(action).toEqual(makesActions.loadMakesSuccess({ makes: MAKES_MOCK }));
        done();
      });

      actions$.next(makesActions.loadMakes());
    });

    it('does not emit when data is already loaded', done => {
      store.overrideSelector(makesFeature.selectLoaded, true);
      store.refreshState();

      let emitted = false;
      effects.loadMakes$.subscribe(() => (emitted = true));
      actions$.next(makesActions.loadMakes());

      setTimeout(() => {
        expect(emitted).toBeFalse();
        expect(repositorySpy.getAllMakes).not.toHaveBeenCalled();
        done();
      }, 0);
    });

  });
});
