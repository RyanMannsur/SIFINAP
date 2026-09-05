import { HttpInterceptorFn } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return next(req);
  }

  if (!req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }

  const sessionRaw = window.localStorage.getItem('openfeed.auth.session');
  if (!sessionRaw) {
    return next(req);
  }

  try {
    const session = JSON.parse(sessionRaw) as { token?: string };
    if (!session.token) {
      return next(req);
    }

    return next(req.clone({
      setHeaders: {
        Authorization: `Bearer ${session.token}`
      }
    }));
  } catch {
    return next(req);
  }
};