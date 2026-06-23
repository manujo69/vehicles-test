import { Observable } from 'rxjs';
import { Make } from '@domain/make.model';
import { VehicleType } from '@domain/vehicle-type.model';
import { VehicleModel } from '@domain/vehicle-model.model';

export abstract class VpicApiPort {
  abstract getAllMakes(): Observable<Make[]>;
  abstract getVehicleTypesForMakeId(makeId: number): Observable<VehicleType[]>;
  abstract getModelsForMakeId(makeId: number): Observable<VehicleModel[]>;
}
