export enum ENV {
  LOCAL = 'local',
  INTERNAL = 'internal',
  PROD = 'prod1',
}

type DOMAIN =
  | 'localhost'
  | 'file-manager-server'
  | 'rmourato-dev.dynip.sapo.pt';

const BACKEND_URL = {
  [ENV.LOCAL]: 'http://localhost:8080',
  [ENV.INTERNAL]: 'http://file-manager-server:8080',
  [ENV.PROD]: 'https://rmourato-dev.dynip.sapo.pt',
};

const ENV_BY_FRONTEND_HOSTNAME: { [k in DOMAIN]: ENV } = {
  localhost: ENV.LOCAL,
  'file-manager-server': ENV.INTERNAL,
  'rmourato-dev.dynip.sapo.pt': ENV.PROD,
};

const baseUrl = 'file-manager/api';

let backendUrl = '';

export function getBackendUrl(env: ENV): string {
  if (!backendUrl) {
    backendUrl = `${BACKEND_URL[env]}/${baseUrl}`;
  }
  return backendUrl;
}

export function getEnv(): ENV {
  const hostname = window.location.hostname;
  if (Object.keys(ENV_BY_FRONTEND_HOSTNAME).includes(hostname)) {
    return ENV_BY_FRONTEND_HOSTNAME[hostname as DOMAIN];
  }
  return ENV.PROD;
}
