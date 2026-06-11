import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ReplaySubject, of, throwError } from 'rxjs';
import { MakesEffects } from './makes-effects';
import { makesActions } from './makes-actions';
import { makesFeature } from './makes-features';
import { VpicApiService } from '../../../core/api/vpic-api.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { MAKES_MOCK } from '@shared/consts/testing.constants';

describe('MakesEffects', () => {
  let effects: MakesEffects;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let actions$: ReplaySubject<any>;
  let store: MockStore;
  let apiSpy: jasmine.SpyObj<VpicApiService>;
  let notificationSpy: jasmine.SpyObj<NotificationService>;


  beforeEach(() => {
    actions$ = new ReplaySubject(1);
    apiSpy = jasmine.createSpyObj<VpicApiService>('VpicApiService', ['getAllMakes']);
    notificationSpy = jasmine.createSpyObj<NotificationService>('NotificationService', ['error']);

    TestBed.configureTestingModule({
      providers: [
        MakesEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: VpicApiService, useValue: apiSpy },
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

    it('dispatches loadMakesFailure when the API call errors', done => {
      store.overrideSelector(makesFeature.selectLoaded, false);
      store.refreshState();
      apiSpy.getAllMakes.and.returnValue(throwError(() => new Error('Network error')));

      effects.loadMakes$.subscribe(action => {
        expect(action).toEqual(makesActions.loadMakesFailure({ error: 'Network error' }));
        done();
      });

      actions$.next(makesActions.loadMakes());
    });
  });

  describe('notifyError$', () => {
    it('calls notifications.error with the error message', done => {
      effects.notifyError$.subscribe(() => {
        expect(notificationSpy.error).toHaveBeenCalledOnceWith('Load failed');
        done();
      });
      actions$.next(makesActions.loadMakesFailure({ error: 'Load failed' }));
    });
  });
});
