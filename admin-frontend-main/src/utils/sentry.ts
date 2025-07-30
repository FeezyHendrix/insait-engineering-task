import * as Sentry from "@sentry/react";
import constants, {  RELEASE_VERSION, ENVIRONMENT, USE_DD } from "./constants";

if(USE_DD) {
  Sentry.init({
    dsn: constants.SENTRY_DSN,
    release: RELEASE_VERSION,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 1.0,
    tracePropagationTargets: [
      /^https:\/\/.*\.insait\.io\/admin/,
      /^https:\/\/.*\.insait-internal\.com\/admin/
    ],
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    environment: ENVIRONMENT,
    beforeSend(event) {
      if (window.location.origin.includes('http://') || ENVIRONMENT === 'na' ) return null;
      return event;
    },
  });
  
  Sentry.setTag("tenant", constants.TENANT);
} else {
  console.log('Using Datadog, skip Sentry init')
}