import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ReplaySubject, of } from 'rxjs';
import { MakesEffects } from './makes-effects';
import { makesActions } from './makes-actions';
import { makesFeature } from './makes-features';
import { VpicApiPort } from '@core/api/vpic-api.port';
import { NotificationService } from '@shared/services/notification.service';
import { MAKES_MOCK } from '@shared/consts/testing.constants';

describe('MakesEffects', () => {
  let effects: MakesEffects;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let actions$: ReplaySubject<any>;
  let store: MockStore;
  let apiSpy: jasmine.SpyObj<VpicApiPort>;
  let notificationSpy: jasmine.SpyObj<NotificationService>;


  beforeEach(() => {
    actions$ = new ReplaySubject(1);
    apiSpy = jasmine.createSpyObj<VpicApiPort>('VpicApiPort', ['getAllMakes']);
    notificationSpy = jasmine.createSpyObj<NotificationService>('NotificationService', ['error']);

    TestBed.configureTestingModule({
      providers: [
        MakesEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: VpicApiPort, useValue: apiSpy },
        { provide: NotificationService, useValue: notificationSpy },
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
      apiSpy.getAllMakes.and.returnValue(of(MAKES_MOCK));

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
        expect(apiSpy.getAllMakes).not.toHaveBeenCalled();
        done();
      }, 0);
    });

  });
});
