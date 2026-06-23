/**
 * Comportamiento del componente
 *
 * Qué prueba: lo que el usuario ve en el navegador — spinner de carga,
 * listado de marcas, filtrado por búsqueda, navegación y notificación de errores.
 *
 * Qué NO prueba: HTTP real, lógica del adapter, internals de TanStack.
 * El puerto se sustituye por un fake con signals; la red nunca se toca aquí.
 * Si cambias TanStack por NgRx o SignalStore, este fichero no debería modificarse.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MakesPageComponent } from './makes-page.component';
import { MakesPort } from '../../data/makes.port';
import { MakesListComponent } from '../../components/makes-list.component/makes-list.component';
import { NotificationService } from '@shared/services/notification.service';
import { Make } from '@domain/make.model';

function fakeMake(over: Partial<Make> = {}): Make {
  return { id: 0, name: '', ...over };
}

function fakePort(over: { makes?: Make[]; loading?: boolean; error?: string | null } = {}) {
  return {
    makes: signal(over.makes ?? []),
    loading: signal(over.loading ?? false),
    error: signal(over.error ?? null),
  };
}

describe('MakesPageComponent', () => {
  let fixture: ComponentFixture<MakesPageComponent>;
  let component: MakesPageComponent;
  let port: ReturnType<typeof fakePort>;

  beforeEach(async () => {
    port = fakePort({
      makes: [
        fakeMake({ id: 1, name: 'TOYOTA' }),
        fakeMake({ id: 2, name: 'HONDA' }),
      ],
    });

    await TestBed.configureTestingModule({
      imports: [MakesPageComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        { provide: MakesPort, useValue: port },
        { provide: NotificationService, useValue: jasmine.createSpyObj('NotificationService', ['error']) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MakesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('shows the loading spinner while loading is true', () => {
    port.loading.set(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-loading-spinner')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('app-makes-list')).toBeNull();
  });

  it('shows the makes list when loading is false', () => {
    expect(fixture.nativeElement.querySelector('app-makes-list')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('app-loading-spinner')).toBeNull();
  });

  it('passes all makes to the list when the filter is empty', () => {
    const list = fixture.debugElement.query(By.directive(MakesListComponent));
    expect(list.componentInstance.makes().length).toBe(2);
  });

  it('filters makes by the search term', () => {
    component.onSearch('toyota');
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.directive(MakesListComponent));
    const filtered: Make[] = list.componentInstance.makes();
    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('TOYOTA');
  });

  it('shows all makes again when the search term is cleared', () => {
    component.onSearch('toyota');
    fixture.detectChanges();
    component.onSearch('');
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.directive(MakesListComponent));
    expect(list.componentInstance.makes().length).toBe(2);
  });

  it('navigates to /makes/:id when onSelect is called', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');
    component.onSelect(42);
    expect(navigateSpy).toHaveBeenCalledWith(['/makes', 42]);
  });

  it('notifies the user when port.error() is set', async () => {
    const notifications = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    port.error.set('Network failure');
    fixture.detectChanges();
    await new Promise(r => setTimeout(r, 0));
    expect(notifications.error).toHaveBeenCalledWith('Network failure');
  });
});
