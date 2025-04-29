export enum BACKEND_URL {
  'local' = 'http://localhost:8080',
  'prod' = 'https://rmourato-dev.dynip.sapo.pt',
}

export enum FRONTEND_HOSTNAME {
  'local' = 'localhost',
  'prod' = 'rmourato-dev.dynip.sapo.pt',
}

const baseUrl = 'file-manager/api';

const URL_MAP = {
  [FRONTEND_HOSTNAME.local]: BACKEND_URL.local,
  [FRONTEND_HOSTNAME.prod]: BACKEND_URL.prod,
};

let backendUrl = '';

export function getBackendUrl(): string {
  if (!backendUrl) {
    const hostname = window.location.hostname as FRONTEND_HOSTNAME;
    const url = URL_MAP[hostname];
    backendUrl = url ? `${url}/${baseUrl}` : `${BACKEND_URL.prod}/`;
  }
  return backendUrl;
}
