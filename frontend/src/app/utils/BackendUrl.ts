export enum ENV {
  LOCAL = 'local',
  INTERNAL = 'internal',
  PROD = 'prod1',
}

type DOMAIN = 'localhost' | '192.168.1.100' | 'rmourato-dev.dynip.sapo.pt';

const BACKEND_URL = {
  [ENV.LOCAL]: 'http://localhost:8081',
  [ENV.INTERNAL]: 'http://192.168.1.100',
  [ENV.PROD]: 'https://rmourato-dev.dynip.sapo.pt/file-manager-250',
};

const ENV_BY_FRONTEND_HOSTNAME: { [k in DOMAIN]: ENV } = {
  localhost: ENV.LOCAL,
  '192.168.1.100': ENV.INTERNAL,
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
