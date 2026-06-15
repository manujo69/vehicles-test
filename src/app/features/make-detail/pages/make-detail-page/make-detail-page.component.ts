import {
  ChangeDetectionStrategy, Component, computed, effect, inject, input, numberAttribute,
  signal,
} from '@angular/core';
import { LoadingSpinnerComponent } from '@components/loading-spinner/loading-spinner.component';
import { VehicleTypesListComponent } from '../../components/vehicle-type-list/vehicle-types-list.component';
import { ModelsListComponent } from '../../components/models-list.component/models-list.component';
import { makeDetailFeature } from '../../stores/make-detail.features';
import { Store } from '@ngrx/store';
import { makeDetailActions } from '../../stores/make-detail.actions';
import { BreadcrumbComponent, type BreadcrumbItem } from '@components/breadcrumb/breadcrumb.component';
import { ROUTES } from '@shared/consts/routes.constants';
import { MESSAGES } from '@shared/consts/i18n-messages';
import { VehicleType } from '@domain/vehicle-type.model';

@Component({
  selector: 'app-make-detail-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoadingSpinnerComponent, VehicleTypesListComponent, ModelsListComponent, BreadcrumbComponent],
  templateUrl: './make-detail-page.component.html',
  styleUrl: './make-detail-page.component.scss',
})
export class MakeDetailPageComponent {
  private readonly store = inject(Store);

  // Input Signal for makeId
  makeId = input.required({ transform: numberAttribute });

  protected readonly loading = this.store.selectSignal(makeDetailFeature.selectLoading);

  private readonly entities = this.store.selectSignal(makeDetailFeature.selectEntities);
  protected readonly detail = computed(() => this.entities()[this.makeId()]);

  protected readonly messages = MESSAGES.makeDetail;

  protected readonly selectedType = signal<VehicleType | null>(null);

  protected readonly displayedModels = computed(() => {
    const type = this.selectedType();
    const detail = this.detail();
    if (!detail) return [];
    if (!type) return detail.models;
    return detail.modelsByType[type.name] ?? detail.models;
  });

  onSelectType(type: VehicleType | null): void {
    this.selectedType.set(type);
    if (type) {
      this.store.dispatch(makeDetailActions.loadModelsByType({ makeId: this.makeId(), vehicleType: type.name }));
    }
  }

  protected readonly breadcrumbs = computed<BreadcrumbItem[]>(() => [
    { label: MESSAGES.makeDetail.breadcrumb, route: ROUTES.MAKES_PATH },
    { label: this.detail()?.models[0]?.makeName ?? MESSAGES.makeDetail.breadcrumbFallback },
  ]);

  constructor() {
    effect(() => {
      this.store.dispatch(makeDetailActions.loadMakeDetail({ makeId: this.makeId() }));
    });
  }
}
