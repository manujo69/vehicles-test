import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MakesPageComponent } from './makes-page.component';
import { makesActions } from '../../stores/makes-actions';
import { makesFeature } from '../../stores/makes-features';
import { adapter } from '../../stores/makes-features';
import { MAKES_MOCK } from '@shared/consts/testing.constants';

const initialState = {
  makes: adapter.setAll(MAKES_MOCK, adapter.getInitialState({ filter: '', loading: false, loaded: true, error: null })),
};

describe('MakesPageComponent', () => {
  let component: MakesPageComponent;
  let fixture: ComponentFixture<MakesPageComponent>;
  let store: MockStore;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MakesPageComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideNoopAnimations(),
        provideMockStore({ initialState }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    store.overrideSelector(makesFeature.selectFilteredMakes, MAKES_MOCK);
    store.overrideSelector(makesFeature.selectLoading, false);
    store.overrideSelector(makesFeature.selectFilter, '');

    fixture = TestBed.createComponent(MakesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => store.resetSelectors());

  it('creates successfully', () => {
    expect(component).toBeTruthy();
  });

  it('dispatches loadMakes on init', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(makesActions.loadMakes());
  });

  it('dispatches setFilter when onSearch is called', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    component.onSearch('honda');
    expect(dispatchSpy).toHaveBeenCalledWith(makesActions.setFilter({ searchTerm: 'honda' }));
  });

  it('navigates to /makes/:id when onSelect is called', async () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.onSelect(42);
    expect(navigateSpy).toHaveBeenCalledWith(['/makes', 42]);
  });
});
