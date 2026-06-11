import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { VpicApiService } from './vpic-api.service';
import { Make } from '../../domain/make.model';
import { VehicleType } from '../../domain/vehicle-type.model';
import { VehicleModel } from '../../domain/vehicle-model.model';

const BASE_URL = 'https://vpic.nhtsa.dot.gov/api/vehicles';

describe('VpicApiService', () => {
  let service: VpicApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(VpicApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  describe('getAllMakes', () => {
    it('maps Make_ID and Make_Name to domain model', () => {
      let result: Make[] = [];
      service.getAllMakes().subscribe(m => (result = m));

      const req = httpMock.expectOne(r => r.url === `${BASE_URL}/GetAllMakes`);
      req.flush({ Results: [{ Make_ID: 1, Make_Name: 'TOYOTA' }, { Make_ID: 2, Make_Name: 'HONDA' }] });

      expect(result).toEqual([
        { id: 1, name: 'TOYOTA' },
        { id: 2, name: 'HONDA' },
      ]);
    });

    it('passes format=json query param', () => {
      service.getAllMakes().subscribe();
      const req = httpMock.expectOne(r => r.url === `${BASE_URL}/GetAllMakes`);
      expect(req.request.params.get('format')).toBe('json');
      req.flush({ Results: [] });
    });

    it('returns empty array when Results is empty', () => {
      let result: Make[] = [{ id: 1, name: 'x' }];
      service.getAllMakes().subscribe(m => (result = m));
      httpMock.expectOne(r => r.url === `${BASE_URL}/GetAllMakes`).flush({ Results: [] });
      expect(result).toEqual([]);
    });
  });

  describe('getVehicleTypesForMakeId', () => {
    it('maps VehicleTypeId and VehicleTypeName to domain model', () => {
      let result: VehicleType[] = [];
      service.getVehicleTypesForMakeId(99).subscribe(t => (result = t));

      const req = httpMock.expectOne(r => r.url === `${BASE_URL}/GetVehicleTypesForMakeId/99`);
      req.flush({ Results: [{ VehicleTypeId: 5, VehicleTypeName: 'Truck' }] });

      expect(result).toEqual([{ id: 5, name: 'Truck' }]);
    });

    it('builds URL with the correct makeId', () => {
      service.getVehicleTypesForMakeId(42).subscribe();
      const req = httpMock.expectOne(r => r.url === `${BASE_URL}/GetVehicleTypesForMakeId/42`);
      req.flush({ Results: [] });
      expect(req.request.url).toContain('42');
    });
  });

  describe('getModelsForMakeId', () => {
    it('maps Model_ID, Model_Name and Make_Name to domain model', () => {
      let result: VehicleModel[] = [];
      service.getModelsForMakeId(42).subscribe(m => (result = m));

      const req = httpMock.expectOne(r => r.url === `${BASE_URL}/GetModelsForMakeId/42`);
      req.flush({
        Results: [{ Make_ID: 42, Make_Name: 'HONDA', Model_ID: 7, Model_Name: 'Civic' }],
      });

      expect(result).toEqual([{ id: 7, name: 'Civic', makeName: 'HONDA' }]);
    });

    it('maps multiple models correctly', () => {
      let result: VehicleModel[] = [];
      service.getModelsForMakeId(1).subscribe(m => (result = m));

      httpMock.expectOne(r => r.url === `${BASE_URL}/GetModelsForMakeId/1`).flush({
        Results: [
          { Make_ID: 1, Make_Name: 'TOYOTA', Model_ID: 10, Model_Name: 'Corolla' },
          { Make_ID: 1, Make_Name: 'TOYOTA', Model_ID: 11, Model_Name: 'Camry' },
        ],
      });

      expect(result.length).toBe(2);
      expect(result[0]).toEqual({ id: 10, name: 'Corolla', makeName: 'TOYOTA' });
      expect(result[1]).toEqual({ id: 11, name: 'Camry', makeName: 'TOYOTA' });
    });
  });
});
