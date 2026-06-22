import { ChangeDetectionStrategy, Component, computed, effect, inject, input, numberAttribute } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { VpicApiService } from '@core/api/vpic-api.service';
import { NotificationService } from '@shared/services/notification.service';
import { LoadingSpinnerComponent } from '@components/loading-spinner/loading-spinner.component';
import { VehicleTypesListComponent } from '../../components/vehicle-type-list/vehicle-types-list.component';
import { ModelsListComponent } from '../../components/models-list.component/models-list.component';
import { BreadcrumbComponent, type BreadcrumbItem } from '@components/breadcrumb/breadcrumb.component';
import { ROUTES } from '@shared/consts/routes.constants';
import { MESSAGES } from '@shared/consts/i18n-messages';

@Component({
  selector: 'app-make-detail-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoadingSpinnerComponent, VehicleTypesListComponent, ModelsListComponent, BreadcrumbComponent],
  templateUrl: './make-detail-page.component.html',
  styleUrl: './make-detail-page.component.scss',
})
export class MakeDetailPageComponent {
  private readonly api = inject(VpicApiService);
  private readonly notifications = inject(NotificationService);

  makeId = input.required({ transform: numberAttribute });

  protected readonly messages = MESSAGES.makeDetail;

  protected readonly typesQuery = injectQuery(() => ({
    queryKey: ['vehicle-types', this.makeId()],
    queryFn: () => firstValueFrom(this.api.getVehicleTypesForMakeId(this.makeId())),
  }));

  protected readonly modelsQuery = injectQuery(() => ({
    queryKey: ['models', this.makeId()],
    queryFn: () => firstValueFrom(this.api.getModelsForMakeId(this.makeId())),
  }));

  protected readonly loading = computed(() =>
    this.typesQuery.isPending() || this.modelsQuery.isPending(),
  );

  protected readonly breadcrumbs = computed<BreadcrumbItem[]>(() => [
    { label: MESSAGES.makeDetail.breadcrumb, route: ROUTES.MAKES_PATH },
    { label: this.modelsQuery.data()?.[0]?.makeName ?? MESSAGES.makeDetail.breadcrumbFallback },
  ]);

  constructor() {
    effect(() => {
      const typesError = this.typesQuery.error();
      const modelsError = this.modelsQuery.error();
      if (typesError) this.notifications.error((typesError as Error).message);
      if (modelsError) this.notifications.error((modelsError as Error).message);
    });
  }
}
