import { mergeApplicationConfig, ApplicationConfig, Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FetchBackend, HttpBackend, HttpRequest } from '@angular/common/http';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { toBackendUrl } from './backend-url';

const backendUrl = process.env['BACKEND_URL'] || 'http://localhost:3000';

@Injectable()
class BackendUrlBackend implements HttpBackend {
  private fetch = inject(FetchBackend);
  private origin = inject(DOCUMENT).location.origin;

  handle(req: HttpRequest<unknown>) {
    return this.fetch.handle(req.clone({ url: toBackendUrl(req.url, this.origin, backendUrl) }));
  }
}

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    FetchBackend,
    { provide: HttpBackend, useClass: BackendUrlBackend },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
