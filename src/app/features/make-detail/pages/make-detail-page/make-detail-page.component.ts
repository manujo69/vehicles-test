import {
  ChangeDetectionStrategy, Component, computed, effect, inject, input, numberAttribute,
} from '@angular/core';
import { LoadingSpinnerComponent } from '@components/loading-spinner/loading-spinner.component';
import { VehicleTypesListComponent } from '../../components/vehicle-type-list/vehicle-types-list.component';
import { ModelsListComponent } from '../../components/models-list.component/models-list.component';
import { makeDetailFeature } from '../../stores/make-detail.features';
import { Store } from '@ngrx/store';
import { makeDetailActions } from '../../stores/make-detail.actions';
import { BreadcrumbComponent, type BreadcrumbItem } from '@components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-make-detail-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoadingSpinnerComponent, VehicleTypesListComponent, ModelsListComponent, BreadcrumbComponent],
  templateUrl: './make-detail-page.component.html',
  styleUrl: './make-detail-page.component.scss',
})
export class MakeDetailPageComponent {
  private readonly store = inject(Store);

  makeId = input.required({ transform: numberAttribute });

  private readonly entities = this.store.selectSignal(makeDetailFeature.selectEntities);
  protected readonly loading = this.store.selectSignal(makeDetailFeature.selectLoading);
  protected readonly detail = computed(() => this.entities()[this.makeId()]);

  protected readonly breadcrumbs = computed<BreadcrumbItem[]>(() => [
    { label: 'Lista de marcas', route: '/makes' },
    { label: this.detail()?.models[0]?.makeName ?? 'Detalle' },
  ]);

  constructor() {
    effect(() => {
      this.store.dispatch(makeDetailActions.loadMakeDetail({ makeId: this.makeId() }));
    });
  }
}
