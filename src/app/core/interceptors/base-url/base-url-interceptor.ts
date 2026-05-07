import { HttpInterceptorFn } from '@angular/common/http';

import { environment } from '@environments/environment';
import { BYPASS_BASE_URL } from './base-url-tokens';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const isAbsolute = /^(?:[a-z+]+:)?\/\//i.test(req.url);
  const shouldBypass = req.context.get(BYPASS_BASE_URL);

  if (isAbsolute || shouldBypass) {
    return next(req);
  }

  const apiReq = req.clone({
    url: `${environment.apiUrl}${req.url}`,
  });

  return next(apiReq);
};
