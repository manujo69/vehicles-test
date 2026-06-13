import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ReplaySubject, of } from 'rxjs';
import { MakeDetailEffects } from './make-detail.effects';
import { makeDetailActions } from './make-detail.actions';
import { makeDetailFeature } from './make-detail.features';
import { VehicleRepositoryPort } from '@core/vehicle-repository.port';
import { NotificationPort } from '@core/notification.port';
import { VehicleType } from '@domain/vehicle-type.model';
import { VehicleModel } from '@domain/vehicle-model.model';

describe('MakeDetailEffects', () => {
  let effects: MakeDetailEffects;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let actions$: ReplaySubject<any>;
  let store: MockStore;
  let repositorySpy: jasmine.SpyObj<VehicleRepositoryPort>;
  let notificationSpy: jasmine.SpyObj<NotificationPort>;

  const types: VehicleType[] = [{ id: 1, name: 'Passenger Car' }];
  const models: VehicleModel[] = [{ id: 10, name: 'Corolla', makeName: 'TOYOTA' }];

  beforeEach(() => {
    actions$ = new ReplaySubject(1);
    repositorySpy = jasmine.createSpyObj<VehicleRepositoryPort>('VehicleRepositoryPort', [
      'getVehicleTypesForMakeId',
      'getModelsForMakeId',
    ]);
    notificationSpy = jasmine.createSpyObj<NotificationPort>('NotificationPort', ['error']);

    TestBed.configureTestingModule({
      providers: [
        MakeDetailEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: VehicleRepositoryPort, useValue: repositorySpy },
        { provide: NotificationPort, useValue: notificationSpy },
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
      repositorySpy.getVehicleTypesForMakeId.and.returnValue(of(types));
      repositorySpy.getModelsForMakeId.and.returnValue(of(models));

      effects.loadMakeDetail$.subscribe(action => {
        expect(action).toEqual(
          makeDetailActions.loadMakeDetailSuccess({ makeId: 42, types, models }),
        );
        done();
      });

      actions$.next(makeDetailActions.loadMakeDetail({ makeId: 42 }));
    });

    it('calls the repository with the correct makeId', done => {
      store.overrideSelector(makeDetailFeature.selectEntities, {});
      store.refreshState();
      repositorySpy.getVehicleTypesForMakeId.and.returnValue(of(types));
      repositorySpy.getModelsForMakeId.and.returnValue(of(models));

      effects.loadMakeDetail$.subscribe(() => {
        expect(repositorySpy.getVehicleTypesForMakeId).toHaveBeenCalledWith(7);
        expect(repositorySpy.getModelsForMakeId).toHaveBeenCalledWith(7);
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
        expect(repositorySpy.getVehicleTypesForMakeId).not.toHaveBeenCalled();
        done();
      }, 0);
    });

  });
});
