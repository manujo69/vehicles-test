import { Injectable, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { VpicApiService } from '@core/api/vpic-api.service';
import { VehicleType } from '@domain/vehicle-type.model';
import { VehicleModel } from '@domain/vehicle-model.model';

@Injectable({ providedIn: 'root' })
export class MakeDetailStateService {
  private readonly api = inject(VpicApiService);
  private readonly loadedId = signal<number | null>(null);

  readonly detail = signal<{ types: VehicleType[]; models: VehicleModel[] } | null>(null);
  readonly loading = signal(false);
  readonly error = signal<Error | null>(null);

  load(makeId: number): void {
    if (this.loadedId() === makeId) return;
    this.detail.set(null);
    this.loading.set(true);
    forkJoin({
      types: this.api.getVehicleTypesForMakeId(makeId),
      models: this.api.getModelsForMakeId(makeId),
    }).subscribe({
      next: (data) => { this.detail.set(data); this.loadedId.set(makeId); this.loading.set(false); },
      error: (err: Error) => { this.error.set(err); this.loading.set(false); },
    });
  }
}
