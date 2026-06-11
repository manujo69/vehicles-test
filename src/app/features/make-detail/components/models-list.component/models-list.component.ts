import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { VehicleModel } from '@domain/vehicle-model.model';
import { MESSAGES } from '@shared/consts/i18n-messages';

@Component({
  selector: 'app-models-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScrollingModule],
  templateUrl: './models-list.component.html',
  styleUrl: './models-list.component.scss',
})
export class ModelsListComponent {
  models = input.required<VehicleModel[]>();
  protected readonly messages = MESSAGES.makeDetail;

  protected trackById = (_: number, model: VehicleModel) => model.id;
}
