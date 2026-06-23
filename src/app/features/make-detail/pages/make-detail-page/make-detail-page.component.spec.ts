/**
 * Comportamiento del componente
 *
 * Qué prueba: lo que el usuario ve en el navegador — spinner de carga,
 * datos del detalle y llamadas a loadMakeDetail cuando cambia el input.
 *
 * Qué NO prueba: HTTP real, lógica del store, internals de NgRx.
 * El puerto se sustituye por un fake con signals; la red nunca se toca aquí.
 * Si cambias NgRx por TanStack o SignalStore, este fichero no debería modificarse.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { MakeDetailPageComponent } from './make-detail-page.component';
import { MakeDetailPort } from '../../data/make-detail.port';
import { MakeDetail } from '../../stores/make-detail.store';

function fakeDetail(over: Partial<MakeDetail> = {}): MakeDetail {
  return { makeId: 0, types: [], models: [], ...over };
}

function fakePort(over: { details?: Record<number, MakeDetail>; loading?: boolean } = {}) {
  return {
    loading: signal(over.loading ?? false),
    details: signal(over.details ?? {}),
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

  it('shows the loading spinner while loading is true', () => {
    port.loading.set(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-loading-spinner')).toBeTruthy();
  });

  it('calls loadMakeDetail with the provided makeId on init', () => {
    expect(port.loadMakeDetail).toHaveBeenCalledWith(42);
  });

  it('calls loadMakeDetail with the updated makeId when input changes', () => {
    fixture.componentRef.setInput('makeId', 7);
    fixture.detectChanges();
    expect(port.loadMakeDetail).toHaveBeenCalledWith(7);
  });

  it('shows detail data when the entity is available', () => {
    port.details.set({
      42: fakeDetail({ makeId: 42, models: [{ id: 1, name: 'Corolla', makeName: 'TOYOTA' }] }),
    });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('TOYOTA');
  });
});
