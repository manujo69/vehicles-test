import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MakeDetailPageComponent } from './make-detail-page.component';
import { makeDetailActions } from '../../stores/make-detail.actions';
import { makeDetailFeature } from '../../stores/make-detail.features';
import { adapter } from '../../stores/make-detail.features';

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
      42: { makeId: 42, types: [], models: [{ id: 1, name: 'Corolla', makeName: 'TOYOTA' }] },
    });
    store.refreshState();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('TOYOTA');
  });
});
