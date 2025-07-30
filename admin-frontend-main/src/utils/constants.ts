export const MODE = import.meta.env.MODE
export const isProduction = import.meta.env.MODE === 'production'

export const VITE_MODE = import.meta.env.VITE_MODE
export const isDev = MODE === 'development' && VITE_MODE === 'development';

const HOSTNAME = window.location.hostname
const BACKEND_PORT = import.meta.env.VITE_BACKEND_PORT || 5050
const AGENT_BACKEND_PORT = import.meta.env.VITE_AGENT_BACKEND_PORT || 5000
const AGENT_FRONTEND_PORT = import.meta.env.VITE_AGENT_FRONTEND_PORT || 3000

export const MSW_ENABLED = import.meta.env.VITE_MSW_ENABLED === "true" || window.location.href.includes('demo-agent.insait') || window.location.href.includes('ness.insait') || false
export const IS_MOBILE = window.innerWidth <= 768;
export const MAX_PIE_CHART_ITEMS = 8;

type ConstantsType = {
  [key: string]: string
}

const constants: ConstantsType = {
  CONFIGURATION_API_URL: import.meta.env.VITE_CONFIGURATION_API_URL,
  KEYCLOAK_URL: import.meta.env.VITE_KEYCLOAK_URL || 'https://auth.tel-aviv.insait-internal.com',
  BACKEND_URL:
    import.meta.env.VITE_BACKEND_URL ? import.meta.env.VITE_BACKEND_URL :
    isProduction 
      ? `https://${HOSTNAME}/admin/api`
      : `http://${HOSTNAME}:${BACKEND_PORT}`,
  AGENT_BACKEND_URL:
    isProduction
      ? `https://${HOSTNAME}/api`
      : `http://${HOSTNAME}:${AGENT_BACKEND_PORT}`,
  AGENT_INSAIT_INIT_URL:
  isProduction
      ? `https://${HOSTNAME}/bot/insait.js`
      : `http://${HOSTNAME}:${AGENT_FRONTEND_PORT}/insait.js`,
  AGENT_INSAIT_BOT_URL:
  isProduction
      ? `https://${HOSTNAME}/bot/`
      : `http://${HOSTNAME}:${AGENT_FRONTEND_PORT}/`,
  TENANT: import.meta.env.VITE_TENANT || location.hostname.split('.')[0],
  BASENAME: import.meta.env.VITE_BASENAME,
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
  DD_APP_ID: import.meta.env.VITE_DD_APP_ID,
  DD_CLIENT_TOKEN: import.meta.env.VITE_DD_CLIENT_TOKEN
}

if (isProduction) {
  Object.keys(constants).forEach((key) => {
    constants[key] = window._env_[key] ? window._env_[key] : constants[key]
  })
}

export default constants
export const supportTicketCommentDimensions = {
  charactersPerLine: 50,
  maxRows: 10,
}

export const USE_DD = !!(
  constants.DD_APP_ID &&
  constants.DD_CLIENT_TOKEN &&
  constants.DD_APP_ID !== 'null' &&
  constants.DD_CLIENT_TOKEN !== 'null'
);

export const RELEASE_VERSION = import.meta.env.VITE_RELEASE_VERSION

const getEnvironment = (hostname: string): string => {
  if (hostname.includes("insait.io")) {
    return "production";
  } else if (hostname.includes("insait-internal.com")) {
    return "staging";
  } else {
    return 'na'; 
  }
};
export const ENVIRONMENT = getEnvironment(HOSTNAME);