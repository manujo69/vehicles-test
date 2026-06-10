// features/make-detail/components/vehicle-types-list/vehicle-types-list.component.ts
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { VehicleType } from '../../../../domain/vehicle-type.model';

@Component({
  selector: 'app-vehicle-types-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatListModule],
  templateUrl: './vehicle-types-list.component.html',
})
export class VehicleTypesListComponent {
  types = input.required<VehicleType[]>();
}
