// core/interceptors/error.interceptor.ts
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const message =
        error.status === 0
          ? 'No se pudo conectar con el servidor.'
          : `Error ${error.status}: ${error.statusText || 'respuesta inesperada'}`;

      console.error(`[HTTP] ${req.method} ${req.urlWithParams}`, error);
      return throwError(() => new Error(message));
    }),
  );
