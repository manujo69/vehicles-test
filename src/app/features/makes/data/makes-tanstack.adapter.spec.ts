/**
 * Tests del adapter
 *
 * Qué prueba: que el adapter cumple el contrato del puerto — expone las marcas
 * como signals, gestiona loading y error, y dispara las peticiones HTTP correctas.
 * Usa HttpTestingController; no hay red real.
 *
 * Qué NO prueba: lo que el componente hace con esos datos (eso va en component.spec.ts).
 */
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideAngularQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { MakesPort } from './makes.port';
import { MakesTanStackAdapter } from './makes-tanstack.adapter';

const MAKES_API_RESPONSE = {
  Count: 2,
  Message: 'Response returned successfully',
  SearchCriteria: null,
  Results: [
    { Make_ID: 1, Make_Name: 'TOYOTA' },
    { Make_ID: 2, Make_Name: 'HONDA' },
  ],
};

describe('MakesTanStackAdapter', () => {
  let port: MakesPort;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAngularQuery(client),
        MakesTanStackAdapter,
        { provide: MakesPort, useExisting: MakesTanStackAdapter },
      ],
    });

    port = TestBed.inject(MakesPort);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('exposes makes after a successful HTTP response', async () => {
    await new Promise(r => setTimeout(r, 0));
    httpMock.expectOne(req => req.url.includes('GetAllMakes')).flush(MAKES_API_RESPONSE);
    await new Promise(r => setTimeout(r, 0));
    await new Promise(r => setTimeout(r, 0));

    expect(port.makes().length).toBe(2);
    expect(port.makes()[0].name).toBe('TOYOTA');
    expect(port.loading()).toBe(false);
    expect(port.error()).toBeNull();
  });

  it('sets loading() to true while the request is in flight', async () => {
    await new Promise(r => setTimeout(r, 0));
    expect(port.loading()).toBe(true);
    httpMock.expectOne(req => req.url.includes('GetAllMakes')).flush(MAKES_API_RESPONSE);
  });

  it('captures the error message and clears loading on HTTP failure', async () => {
    await new Promise(r => setTimeout(r, 0));
    httpMock
      .expectOne(req => req.url.includes('GetAllMakes'))
      .flush('Server Error', { status: 500, statusText: 'Server Error' });
    await new Promise(r => setTimeout(r, 0));
    await new Promise(r => setTimeout(r, 0));

    expect(port.error()).not.toBeNull();
    expect(port.loading()).toBe(false);
  });
});
