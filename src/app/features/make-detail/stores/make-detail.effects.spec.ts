import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ReplaySubject, of, throwError } from 'rxjs';
import { MakeDetailEffects } from './make-detail.effects';
import { makeDetailActions } from './make-detail.actions';
import { makeDetailFeature } from './make-detail.features';
import { VpicApiService } from '@core/api/vpic-api.service';
import { NotificationService } from '@shared/services/notification.service';
import { VehicleType } from '@domain/vehicle-type.model';
import { VehicleModel } from '@domain/vehicle-model.model';

describe('MakeDetailEffects', () => {
  let effects: MakeDetailEffects;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let actions$: ReplaySubject<any>;
  let store: MockStore;
  let apiSpy: jasmine.SpyObj<VpicApiService>;
  let notificationSpy: jasmine.SpyObj<NotificationService>;

  const types: VehicleType[] = [{ id: 1, name: 'Passenger Car' }];
  const models: VehicleModel[] = [{ id: 10, name: 'Corolla', makeName: 'TOYOTA' }];

  beforeEach(() => {
    actions$ = new ReplaySubject(1);
    apiSpy = jasmine.createSpyObj<VpicApiService>('VpicApiService', [
      'getVehicleTypesForMakeId',
      'getModelsForMakeId',
    ]);
    notificationSpy = jasmine.createSpyObj<NotificationService>('NotificationService', ['error']);

    TestBed.configureTestingModule({
      providers: [
        MakeDetailEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: VpicApiService, useValue: apiSpy },
        { provide: NotificationService, useValue: notificationSpy },
      ],
    });

    effects = TestBed.inject(MakeDetailEffects);
    store = TestBed.inject(MockStore);
  });

  afterEach(() => store.resetSelectors());

  describe('loadMakeDetail$', () => {
    it('dispatches loadMakeDetailSuccess when makeId is not cached', done => {
      store.overrideSelector(makeDetailFeature.selectEntities, {});
      store.refreshState();
      apiSpy.getVehicleTypesForMakeId.and.returnValue(of(types));
      apiSpy.getModelsForMakeId.and.returnValue(of(models));

      effects.loadMakeDetail$.subscribe(action => {
        expect(action).toEqual(
          makeDetailActions.loadMakeDetailSuccess({ makeId: 42, types, models }),
        );
        done();
      });

      actions$.next(makeDetailActions.loadMakeDetail({ makeId: 42 }));
    });

    it('calls the API with the correct makeId', done => {
      store.overrideSelector(makeDetailFeature.selectEntities, {});
      store.refreshState();
      apiSpy.getVehicleTypesForMakeId.and.returnValue(of(types));
      apiSpy.getModelsForMakeId.and.returnValue(of(models));

      effects.loadMakeDetail$.subscribe(() => {
        expect(apiSpy.getVehicleTypesForMakeId).toHaveBeenCalledWith(7);
        expect(apiSpy.getModelsForMakeId).toHaveBeenCalledWith(7);
        done();
      });

      actions$.next(makeDetailActions.loadMakeDetail({ makeId: 7 }));
    });

    it('does not emit when makeId is already cached', done => {
      store.overrideSelector(makeDetailFeature.selectEntities, {
        42: { makeId: 42, types: [], models: [] },
      });
      store.refreshState();

      let emitted = false;
      effects.loadMakeDetail$.subscribe(() => (emitted = true));
      actions$.next(makeDetailActions.loadMakeDetail({ makeId: 42 }));

      setTimeout(() => {
        expect(emitted).toBeFalse();
        expect(apiSpy.getVehicleTypesForMakeId).not.toHaveBeenCalled();
        done();
      }, 0);
    });

    it('dispatches loadMakeDetailFailure when the API call errors', done => {
      store.overrideSelector(makeDetailFeature.selectEntities, {});
      store.refreshState();
      apiSpy.getVehicleTypesForMakeId.and.returnValue(throwError(() => new Error('API down')));
      apiSpy.getModelsForMakeId.and.returnValue(of(models));

      effects.loadMakeDetail$.subscribe(action => {
        expect(action).toEqual(
          makeDetailActions.loadMakeDetailFailure({ makeId: 42, error: 'API down' }),
        );
        done();
      });

      actions$.next(makeDetailActions.loadMakeDetail({ makeId: 42 }));
    });
  });

  describe('notifyError$', () => {
    it('calls notifications.error with the error message', done => {
      effects.notifyError$.subscribe(() => {
        expect(notificationSpy.error).toHaveBeenCalledOnceWith('Load failed');
        done();
      });
      actions$.next(makeDetailActions.loadMakeDetailFailure({ makeId: 1, error: 'Load failed' }));
    });
  });
});
