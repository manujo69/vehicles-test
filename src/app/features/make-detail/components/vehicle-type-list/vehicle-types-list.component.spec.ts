import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleTypesListComponent } from './vehicle-types-list.component';
import { VehicleType } from '@domain/vehicle-type.model';

describe('VehicleTypesListComponent', () => {
  let component: VehicleTypesListComponent;
  let fixture: ComponentFixture<VehicleTypesListComponent>;

  const types: VehicleType[] = [
    { id: 1, name: 'Passenger Car' },
    { id: 2, name: 'Truck' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleTypesListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleTypesListComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('types', types);
    fixture.detectChanges();
  });

  it('creates successfully', () => {
    expect(component).toBeTruthy();
  });

  it('creates with an empty types list', () => {
    fixture.componentRef.setInput('types', []);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('renders the vehicle type names', () => {
    const text: string = fixture.nativeElement.textContent;
    expect(text).toContain('Passenger Car');
    expect(text).toContain('Truck');
  });

  describe('onSelectType', () => {
    it('selects a type and emits it via selectTypeOutput', () => {
      const emitted: (VehicleType | null)[] = [];
      component['selectTypeOutput'].subscribe((v: VehicleType | null) => emitted.push(v));

      component.onSelectType(1);

      expect(component.selectType()).toBe(1);
      expect(emitted).toEqual([{ id: 1, name: 'Passenger Car' }]);
    });

    it('deselects the type and emits null when the same id is selected twice', () => {
      const emitted: (VehicleType | null)[] = [];
      component['selectTypeOutput'].subscribe((v: VehicleType | null) => emitted.push(v));

      component.onSelectType(1);
      component.onSelectType(1);

      expect(component.selectType()).toBeNull();
      expect(emitted).toEqual([{ id: 1, name: 'Passenger Car' }, null]);
    });

    it('switches selection from one type to another', () => {
      component.onSelectType(1);
      component.onSelectType(2);

      expect(component.selectType()).toBe(2);
    });
  });
});
