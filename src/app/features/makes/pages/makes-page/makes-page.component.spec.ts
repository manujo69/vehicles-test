import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideAngularQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { Signal } from '@angular/core';
import { NEVER, of, throwError } from 'rxjs';
import { MakesPageComponent } from './makes-page.component';
import { NotificationService } from '@shared/services/notification.service';
import { VpicApiService } from '@core/api/vpic-api.service';
import { MAKES_MOCK } from '@shared/consts/testing.constants';
import { Make } from '@domain/make.model';

interface TestableMakesPage {
  filter: Signal<string>;
  makes: Signal<Make[]>;
}

describe('MakesPageComponent', () => {
  let component: MakesPageComponent;
  let fixture: ComponentFixture<MakesPageComponent>;
  let router: Router;
  let apiSpy: jasmine.SpyObj<VpicApiService>;
  let queryClient: QueryClient;
  let testable: TestableMakesPage;

  beforeEach(async () => {
    apiSpy = jasmine.createSpyObj('VpicApiService', ['getAllMakes']);
    apiSpy.getAllMakes.and.returnValue(of(MAKES_MOCK));

    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    await TestBed.configureTestingModule({
      imports: [MakesPageComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        provideAngularQuery(client),
        { provide: VpicApiService, useValue: apiSpy },
      ],
    }).compileComponents();

    queryClient = TestBed.inject(QueryClient);
    queryClient.setQueryData(['makes'], MAKES_MOCK);

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(MakesPageComponent);
    component = fixture.componentInstance;
    testable = component as unknown as TestableMakesPage;
    fixture.detectChanges();
  });

  it('crea el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('actualiza el filtro cuando se llama a onSearch', () => {
    component.onSearch('honda');
    expect(testable.filter()).toBe('honda');
  });

  it('filtra las marcas por el término de búsqueda', () => {
    component.onSearch('toyota');
    const filtered = testable.makes();
    expect(filtered.every((m: Make) => m.name.toLowerCase().includes('toyota'))).toBeTrue();
  });

  it('devuelve todas las marcas cuando el filtro está vacío', () => {
    expect(testable.makes().length).toBe(MAKES_MOCK.length);
  });

  it('navega a /makes/:id cuando se llama a onSelect', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.onSelect(42);
    expect(navigateSpy).toHaveBeenCalledWith(['/makes', 42]);
  });

});

describe('MakesPageComponent - sin datos precargados', () => {
  let testable: TestableMakesPage;

  beforeEach(async () => {
    const pendingApiSpy = jasmine.createSpyObj<VpicApiService>('VpicApiService', ['getAllMakes']);
    pendingApiSpy.getAllMakes.and.returnValue(NEVER);

    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    await TestBed.configureTestingModule({
      imports: [MakesPageComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        provideAngularQuery(client),
        { provide: VpicApiService, useValue: pendingApiSpy },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(MakesPageComponent);
    const component = fixture.componentInstance;
    testable = component as unknown as TestableMakesPage;
    fixture.detectChanges();
  });

  it('devuelve array vacío cuando la query no tiene datos', () => {
    expect(testable.makes()).toEqual([]);
  });
});

describe('MakesPageComponent - manejo de errores', () => {
  let notificationsService: NotificationService;
  let errorFixture: ComponentFixture<MakesPageComponent>;

  beforeEach(async () => {
    const errorApiSpy = jasmine.createSpyObj<VpicApiService>('VpicApiService', ['getAllMakes']);
    errorApiSpy.getAllMakes.and.returnValue(throwError(() => new Error('API error')));

    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    await TestBed.configureTestingModule({
      imports: [MakesPageComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        provideAngularQuery(client),
        { provide: VpicApiService, useValue: errorApiSpy },
      ],
    }).compileComponents();

    notificationsService = TestBed.inject(NotificationService);
    spyOn(notificationsService, 'error');
    errorFixture = TestBed.createComponent(MakesPageComponent);
    errorFixture.detectChanges();
  });

  it('notifica el error cuando la query de marcas falla', async () => {
    await new Promise(r => setTimeout(r, 0));
    await new Promise(r => setTimeout(r, 0));
    errorFixture.detectChanges();
    expect(notificationsService.error).toHaveBeenCalledWith('API error');
  });
});
