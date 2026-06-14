import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { MakeDetailPageComponent } from './make-detail-page.component';
import { MakeDetailStore, MakeDetail } from '../../stores/make-detail.store';

describe('MakeDetailPageComponent', () => {
  let component: MakeDetailPageComponent;
  let fixture: ComponentFixture<MakeDetailPageComponent>;
  let loadMakeDetailSpy: jasmine.Spy;
  let detailsSignal: ReturnType<typeof signal<Record<number, MakeDetail>>>;
  let loadingSignal: ReturnType<typeof signal<boolean>>;

  beforeEach(async () => {
    detailsSignal = signal<Record<number, MakeDetail>>({});
    loadingSignal = signal<boolean>(false);
    loadMakeDetailSpy = jasmine.createSpy('loadMakeDetail');

    const mockStore = {
      details: detailsSignal.asReadonly(),
      loading: loadingSignal.asReadonly(),
      loadMakeDetail: loadMakeDetailSpy,
    };

    await TestBed.configureTestingModule({
      imports: [MakeDetailPageComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        { provide: MakeDetailStore, useValue: mockStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MakeDetailPageComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('makeId', 42);
    fixture.detectChanges();
  });

  it('creates successfully', () => {
    expect(component).toBeTruthy();
  });

  it('calls loadMakeDetail with the provided makeId on init', () => {
    expect(loadMakeDetailSpy).toHaveBeenCalledWith(42);
  });

  it('calls loadMakeDetail with the updated makeId when input changes', () => {
    fixture.componentRef.setInput('makeId', 7);
    fixture.detectChanges();
    expect(loadMakeDetailSpy).toHaveBeenCalledWith(7);
  });

  it('shows detail data when entity is available', () => {
    detailsSignal.set({
      42: { makeId: 42, types: [], models: [{ id: 1, name: 'Corolla', makeName: 'TOYOTA' }] },
    });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('TOYOTA');
  });
});
