import {  ErrorRequestHandler } from 'express';
import { NotFoundError, OperationalError, ValidationError, AuthError } from '../utils/error';
import logger from '../libs/pino';

const errorHandlerMiddleware : ErrorRequestHandler = (error, request, response, next) => {
  switch(true){
    case error instanceof ValidationError:
      logger.error(error.message);
      response.status(error.statusCode).send(error.message);
      break;
    case error instanceof OperationalError:
      logger.error(error.message);
      logger.error(error.originalError);
      response.status(error.statusCode).send('Something went wrong. Please try again later.');
      break;
    case error instanceof NotFoundError:
      logger.error(error.message);
      response.status(error.statusCode).send(error.message);
      break;
    case error instanceof AuthError:
      logger.error(error.message)
      response.status(error.statusCode).send(error.message)
      break;
    default:
      logger.error(error);
      response.status(500).send('Something went wrong');
  }
};

export default errorHandlerMiddleware;
