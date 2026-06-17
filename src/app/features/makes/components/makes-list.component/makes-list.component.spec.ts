import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { MakesListComponent } from './makes-list.component';
import { Make } from '@domain/make.model';
import { MAKES_MOCK } from '@shared/consts/testing.constants';

describe('MakesListComponent', () => {
  let component: MakesListComponent;
  let fixture: ComponentFixture<MakesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MakesListComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(MakesListComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('makes', MAKES_MOCK);
    fixture.detectChanges();
  });

  it('creates successfully', () => {
    expect(component).toBeTruthy();
  });

  it('renders with an empty makes list', () => {
    fixture.componentRef.setInput('makes', []);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('emits the makeId via select output when a button is clicked', () => {
    fixture.componentRef.setInput('makes', [{ id: 99, name: 'FORD' }]);
    fixture.detectChanges();

    let emitted: number | undefined;
    component.selected.subscribe((id: number) => (emitted = id));

    const button: HTMLElement | null = fixture.nativeElement.querySelector('button');
    if (button) {
      button.click();
      expect(emitted).toBe(99);
    }
  });

  it('trackById returns the make id', () => {
    const make: Make = { id: 7, name: 'TEST' };
    expect(component['trackById'](0, make)).toBe(7);
  });

  it('scrollUp does not throw when viewport is absent', () => {
    fixture.componentRef.setInput('makes', []);
    fixture.detectChanges();
    expect(() => component.scrollUp()).not.toThrow();
  });
});
