import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { VehicleType } from '@domain/vehicle-type.model';
import { MESSAGES } from '@shared/consts/i18n-messages';

@Component({
  selector: 'app-vehicle-types-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatListModule, NgClass],
  templateUrl: './vehicle-types-list.component.html',
  styleUrl: './vehicle-types-list.component.scss',
})
export class VehicleTypesListComponent {
  types = input.required<VehicleType[]>();
  protected readonly messages = MESSAGES.makeDetail;

  protected readonly selectTypeOutput = output<VehicleType | null>();
  selectType = signal<number | null>(null);

  onSelectType(typeId: number): void {
    if (this.selectType() === typeId) {
      this.selectType.set(null);
      this.selectTypeOutput.emit(null);
      return;
    }
    const type = this.types().find(t => t.id === typeId)!;
    this.selectType.set(typeId);
    this.selectTypeOutput.emit(type);
  }
}
