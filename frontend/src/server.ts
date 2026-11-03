import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { request } from 'node:http';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();
const backendUrl = process.env['BACKEND_URL'] || 'http://localhost:3000';

app.use(['/api', '/uploads'], (req, res) => {
  const proxy = request(
    new URL(req.originalUrl, backendUrl),
    { method: req.method, headers: req.headers },
    (backendRes) => {
      res.writeHead(backendRes.statusCode ?? 502, backendRes.headers);
      backendRes.pipe(res);
    },
  );
  proxy.on('error', () => (res.headersSent ? res.destroy() : res.sendStatus(502)));
  req.pipe(proxy);
});

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4200;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);
