// features/make-detail/components/models-list/models-list.component.ts
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { VehicleModel } from '../../../../domain/vehicle-model.model';

@Component({
  selector: 'app-models-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScrollingModule],
  templateUrl: './models-list.component.html',
  styleUrl: './models-list.component.scss',
})
export class ModelsListComponent {
  models = input.required<VehicleModel[]>();

  protected trackById = (_: number, model: VehicleModel) => model.id;
}
