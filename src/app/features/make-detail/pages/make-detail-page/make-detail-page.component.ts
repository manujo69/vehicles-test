import {
  ChangeDetectionStrategy, Component, computed, effect, inject, input, numberAttribute,
} from '@angular/core';
import { LoadingSpinnerComponent } from '@components/loading-spinner/loading-spinner.component';
import { VehicleTypesListComponent } from '../../components/vehicle-type-list/vehicle-types-list.component';
import { ModelsListComponent } from '../../components/models-list.component/models-list.component';
import { BreadcrumbComponent, type BreadcrumbItem } from '@components/breadcrumb/breadcrumb.component';
import { ROUTES } from '@shared/consts/routes.constants';
import { MESSAGES } from '@shared/consts/i18n-messages';
import { MakeDetailStateService } from '../../services/make-detail-state.service';
import { NotificationService } from '@shared/services/notification.service';

@Component({
  selector: 'app-make-detail-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoadingSpinnerComponent, VehicleTypesListComponent, ModelsListComponent, BreadcrumbComponent],
  templateUrl: './make-detail-page.component.html',
  styleUrl: './make-detail-page.component.scss',
})
export class MakeDetailPageComponent {
  private readonly state = inject(MakeDetailStateService);
  private readonly notifications = inject(NotificationService);

  makeId = input.required({ transform: numberAttribute });

  protected readonly messages = MESSAGES.makeDetail;
  protected readonly loading = this.state.loading;
  protected readonly detail = this.state.detail;

  protected readonly breadcrumbs = computed<BreadcrumbItem[]>(() => [
    { label: MESSAGES.makeDetail.breadcrumb, route: ROUTES.MAKES_PATH },
    { label: this.state.detail()?.models[0]?.makeName ?? MESSAGES.makeDetail.breadcrumbFallback },
  ]);

  constructor() {
    effect(() => { this.state.load(this.makeId()); });
    effect(() => {
      const error = this.state.error();
      if (error) this.notifications.error(error.message);
    });
  }
}
