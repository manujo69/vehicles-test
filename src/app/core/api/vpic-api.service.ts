import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Make } from '@domain/make.model';
import { VehicleType } from '@domain/vehicle-type.model';
import { VehicleModel } from '@domain/vehicle-model.model';
import { MakeDto, ModelDto, VehicleTypeDto, VpicResponse } from './vpic.dto';
import { toMake, toVehicleModel, toVehicleType } from './vpic-api.adapters';
import { VpicApiPort } from './vpic-api.port';
import { environment } from '../../../environments/environment';

const BASE_URL = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class VpicApiService extends VpicApiPort {
  private readonly http = inject(HttpClient);

  getAllMakes(): Observable<Make[]> {
    return this.get<MakeDto>('GetAllMakes').pipe(map(data => data.map(toMake)));
  }

  getVehicleTypesForMakeId(makeId: number): Observable<VehicleType[]> {
    return this.get<VehicleTypeDto>(`GetVehicleTypesForMakeId/${makeId}`).pipe(
      map(data => data.map(toVehicleType)),
    );
  }

  getModelsForMakeId(makeId: number): Observable<VehicleModel[]> {
    return this.get<ModelDto>(`GetModelsForMakeId/${makeId}`).pipe(
      map(data => data.map(toVehicleModel)),
    );
  }

  private get<T>(path: string): Observable<T[]> {
    return this.http
      .get<VpicResponse<T>>(`${BASE_URL}/${path}`, { params: { format: 'json' } })
      .pipe(map(res => res.Results));
  }
}
