import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ModelsListComponent } from './models-list.component';
import { VehicleModel } from '@domain/vehicle-model.model';

describe('ModelsListComponent', () => {
  let component: ModelsListComponent;
  let fixture: ComponentFixture<ModelsListComponent>;

  const models: VehicleModel[] = [
    { id: 1, name: 'Corolla', makeName: 'TOYOTA' },
    { id: 2, name: 'Civic', makeName: 'HONDA' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModelsListComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(ModelsListComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('models', models);
    fixture.detectChanges();
  });

  it('creates successfully', () => {
    expect(component).toBeTruthy();
  });

  it('creates with an empty models list', () => {
    fixture.componentRef.setInput('models', []);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('trackById returns the model id', () => {
    const model: VehicleModel = { id: 99, name: 'Camry', makeName: 'TOYOTA' };
    expect(component['trackById'](0, model)).toBe(99);
  });
});
