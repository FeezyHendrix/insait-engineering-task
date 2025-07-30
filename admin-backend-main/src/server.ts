import './libs/datadog';
import sentryManager from './sentry';
import express, { Router } from 'express';
import http from 'http';
import analyticsRouter from './routes/analyticsRouter';
import supersetAnalyticsRouter from './routes/supersetAnalyticsRouter';
import batchRouter from './routes/batchRouter';
import templatesRouter from './routes/templatesRouter';
import healtRouter from './routes/healtRouter';
import securityViolationMessages from './routes/securityViolationMessagesRouter';
import feedbackMessagesAndRatingRouter from './routes/feedbackMessagesAndRatingRouter';
import chartsRouter from './routes/chartsRouter';
import reportRouter from './routes/reportRouter';
import unansweredQsRouter from './routes/unansweredQRouter';
import knowledgeRouter from './routes/knowledgeRouter';
import conversationsRouter from './routes/conversationsRouter';
import questionsRouter from './routes/questionsRoutes';
import { getCompanyConfig } from './middlewares/domainConfig';
import errorHandlerMiddleware from './middlewares/errorHandler';
import isUserAuthenticated from './middlewares/auth';
import constants, { baseUrlPrefix } from './constants';
import setupSocket from './websocket/socketSetup';
import logger from './libs/pino';
import documentKnowledgeRouter from './routes/documentKnowledgeRouter';
import S3Client from './services/S3Client';
import testScenarioRouter from './routes/testScenarioRouter';
import userSettingsRouter from './routes/userSettingsRouter';
import loginPreferencesRouter from './routes/loginPreferencesRouter';
import helmet from 'helmet';
import { useCORS } from './middlewares/cors';
import { prisma } from './libs/prisma';
import agentConfigurationsRouter from './routes/agentConfigurations';
import requestLogger from './middlewares/httpLogger';


if (constants.RUN_MODE !== 'PRODUCTION') {
  (async () => {
    const { handlers } = await import('./mocks/handlers/index');
    const { setupServer } = await import('msw/node');
    const mswServer = setupServer(...handlers);
    mswServer.listen();
  })();
}

const app = express();
const port = constants.BACKEND_PORT;
try {
  S3Client.getInstance().initialize();
  logger.info('S3 client initialized successfully');
} catch (error) {
  logger.error(`Failed to initialize S3 client: ${(error as Error).message}`);
  process.exit(1);
}

app.use(helmet());
app.use(useCORS);
app.use(express.json({ limit: '10mb' }));
app.use(requestLogger)
app.use(getCompanyConfig);
app.use(isUserAuthenticated);

const baseRouter = Router();

app.use(baseUrlPrefix, baseRouter);

baseRouter.use('/analytics', analyticsRouter);
baseRouter.use('/superset-analytics', supersetAnalyticsRouter);
baseRouter.use('/health', healtRouter);
baseRouter.use('/batch', batchRouter);
baseRouter.use('/report', reportRouter);
baseRouter.use('/templates', templatesRouter);
baseRouter.use('/charts', chartsRouter);
baseRouter.use('/unansweredQs', unansweredQsRouter);
baseRouter.use('/knowledge', knowledgeRouter);
baseRouter.use('/securityViolationMessages', securityViolationMessages);
baseRouter.use('/feedbackMessagesAndRatingRouter', feedbackMessagesAndRatingRouter);
baseRouter.use('/conversations', conversationsRouter);
baseRouter.use('/documentKnowledge', documentKnowledgeRouter);
baseRouter.use('/testScenarios', testScenarioRouter);
baseRouter.use('/userSettings', userSettingsRouter);
baseRouter.use('/loginPreferences', loginPreferencesRouter);
baseRouter.use('/agentConfigurations', agentConfigurationsRouter);
baseRouter.use('/frequentQuestions', questionsRouter);

sentryManager.getMiddleware(app);

baseRouter.use(errorHandlerMiddleware);

const server = http.createServer(app);
setupSocket(server);

server.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});


const gracefulShutdown = async() => {
  logger.info('Received shutdown signal, closing server...');

  await prisma.$disconnect();
  logger.info('Prisma connection closed.');

  server.close(() => {
    logger.info('Server closed.');
    process.exit(0);
  });

  setTimeout(() => {
    logger.error('Forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);