import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import { setUser } from '@sentry/node';
import { Application } from "express";
import constants from "./constants";
import logger from "./libs/pino";

class SentryManager {
  private initialized: boolean;
  constructor() {
    if (!constants.SENTRY_DSN || constants.RUN_MODE !== "PRODUCTION") {
      logger.info("Sentry is not initialized (Development environment or missing DSN)");
      this.initialized = false;
    } else {
      Sentry.init({
        dsn: constants.SENTRY_DSN,
        release: constants.RELEASE_VERSION,
        integrations: [nodeProfilingIntegration()],
        tracesSampleRate: 1.0,
        profilesSampleRate: 1.0,
      });
      logger.info("Sentry has been initialized successfully");
      this.initialized = true;
    }
  }
  getMiddleware(app : Application) {
    if(!this.initialized){
        return
    }
    Sentry.setupExpressErrorHandler(app);
  }
  setUser(username: string) {
    if(!this.initialized){
        return
    }
    setUser({username});
  }
}
const sentryManager = new SentryManager();
export default sentryManager;