import { TestBed, fakeAsync, flushMicrotasks } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { MakeDetailStateService } from './make-detail-state.service';
import { VpicApiService } from '@core/api/vpic-api.service';

const types = [{ id: 1, name: 'Passenger Car' }];
const models = [{ id: 1, name: 'Corolla', makeName: 'TOYOTA' }];

describe('MakeDetailStateService', () => {
  let service: MakeDetailStateService;
  let apiSpy: jasmine.SpyObj<VpicApiService>;

  beforeEach(() => {
    apiSpy = jasmine.createSpyObj('VpicApiService', [
      'getVehicleTypesForMakeId',
      'getModelsForMakeId',
    ]);
    apiSpy.getVehicleTypesForMakeId.and.returnValue(of(types));
    apiSpy.getModelsForMakeId.and.returnValue(of(models));

    TestBed.configureTestingModule({
      providers: [
        MakeDetailStateService,
        { provide: VpicApiService, useValue: apiSpy },
      ],
    });

    service = TestBed.inject(MakeDetailStateService);
  });

  it('carga detail y apaga loading al recibir datos', fakeAsync(() => {
    service.load(42);
    flushMicrotasks();

    expect(service.detail()).toEqual({ types, models });
    expect(service.loading()).toBeFalse();
    expect(service.error()).toBeNull();
  }));

  it('no realiza peticiones si se llama con el mismo makeId dos veces', fakeAsync(() => {
    service.load(42);
    flushMicrotasks();
    service.load(42);

    expect(apiSpy.getVehicleTypesForMakeId).toHaveBeenCalledTimes(1);
    expect(apiSpy.getModelsForMakeId).toHaveBeenCalledTimes(1);
  }));

  it('realiza nueva petición al cambiar el makeId', fakeAsync(() => {
    service.load(42);
    flushMicrotasks();
    service.load(7);
    flushMicrotasks();

    expect(apiSpy.getVehicleTypesForMakeId).toHaveBeenCalledWith(42);
    expect(apiSpy.getVehicleTypesForMakeId).toHaveBeenCalledWith(7);
  }));

  it('registra el error y apaga loading cuando la API falla', fakeAsync(() => {
    const err = new Error('fallo de red');
    apiSpy.getVehicleTypesForMakeId.and.returnValue(throwError(() => err));

    service.load(42);
    flushMicrotasks();

    expect(service.error()).toBe(err);
    expect(service.loading()).toBeFalse();
    expect(service.detail()).toBeNull();
  }));
});
