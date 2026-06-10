import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleTypesListComponent } from './vehicle-types-list.component';

describe('VehicleTypesListComponent', () => {
  let component: VehicleTypesListComponent;
  let fixture: ComponentFixture<VehicleTypesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleTypesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleTypesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
