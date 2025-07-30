import pino from 'pino';
import constants, { baseUrlPrefix, useDD } from '../constants';
import { tracer } from 'dd-trace';

const { DD_SERVICE, ENVIRONMENT, RELEASE_VERSION, STAND_ALONE } = constants;
const isProduction = process.env.RUN_MODE === 'production';

const logger = pino({
  level: 'info',
  base: {
    service: DD_SERVICE,
    env: ENVIRONMENT,
    version: RELEASE_VERSION,
    standAlone: STAND_ALONE === '1',
    baseUrlPrefix: baseUrlPrefix,
  },
  ...(useDD && {
    formatters: {
      log(object) {
        const span = tracer.scope().active();
        if (span) {
          const context = span.context();
          object['dd.trace_id'] = context.toTraceId();
          object['dd.span_id'] = context.toSpanId();
        }
        return object;
      },
    },
  }),

  ...(!isProduction && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        ignore: 'pid,hostname',
      },
    },
  }),
});

export default logger;