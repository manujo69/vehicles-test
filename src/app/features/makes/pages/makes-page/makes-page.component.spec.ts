/**
 * Comportamiento del componente
 *
 * Qué prueba: lo que el usuario ve en el navegador — spinner de carga,
 * listado de marcas y respuesta a interacciones.
 *
 * Qué NO prueba: HTTP real, lógica del adapter, internals del store.
 * El puerto se sustituye por un fake con signals; la red nunca se toca aquí.
 * Si cambias la tecnología de estado, este fichero no debería modificarse.
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
import { Make } from '@domain/make.model';

function fakeMake(over: Partial<Make> = {}): Make {
  return { id: 0, name: '', ...over };
}

function fakePort(over: { makes?: Make[]; loading?: boolean; filter?: string } = {}) {
  return {
    makes: signal(over.makes ?? []),
    loading: signal(over.loading ?? false),
    filter: signal(over.filter ?? ''),
    loadMakes: jasmine.createSpy('loadMakes'),
    setFilter: jasmine.createSpy('setFilter'),
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
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MakesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('triggers loadMakes on init', () => {
    expect(port.loadMakes).toHaveBeenCalled();
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

  it('passes all makes to the list', () => {
    const list = fixture.debugElement.query(By.directive(MakesListComponent));
    expect(list.componentInstance.makes().length).toBe(2);
  });

  it('calls setFilter when onSearch is called', () => {
    component.onSearch('honda');
    expect(port.setFilter).toHaveBeenCalledWith('honda');
  });

  it('navigates to /makes/:id when onSelect is called', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');
    component.onSelect(42);
    expect(navigateSpy).toHaveBeenCalledWith(['/makes', 42]);
  });
});
