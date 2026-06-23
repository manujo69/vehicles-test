/**
 * Comportamiento del componente
 *
 * Qué prueba: lo que el usuario ve en el navegador — spinner de carga,
 * contenido del detalle y respuesta a interacciones.
 *
 * Qué NO prueba: HTTP real, lógica del adapter, internals del store.
 * El puerto se sustituye por un fake con signals; la red nunca se toca aquí.
 * Si cambias la tecnología de estado, este fichero no debería modificarse.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { MakeDetailPageComponent } from './make-detail-page.component';
import { MakeDetailPort } from '../../data/make-detail.port';
import { MakeDetail } from '../../stores/make-detail.features';

function fakePort(over: { loading?: boolean; detail?: MakeDetail } = {}) {
  return {
    loading: signal(over.loading ?? false),
    detail: signal<MakeDetail | undefined>(over.detail),
    loadMakeDetail: jasmine.createSpy('loadMakeDetail'),
  };
}

describe('MakeDetailPageComponent', () => {
  let fixture: ComponentFixture<MakeDetailPageComponent>;
  let port: ReturnType<typeof fakePort>;

  beforeEach(async () => {
    port = fakePort();

    await TestBed.configureTestingModule({
      imports: [MakeDetailPageComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        { provide: MakeDetailPort, useValue: port },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MakeDetailPageComponent);
    fixture.componentRef.setInput('makeId', 42);
    fixture.detectChanges();
  });

  it('calls loadMakeDetail with the provided makeId', () => {
    expect(port.loadMakeDetail).toHaveBeenCalledWith(42);
  });

  it('calls loadMakeDetail again when makeId changes', () => {
    fixture.componentRef.setInput('makeId', 7);
    fixture.detectChanges();
    expect(port.loadMakeDetail).toHaveBeenCalledWith(7);
  });

  it('shows the loading spinner while loading is true', () => {
    port.loading.set(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-loading-spinner')).toBeTruthy();
  });

  it('shows detail content when detail is available', () => {
    port.detail.set({
      makeId: 42,
      types: [],
      models: [{ id: 1, name: 'Corolla', makeName: 'TOYOTA' }],
    });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('TOYOTA');
  });

  it('shows nothing when loading is false and detail is undefined', () => {
    expect(fixture.nativeElement.querySelector('app-loading-spinner')).toBeNull();
    expect(fixture.nativeElement.querySelector('app-breadcrumb')).toBeNull();
  });
});
