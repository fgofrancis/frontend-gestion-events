
import {
  HttpInterceptorFn,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 403) {
        console.error('Acceso denegado:', error.error);
        alert(error.error.message);
      }
      if (error.status === 401) {
        console.error('No autenticado:', error.error);
        alert('Tu sesión ha expirado o no estás autenticado');
      }
      return throwError(() => error);
    })
  );
};

