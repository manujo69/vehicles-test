import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideAngularQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { of, throwError } from 'rxjs';
import { MakeDetailPageComponent } from './make-detail-page.component';
import { NotificationService } from '@shared/services/notification.service';
import { MESSAGES } from '@shared/consts/i18n-messages';
import { VpicApiService } from '@core/api/vpic-api.service';
import { VehicleType } from '@domain/vehicle-type.model';
import { VehicleModel } from '@domain/vehicle-model.model';

const TYPES_MOCK: VehicleType[] = [{ id: 1, name: 'Passenger Car' }];
const MODELS_MOCK: VehicleModel[] = [{ id: 101, name: 'Corolla', makeName: 'TOYOTA' }];

interface TestableMakeDetail {
  typesQuery: { data: () => VehicleType[] };
  modelsQuery: { data: () => VehicleModel[] };
  breadcrumbs: () => { label: string }[];
}

describe('MakeDetailPageComponent', () => {
  let component: MakeDetailPageComponent;
  let fixture: ComponentFixture<MakeDetailPageComponent>;
  let apiSpy: jasmine.SpyObj<VpicApiService>;
  let queryClient: QueryClient;

  beforeEach(async () => {
    apiSpy = jasmine.createSpyObj('VpicApiService', [
      'getVehicleTypesForMakeId',
      'getModelsForMakeId',
    ]);
    apiSpy.getVehicleTypesForMakeId.and.returnValue(of(TYPES_MOCK));
    apiSpy.getModelsForMakeId.and.returnValue(of(MODELS_MOCK));

    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    await TestBed.configureTestingModule({
      imports: [MakeDetailPageComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        provideAngularQuery(client),
        { provide: VpicApiService, useValue: apiSpy },
      ],
    }).compileComponents();

    queryClient = TestBed.inject(QueryClient);
    queryClient.setQueryData(['vehicle-types', 42], TYPES_MOCK);
    queryClient.setQueryData(['models', 42], MODELS_MOCK);

    fixture = TestBed.createComponent(MakeDetailPageComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('makeId', 42);
    fixture.detectChanges();
  });

  it('crea el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('inicia la consulta con el makeId correcto', () => {
    const c = component as unknown as TestableMakeDetail;
    expect(c.typesQuery.data()).toEqual(TYPES_MOCK);
    expect(c.modelsQuery.data()).toEqual(MODELS_MOCK);
  });

  it('muestra los datos una vez resueltas las queries', () => {
    expect(fixture.nativeElement.textContent).toContain('TOYOTA');
  });

  it('vuelve a consultar cuando cambia el makeId', async () => {
    fixture.componentRef.setInput('makeId', 7);
    fixture.detectChanges();
    await new Promise((r) => setTimeout(r, 0));
    expect(apiSpy.getVehicleTypesForMakeId).toHaveBeenCalledWith(7);
    expect(apiSpy.getModelsForMakeId).toHaveBeenCalledWith(7);
  });

  it('usa el texto de fallback en breadcrumb cuando no hay modelos', async () => {
    queryClient.setQueryData(['models', 42], []);
    await new Promise(r => setTimeout(r, 0));
    const c = component as unknown as TestableMakeDetail;
    expect(c.breadcrumbs()[1].label).toBe(MESSAGES.makeDetail.breadcrumbFallback);
  });
});

describe('MakeDetailPageComponent - manejo de errores', () => {
  let notificationsService: NotificationService;
  let errorFixture: ComponentFixture<MakeDetailPageComponent>;

  beforeEach(async () => {
    const errorApiSpy = jasmine.createSpyObj<VpicApiService>('VpicApiService', [
      'getVehicleTypesForMakeId',
      'getModelsForMakeId',
    ]);
    errorApiSpy.getVehicleTypesForMakeId.and.returnValue(throwError(() => new Error('types error')));
    errorApiSpy.getModelsForMakeId.and.returnValue(throwError(() => new Error('models error')));

    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    await TestBed.configureTestingModule({
      imports: [MakeDetailPageComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        provideAngularQuery(client),
        { provide: VpicApiService, useValue: errorApiSpy },
      ],
    }).compileComponents();

    notificationsService = TestBed.inject(NotificationService);
    spyOn(notificationsService, 'error');
    errorFixture = TestBed.createComponent(MakeDetailPageComponent);
    errorFixture.componentRef.setInput('makeId', 1);
    errorFixture.detectChanges();
  });

  it('notifica el error cuando la query de tipos de vehículo falla', async () => {
    await new Promise(r => setTimeout(r, 0));
    await new Promise(r => setTimeout(r, 0));
    errorFixture.detectChanges();
    expect(notificationsService.error).toHaveBeenCalledWith('types error');
  });

  it('notifica el error cuando la query de modelos falla', async () => {
    await new Promise(r => setTimeout(r, 0));
    await new Promise(r => setTimeout(r, 0));
    errorFixture.detectChanges();
    expect(notificationsService.error).toHaveBeenCalledWith('models error');
  });
});
