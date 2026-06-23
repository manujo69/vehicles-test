import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { Make } from '@domain/make.model';
import { VehicleType } from '@domain/vehicle-type.model';
import { VehicleModel } from '@domain/vehicle-model.model';
import { VpicApiPort } from './vpic-api.port';

const MOCK_DELAY_MS = 600;

const MAKES: Make[] = [
  { id: 1, name: 'TOYOTA' },
  { id: 2, name: 'HONDA' },
  { id: 3, name: 'BMW' },
  { id: 4, name: 'FORD' },
  { id: 5, name: 'CHEVROLET' },
];

const VEHICLE_TYPES: VehicleType[] = [
  { id: 2, name: 'Passenger Car' },
  { id: 3, name: 'Truck' },
  { id: 5, name: 'Bus' },
  { id: 7, name: 'Multipurpose Passenger Vehicle (MPV)' },
];

const MODELS_BY_MAKE: Record<number, VehicleModel[]> = {
  1: [
    { id: 1861, name: 'Corolla', makeName: 'TOYOTA' },
    { id: 1862, name: 'Camry', makeName: 'TOYOTA' },
    { id: 1863, name: 'RAV4', makeName: 'TOYOTA' },
  ],
  2: [
    { id: 1871, name: 'Civic', makeName: 'HONDA' },
    { id: 1872, name: 'Accord', makeName: 'HONDA' },
    { id: 1873, name: 'CR-V', makeName: 'HONDA' },
  ],
  3: [
    { id: 1881, name: '3 Series', makeName: 'BMW' },
    { id: 1882, name: '5 Series', makeName: 'BMW' },
    { id: 1883, name: 'X5', makeName: 'BMW' },
  ],
  4: [
    { id: 1891, name: 'F-150', makeName: 'FORD' },
    { id: 1892, name: 'Mustang', makeName: 'FORD' },
    { id: 1893, name: 'Explorer', makeName: 'FORD' },
  ],
  5: [
    { id: 1901, name: 'Silverado', makeName: 'CHEVROLET' },
    { id: 1902, name: 'Equinox', makeName: 'CHEVROLET' },
    { id: 1903, name: 'Malibu', makeName: 'CHEVROLET' },
  ],
};

@Injectable()
export class VpicApiMockService extends VpicApiPort {
  getAllMakes(): Observable<Make[]> {
    return of(MAKES).pipe(delay(MOCK_DELAY_MS));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getVehicleTypesForMakeId(_makeId: number): Observable<VehicleType[]> {
    return of(VEHICLE_TYPES).pipe(delay(MOCK_DELAY_MS));
  }

  getModelsForMakeId(makeId: number): Observable<VehicleModel[]> {
    return of(MODELS_BY_MAKE[makeId] ?? []).pipe(delay(MOCK_DELAY_MS));
  }
}
