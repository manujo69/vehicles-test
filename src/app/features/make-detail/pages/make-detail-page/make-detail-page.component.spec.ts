import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MakeDetailPageComponent } from './make-detail-page.component';
import { makeDetailActions } from '../../stores/make-detail.actions';
import { makeDetailFeature } from '../../stores/make-detail.features';
import { adapter } from '../../stores/make-detail.features';
import { VehicleType } from '@domain/vehicle-type.model';
import { VehicleModel } from '@domain/vehicle-model.model';

const initialState = {
  makeDetail: adapter.getInitialState({ loading: false, error: null }),
};

describe('MakeDetailPageComponent', () => {
  let component: MakeDetailPageComponent;
  let fixture: ComponentFixture<MakeDetailPageComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MakeDetailPageComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        provideMockStore({ initialState }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(makeDetailFeature.selectEntities, {});
    store.overrideSelector(makeDetailFeature.selectLoading, false);

    fixture = TestBed.createComponent(MakeDetailPageComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('makeId', 42);
    fixture.detectChanges();
  });

  afterEach(() => store.resetSelectors());

  it('creates successfully', () => {
    expect(component).toBeTruthy();
  });

  it('dispatches loadMakeDetail with the provided makeId on init', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    fixture.componentRef.setInput('makeId', 7);
    fixture.detectChanges();
    expect(dispatchSpy).toHaveBeenCalledWith(makeDetailActions.loadMakeDetail({ makeId: 7 }));
  });

  it('shows detail data when the entity is available in the store', () => {
    store.overrideSelector(makeDetailFeature.selectEntities, {
      42: { makeId: 42, types: [], models: [{ id: 1, name: 'Corolla', makeName: 'TOYOTA' }], modelsByType: {} },
    });
    store.refreshState();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('TOYOTA');
  });

  it('onSelectType dispatches loadModelsByType when a type is provided', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    const type: VehicleType = { id: 1, name: 'Passenger Car' };

    component.onSelectType(type);

    expect(dispatchSpy).toHaveBeenCalledWith(
      makeDetailActions.loadModelsByType({ makeId: 42, vehicleType: 'Passenger Car' }),
    );
  });

  it('onSelectType with null does not dispatch', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    component.onSelectType(null);
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('displayedModels returns models filtered by modelsByType when a type is selected', () => {
    const filteredModels: VehicleModel[] = [{ id: 5, name: 'Corolla', makeName: 'TOYOTA' }];
    store.overrideSelector(makeDetailFeature.selectEntities, {
      42: {
        makeId: 42,
        types: [{ id: 1, name: 'Passenger Car' }],
        models: [{ id: 5, name: 'Corolla', makeName: 'TOYOTA' }, { id: 6, name: 'Civic', makeName: 'HONDA' }],
        modelsByType: { 'Passenger Car': filteredModels },
      },
    });
    store.refreshState();

    component.onSelectType({ id: 1, name: 'Passenger Car' });

    expect(component['displayedModels']()).toEqual(filteredModels);
  });

  it('displayedModels falls back to all models when modelsByType has no entry for the selected type', () => {
    const allModels: VehicleModel[] = [{ id: 5, name: 'Corolla', makeName: 'TOYOTA' }];
    store.overrideSelector(makeDetailFeature.selectEntities, {
      42: { makeId: 42, types: [], models: allModels, modelsByType: {} },
    });
    store.refreshState();

    component.onSelectType({ id: 1, name: 'Truck' });

    expect(component['displayedModels']()).toEqual(allModels);
  });
});
