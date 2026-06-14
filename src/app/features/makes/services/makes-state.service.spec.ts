import { TestBed, fakeAsync, flushMicrotasks } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { MakesStateService } from './makes-state.service';
import { VpicApiService } from '@core/api/vpic-api.service';
import { MAKES_MOCK } from '@shared/consts/testing.constants';

describe('MakesStateService', () => {
  let service: MakesStateService;
  let apiSpy: jasmine.SpyObj<VpicApiService>;

  beforeEach(() => {
    apiSpy = jasmine.createSpyObj('VpicApiService', ['getAllMakes']);
    apiSpy.getAllMakes.and.returnValue(of(MAKES_MOCK));

    TestBed.configureTestingModule({
      providers: [
        MakesStateService,
        { provide: VpicApiService, useValue: apiSpy },
      ],
    });

    service = TestBed.inject(MakesStateService);
  });

  it('carga makes y apaga loading al recibir datos', fakeAsync(() => {
    service.load();
    flushMicrotasks();

    expect(service.makes()).toEqual(MAKES_MOCK);
    expect(service.loading()).toBeFalse();
    expect(service.error()).toBeNull();
  }));

  it('no realiza una nueva petición si ya hay makes cargados', fakeAsync(() => {
    service.load();
    flushMicrotasks();
    service.load();

    expect(apiSpy.getAllMakes).toHaveBeenCalledTimes(1);
  }));

  it('registra el error y apaga loading cuando la API falla', fakeAsync(() => {
    const err = new Error('fallo de red');
    apiSpy.getAllMakes.and.returnValue(throwError(() => err));

    service.load();
    flushMicrotasks();

    expect(service.error()).toBe(err);
    expect(service.loading()).toBeFalse();
  }));
});
