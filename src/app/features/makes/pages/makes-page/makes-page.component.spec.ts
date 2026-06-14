import { ComponentFixture, fakeAsync, flushMicrotasks, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { MakesPageComponent } from './makes-page.component';
import { VpicApiService } from '@core/api/vpic-api.service';
import { NotificationService } from '@shared/services/notification.service';
import { MAKES_MOCK } from '@shared/consts/testing.constants';
import { Make } from '@domain/make.model';

describe('MakesPageComponent', () => {
  let component: MakesPageComponent;
  let fixture: ComponentFixture<MakesPageComponent>;
  let router: Router;
  let apiSpy: jasmine.SpyObj<VpicApiService>;
  let notificationSpy: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    apiSpy = jasmine.createSpyObj('VpicApiService', ['getAllMakes']);
    notificationSpy = jasmine.createSpyObj('NotificationService', ['error']);
    apiSpy.getAllMakes.and.returnValue(of(MAKES_MOCK));

    await TestBed.configureTestingModule({
      imports: [MakesPageComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        { provide: VpicApiService, useValue: apiSpy },
        { provide: NotificationService, useValue: notificationSpy },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    // Fixture is NOT created here — each test (or nested beforeEach) creates it
    // after the spy is in the desired state, because load() runs in the constructor.
  });

  function createComponent() {
    fixture = TestBed.createComponent(MakesPageComponent);
    component = fixture.componentInstance;
  }

  it('creates successfully', () => {
    createComponent();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('fetches makes on init', () => {
    createComponent();
    fixture.detectChanges();
    expect(apiSpy.getAllMakes).toHaveBeenCalled();
  });

  it('navigates to /makes/:id when onSelect is called', () => {
    const navigateSpy = spyOn(router, 'navigate');
    createComponent();
    fixture.detectChanges();
    component.onSelect(42);
    expect(navigateSpy).toHaveBeenCalledWith(['/makes', 42]);
  });

  it('filters makes when onSearch is called', () => {
    createComponent();
    fixture.detectChanges();
    component.onSearch('honda');
    const filtered = (component as unknown as { makes: () => Make[] }).makes();
    expect(filtered).toEqual([{ id: 2, name: 'HONDA' }]);
  });

  describe('on API error', () => {
    beforeEach(() => {
      apiSpy.getAllMakes.and.returnValue(throwError(() => new Error('Network error')));
      createComponent(); // Create AFTER setting the error spy
    });

    it('notifies on error', fakeAsync(() => {
      fixture.detectChanges();
      flushMicrotasks();
      expect(notificationSpy.error).toHaveBeenCalledWith('Network error');
    }));
  });
});
