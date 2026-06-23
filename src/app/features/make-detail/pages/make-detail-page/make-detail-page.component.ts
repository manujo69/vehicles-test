import {
  ChangeDetectionStrategy, Component, computed, effect, inject, input, numberAttribute,
} from '@angular/core';
import { LoadingSpinnerComponent } from '@components/loading-spinner/loading-spinner.component';
import { VehicleTypesListComponent } from '../../components/vehicle-type-list/vehicle-types-list.component';
import { ModelsListComponent } from '../../components/models-list.component/models-list.component';
import { MakeDetailPort } from '../../data/make-detail.port';
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
  private readonly port = inject(MakeDetailPort);

  makeId = input.required({ transform: numberAttribute });

  protected readonly loading = this.port.loading;
  protected readonly detail = this.port.detail;
  protected readonly messages = MESSAGES.makeDetail;

  protected readonly breadcrumbs = computed<BreadcrumbItem[]>(() => [
    { label: MESSAGES.makeDetail.breadcrumb, route: ROUTES.MAKES_PATH },
    { label: this.detail()?.models[0]?.makeName ?? MESSAGES.makeDetail.breadcrumbFallback },
  ]);

  constructor() {
    effect(() => {
      this.port.loadMakeDetail(this.makeId());
    });
  }
}
