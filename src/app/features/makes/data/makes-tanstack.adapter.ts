import { computed, inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { VpicApiService } from '@core/api/vpic-api.service';
import { MakesPort } from './makes.port';

@Injectable()
export class MakesTanStackAdapter extends MakesPort {
  private readonly api = inject(VpicApiService);

  private readonly query = injectQuery(() => ({
    queryKey: ['makes'] as const,
    queryFn: () => firstValueFrom(this.api.getAllMakes()),
  }));

  readonly makes = computed(() => this.query.data() ?? []);
  readonly loading = computed(() => this.query.isPending());
  readonly error = computed(() => {
    const err = this.query.error();
    if (!err) return null;
    return err instanceof Error ? err.message : String(err);
  });
}
