import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { MakeDetailStore } from './make-detail.store';
import { VpicApiService } from '@core/api/vpic-api.service';
import { NotificationService } from '@shared/services/notification.service';
import { VehicleType } from '@domain/vehicle-type.model';
import { VehicleModel } from '@domain/vehicle-model.model';

const types: VehicleType[] = [{ id: 1, name: 'Passenger Car' }];
const models: VehicleModel[] = [{ id: 10, name: 'Corolla', makeName: 'TOYOTA' }];

describe('MakeDetailStore', () => {
  let store: InstanceType<typeof MakeDetailStore>;
  let apiSpy: jasmine.SpyObj<VpicApiService>;
  let notificationSpy: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    apiSpy = jasmine.createSpyObj<VpicApiService>('VpicApiService', [
      'getVehicleTypesForMakeId',
      'getModelsForMakeId',
    ]);
    notificationSpy = jasmine.createSpyObj<NotificationService>('NotificationService', ['error']);

    TestBed.configureTestingModule({
      providers: [
        MakeDetailStore,
        { provide: VpicApiService, useValue: apiSpy },
        { provide: NotificationService, useValue: notificationSpy },
      ],
    });

    store = TestBed.inject(MakeDetailStore);
  });

  it('has correct initial state', () => {
    expect(store.details()).toEqual({});
    expect(store.loading()).toBeFalse();
    expect(store.error()).toBeNull();
  });

  describe('loadMakeDetail()', () => {
    it('loads detail for the given makeId', fakeAsync(() => {
      apiSpy.getVehicleTypesForMakeId.and.returnValue(of(types));
      apiSpy.getModelsForMakeId.and.returnValue(of(models));

      store.loadMakeDetail(42);
      tick();

      expect(store.details()[42]).toEqual({ makeId: 42, types, models });
      expect(store.loading()).toBeFalse();
    }));

    it('calls the API with the correct makeId', fakeAsync(() => {
      apiSpy.getVehicleTypesForMakeId.and.returnValue(of(types));
      apiSpy.getModelsForMakeId.and.returnValue(of(models));

      store.loadMakeDetail(7);
      tick();

      expect(apiSpy.getVehicleTypesForMakeId).toHaveBeenCalledWith(7);
      expect(apiSpy.getModelsForMakeId).toHaveBeenCalledWith(7);
    }));

    it('does not call API when makeId is already cached', fakeAsync(() => {
      apiSpy.getVehicleTypesForMakeId.and.returnValue(of(types));
      apiSpy.getModelsForMakeId.and.returnValue(of(models));

      store.loadMakeDetail(42);
      tick();
      store.loadMakeDetail(42);
      tick();

      expect(apiSpy.getVehicleTypesForMakeId).toHaveBeenCalledTimes(1);
    }));

    it('preserves other cached entries when loading a new makeId', fakeAsync(() => {
      apiSpy.getVehicleTypesForMakeId.and.returnValue(of([]));
      apiSpy.getModelsForMakeId.and.returnValue(of([]));

      store.loadMakeDetail(1);
      tick();
      store.loadMakeDetail(2);
      tick();

      expect(store.details()[1]).toBeDefined();
      expect(store.details()[2]).toBeDefined();
    }));

    it('sets error and notifies on failure', fakeAsync(() => {
      apiSpy.getVehicleTypesForMakeId.and.returnValue(throwError(() => new Error('API error')));
      apiSpy.getModelsForMakeId.and.returnValue(of([]));

      store.loadMakeDetail(99);
      tick();

      expect(store.error()).toBe('API error');
      expect(notificationSpy.error).toHaveBeenCalledWith('API error');
    }));
  });
});
