import { toBackendUrl } from './backend-url';

describe('toBackendUrl', () => {
  const origin = 'https://jorditomas.es';
  const backend = 'http://backend:3000';

  it('sends own /api and /uploads to the backend, keeping the query', () => {
    expect(toBackendUrl('https://jorditomas.es/api/projects?x=1', origin, backend)).toBe('http://backend:3000/api/projects?x=1');
    expect(toBackendUrl('/uploads/a.png', origin, backend)).toBe('http://backend:3000/uploads/a.png');
  });

  it('leaves other paths and other hosts untouched', () => {
    expect(toBackendUrl('https://jorditomas.es/apis', origin, backend)).toBe('https://jorditomas.es/apis');
    expect(toBackendUrl('https://api.github.com/api/repos', origin, backend)).toBe('https://api.github.com/api/repos');
  });
});
