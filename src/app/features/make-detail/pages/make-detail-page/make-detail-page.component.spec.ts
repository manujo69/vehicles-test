import { ComponentFixture, fakeAsync, flushMicrotasks, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { MakeDetailPageComponent } from './make-detail-page.component';
import { MakeDetailStateService } from '../../services/make-detail-state.service';
import { VpicApiService } from '@core/api/vpic-api.service';
import { NotificationService } from '@shared/services/notification.service';
import { MESSAGES } from '@shared/consts/i18n-messages';
import { BreadcrumbItem } from '@components/breadcrumb/breadcrumb.component';

const types = [{ id: 1, name: 'Passenger Car' }];
const models = [{ id: 1, name: 'Corolla', makeName: 'TOYOTA' }];

describe('MakeDetailPageComponent', () => {
  let component: MakeDetailPageComponent;
  let fixture: ComponentFixture<MakeDetailPageComponent>;
  let apiSpy: jasmine.SpyObj<VpicApiService>;
  let notificationSpy: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    apiSpy = jasmine.createSpyObj('VpicApiService', ['getVehicleTypesForMakeId', 'getModelsForMakeId']);
    notificationSpy = jasmine.createSpyObj('NotificationService', ['error']);
    apiSpy.getVehicleTypesForMakeId.and.returnValue(of(types));
    apiSpy.getModelsForMakeId.and.returnValue(of(models));

    await TestBed.configureTestingModule({
      imports: [MakeDetailPageComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        { provide: VpicApiService, useValue: apiSpy },
        { provide: NotificationService, useValue: notificationSpy },
      ],
    }).compileComponents();

    TestBed.inject(MakeDetailStateService);
    fixture = TestBed.createComponent(MakeDetailPageComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('makeId', 42);
  });

  it('usa texto de reserva en breadcrumb mientras el detalle no está cargado', () => {
    // No detectChanges → detail() es null → el ?? activa el fallback
    const breadcrumbs = (component as unknown as { breadcrumbs: () => BreadcrumbItem[] }).breadcrumbs();
    expect(breadcrumbs[1].label).toBe(MESSAGES.makeDetail.breadcrumbFallback);
  });

  it('creates successfully', fakeAsync(() => {
    fixture.detectChanges();
    flushMicrotasks();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  }));

  it('fetches detail with the correct makeId', fakeAsync(() => {
    fixture.detectChanges();
    flushMicrotasks();
    expect(apiSpy.getVehicleTypesForMakeId).toHaveBeenCalledWith(42);
    expect(apiSpy.getModelsForMakeId).toHaveBeenCalledWith(42);
  }));

  it('shows detail data when loaded', fakeAsync(() => {
    fixture.detectChanges();
    flushMicrotasks();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('TOYOTA');
  }));

  it('refetches when makeId input changes', fakeAsync(() => {
    fixture.detectChanges();
    flushMicrotasks();
    fixture.detectChanges();

    fixture.componentRef.setInput('makeId', 7);
    fixture.detectChanges();
    flushMicrotasks();
    fixture.detectChanges();

    expect(apiSpy.getVehicleTypesForMakeId).toHaveBeenCalledWith(7);
  }));

  describe('on API error', () => {
    beforeEach(() => {
      apiSpy.getVehicleTypesForMakeId.and.returnValue(throwError(() => new Error('API error')));
    });

    it('notifies on error', fakeAsync(() => {
      fixture.detectChanges();
      flushMicrotasks();
      fixture.detectChanges();
      expect(notificationSpy.error).toHaveBeenCalledWith('API error');
    }));
  });
});
