import tracer from 'dd-trace';
import constants, {useDD} from '../constants';
import logger from './pino';

class DatadogTracerManager {
  private initialized: boolean;
  private tracer?: typeof tracer;

  constructor() {
    this.initialized = false;

    const {
      DD_SERVICE,
      ENVIRONMENT,
      DD_AGENT_HOST,
      DD_TRACE_AGENT_PORT,
    } = constants;

    if (useDD) {
      tracer.init({
        service: DD_SERVICE,
        env: ENVIRONMENT,
        hostname: DD_AGENT_HOST,
        port: Number(DD_TRACE_AGENT_PORT),
        logInjection: true,
        tags: {
            tenant: constants.TENANT
        }
      });

      this.tracer = tracer;
      this.initialized = true;
      logger.info('Datadog APM has been initialized successfully');
    } else {
      logger.info(
        'Datadog APM is not initialized (Development environment or missing DD envs)'
      );
    }
  }

  setUser(userId : string, userName: string, sessionId: string) {
    if (!this.initialized || !this.tracer) return;
    tracer.setUser({
        id: userId,
        name: userName,
        session_id: sessionId
    })
  }

  getTracer() {
    return this.tracer;
  }
}

const datadogTracerManager = new DatadogTracerManager();
export default datadogTracerManager;
