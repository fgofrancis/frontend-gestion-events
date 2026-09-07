import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

import { environment } from '../../../environments/environment';

// const PUBLIC_PATHS = ['http://localhost:4200/api/v1/auth/login', 'http://localhost:4200/api/v1/auth/register'];

const PUBLIC_PATHS = [
  `${environment.apiUrl}/auth/login`,
  `${environment.apiUrl}/auth/register`
];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isPublic = PUBLIC_PATHS.some((path) => req.url.includes(path));
  const token = authService.getToken();

  const authReq = !isPublic && token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error) => {
      if (!isPublic && (error.status === 401 || error.status === 403)) {
        authService.logout();
        router.navigate(['/auth/login'], { queryParams: { returnUrl: router.url } });
      }
      return throwError(() => error);
    }),
  );
};
