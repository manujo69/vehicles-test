import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { MakesPageComponent } from './makes-page.component';
import { MakesStore } from '../../stores/makes.store';
import { MAKES_MOCK } from '@shared/consts/testing.constants';
import { Make } from '@domain/make.model';

describe('MakesPageComponent', () => {
  let component: MakesPageComponent;
  let fixture: ComponentFixture<MakesPageComponent>;
  let router: Router;
  let loadMakesSpy: jasmine.Spy;
  let setFilterSpy: jasmine.Spy;
  let filteredMakesSignal: ReturnType<typeof signal<Make[]>>;
  let loadingSignal: ReturnType<typeof signal<boolean>>;
  let filterSignal: ReturnType<typeof signal<string>>;

  beforeEach(async () => {
    filteredMakesSignal = signal<Make[]>(MAKES_MOCK);
    loadingSignal = signal<boolean>(false);
    filterSignal = signal<string>('');
    loadMakesSpy = jasmine.createSpy('loadMakes');
    setFilterSpy = jasmine.createSpy('setFilter');

    const mockStore = {
      filteredMakes: filteredMakesSignal.asReadonly(),
      loading: loadingSignal.asReadonly(),
      filter: filterSignal.asReadonly(),
      loadMakes: loadMakesSpy,
      setFilter: setFilterSpy,
    };

    await TestBed.configureTestingModule({
      imports: [MakesPageComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        { provide: MakesStore, useValue: mockStore },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(MakesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates successfully', () => {
    expect(component).toBeTruthy();
  });

  it('calls loadMakes on init', () => {
    expect(loadMakesSpy).toHaveBeenCalled();
  });

  it('calls setFilter when onSearch is called', () => {
    component.onSearch('honda');
    expect(setFilterSpy).toHaveBeenCalledWith('honda');
  });

  it('navigates to /makes/:id when onSelect is called', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.onSelect(42);
    expect(navigateSpy).toHaveBeenCalledWith(['/makes', 42]);
  });
});
