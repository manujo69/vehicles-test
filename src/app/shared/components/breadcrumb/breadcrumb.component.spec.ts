import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BreadcrumbComponent } from './breadcrumb.component';

describe('BreadcrumbComponent', () => {
  let component: BreadcrumbComponent;
  let fixture: ComponentFixture<BreadcrumbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreadcrumbComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(BreadcrumbComponent);
    component = fixture.componentInstance;
  });

  it('creates with required items input', () => {
    fixture.componentRef.setInput('items', []);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('renders each item label', () => {
    fixture.componentRef.setInput('items', [
      { label: 'Lista de marcas', route: '/makes' },
      { label: 'Toyota' },
    ]);
    fixture.detectChanges();
    const text: string = fixture.nativeElement.textContent;
    expect(text).toContain('Lista de marcas');
    expect(text).toContain('Toyota');
  });

  it('renders a single breadcrumb', () => {
    fixture.componentRef.setInput('items', [{ label: 'Inicio' }]);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Inicio');
  });
});
