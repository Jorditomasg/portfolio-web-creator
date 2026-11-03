import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { HttpInterceptorFn, ɵHTTP_ROOT_INTERCEPTOR_FNS } from '@angular/common/http';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const backendUrl = process.env['BACKEND_URL'] || 'http://localhost:3000';

const backendUrlInterceptor: HttpInterceptorFn = (req, next) =>
  next(/^\/(api|uploads)(\/|$)/.test(req.url) ? req.clone({ url: backendUrl + req.url }) : req);

const serverConfig: ApplicationConfig = {
  providers: [
    // Root interceptors run after the HTTP transfer cache (key stays relative) and must precede provideServerRendering's relative-URL resolver.
    { provide: ɵHTTP_ROOT_INTERCEPTOR_FNS, useValue: backendUrlInterceptor, multi: true },
    provideServerRendering(withRoutes(serverRoutes)),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
