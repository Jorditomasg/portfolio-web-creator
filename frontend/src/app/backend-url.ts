export function toBackendUrl(url: string, origin: string, backendUrl: string): string {
  const target = new URL(url, origin);
  const ownApi = target.origin === origin && /^\/(api|uploads)(\/|$)/.test(target.pathname);
  return ownApi ? backendUrl + target.pathname + target.search : url;
}
