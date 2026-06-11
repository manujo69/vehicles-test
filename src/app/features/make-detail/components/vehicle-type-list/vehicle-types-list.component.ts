import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { VehicleType } from '@domain/vehicle-type.model';
import { MESSAGES } from '@shared/consts/i18n-messages';

@Component({
  selector: 'app-vehicle-types-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatListModule],
  templateUrl: './vehicle-types-list.component.html',
})
export class VehicleTypesListComponent {
  types = input.required<VehicleType[]>();
  protected readonly messages = MESSAGES.makeDetail;
}
