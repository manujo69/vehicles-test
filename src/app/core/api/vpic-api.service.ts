// core/api/vpic-api.service.ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Make } from '@domain/make.model';
import { VehicleType } from '@domain/vehicle-type.model';
import { VehicleModel } from '@domain/vehicle-model.model';
import { MakeDto, ModelDto, VehicleTypeDto, VpicResponse } from './vpic.dto';
import { environment } from '../../../environments/environment';

const BASE_URL = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class VpicApiService {
  private readonly http = inject(HttpClient);

  getAllMakes(): Observable<Make[]> {
    return this.get<MakeDto>('GetAllMakes').pipe(
      map(data => data.map(item => ({ id: item.Make_ID, name: item.Make_Name }))),
    );
  }

  getVehicleTypesForMakeId(makeId: number): Observable<VehicleType[]> {
    return this.get<VehicleTypeDto>(`GetVehicleTypesForMakeId/${makeId}`).pipe(
      map(data => data.map(item => ({ id: item.VehicleTypeId, name: item.VehicleTypeName }))),
    );
  }

  getModelsForMakeId(makeId: number): Observable<VehicleModel[]> {
    return this.get<ModelDto>(`GetModelsForMakeId/${makeId}`).pipe(
      map(data => data.map(item => ({ id: item.Model_ID, name: item.Model_Name, makeName: item.Make_Name }))),
    );
  }

  getModelsForMakeIdAndVehicleType(makeId: number, vehicleType: string): Observable<VehicleModel[]> {
    return this.get<ModelDto>(`GetModelsForMakeIdYear/makeId/${makeId}/vehicleType/${encodeURIComponent(vehicleType)}`).pipe(
      map(data => data.map(item => ({ id: item.Model_ID, name: item.Model_Name, makeName: item.Make_Name }))),
    );
  }

  private get<T>(path: string): Observable<T[]> {
    return this.http
      .get<VpicResponse<T>>(`${BASE_URL}/${path}`, { params: { format: 'json' } })
      .pipe(map(res => res.Results));
  }
}
