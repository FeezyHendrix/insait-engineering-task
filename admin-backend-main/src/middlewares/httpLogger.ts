import { RequestHandler, Request } from "express";
import pinoHttp from "pino-http";
import { randomUUID } from 'crypto';
import constants from "../constants";
import { extractTenant } from "../utils/extractTenant";

const { RUN_MODE, ENVIRONMENT } = constants 

const isDevelopment = ["DEV_SEED", "SEED_DEMO"].includes(RUN_MODE);
const isTest = RUN_MODE === "TEST" 

const requestLogger: RequestHandler = (req, res, next) => {
    const correlationId = req.headers["x-correlation-id"] || randomUUID();
    const tenant = extractTenant(req) ?? "unknown"
    req.headers["x-correlation-id"] = correlationId;
    res.setHeader("X-Correlation-Id", correlationId);

    const expressLogger = pinoHttp({
        level: isTest ? 'silent' : 'info',
        formatters: {
            level(label){
                return {level: label}
            }
        },
        quietReqLogger: isDevelopment ? true : false,
        ...(isDevelopment ? {
            transport: {
              target: 'pino-pretty',
              options: {
                ignore: 'pid,hostname',
              },
            },
          } : {}),
        customProps: (req : Request) => ({
            correlationId: req.headers["x-correlation-id"],
            tenant: tenant,
            user: req.user ?? "unknown",
            environment: ENVIRONMENT ?? "unknown"
        }),
        customSuccessMessage: (req, res) => `End of [${req.method}] ${req.baseUrl}`,
        genReqId: (req) => {
            const existingID = req.id ?? req.headers["x-request-id"]
            if (existingID) return existingID
            const id = randomUUID()
            res.setHeader('X-Request-Id', id)
            return id
          },
          customLogLevel: () => {
            if (res.statusCode >= 400) return 'error'; 
            return 'info'; 
        },
        redact: {
          paths: ['req.headers.authorization'],
          censor: '***REDACTED***',
        },
        serializers: {
          req(req) {
            return {
              id: req.id,
              method: req.method,
              url: req.url,
              query: Object.fromEntries(
                Object.entries(req.query).filter(([key]) => !['token', 'password'].includes(key))
              ),
              headers: {
                'user-agent': req.headers['user-agent'],
                'x-correlation-id': req.headers['x-correlation-id'],
                origin: req.headers['origin'],
                referer: req.headers['referer'],
                host: req.headers['host'],
              },
              ip: req.headers['x-forwarded-for'] || req.ip,              
              remoteAddress: req.socket?.remoteAddress,
            };
          },
          res(res) {
            return {
              statusCode: res.statusCode,
              headers: {
                'x-correlation-id': typeof res.getHeader === 'function' ? res.getHeader('x-correlation-id') : undefined,
                'x-request-id': typeof res.getHeader === 'function' ? res.getHeader('x-request-id') : undefined,
              }
            };
          }
        }
    });

    expressLogger(req, res, next);
    req.log.info('Incomming Request')
};

export default requestLogger;