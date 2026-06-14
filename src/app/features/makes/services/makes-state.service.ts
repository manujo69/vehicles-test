import { Injectable, inject, signal } from '@angular/core';
import { Make } from '@domain/make.model';
import { VpicApiService } from '@core/api/vpic-api.service';

@Injectable({ providedIn: 'root' })
export class MakesStateService {
  private readonly api = inject(VpicApiService);

  readonly makes = signal<Make[]>([]);
  readonly loading = signal(false);
  readonly error = signal<Error | null>(null);

  load(): void {
    if (this.makes().length > 0) return;
    this.loading.set(true);
    this.api.getAllMakes().subscribe({
      next: (makes) => { this.makes.set(makes); this.loading.set(false); },
      error: (err: Error) => { this.error.set(err); this.loading.set(false); },
    });
  }
}
