import { Request, Response, NextFunction } from 'express';
import jwtmod from 'jsonwebtoken';
import { AuthError } from '../utils/error';
import { baseUrlPrefix, requestHostnameWhitelist } from '../constants';
import sentryManager from '../sentry';
import logger from '../libs/pino';
import datadogTracerManager from '../libs/datadog';
import { KeycloakToken } from '../types/interfaces';

const addUsernameToRequest = (req: Request, username: string): void => {
  req.user = username
  
  if (req.body.data && typeof req.body.data === 'string') {
    try {
      const dataObj = JSON.parse(req.body.data);
      dataObj.username = username;
      req.body.data = JSON.stringify(dataObj);
    } catch (e) {
      logger.error('Failed to parse req.body.data:', req.body.data);
      throw new AuthError('Invalid JSON in req.body.data');
    }
  } else if (req.body.data) {
    req.body.data.username = username;
  } else if (req.body) {
    req.body.username = username;
  }
};

const isUserAuthenticated = async (req: Request, res: Response, next: NextFunction,) => {
  if (
    req.path.startsWith(`${baseUrlPrefix}/health`) ||
    requestHostnameWhitelist.includes(req.hostname)
  ) {
    try {
      const mockUsername = 'mockUser';
      addUsernameToRequest(req, mockUsername);
      return next();
    } catch (e) {
      return next(e);
    }
  }

  try {
    const bearerHeader = req.headers['authorization'];
    const rawToken = bearerHeader && bearerHeader.split(' ')[1];
    const KEYCLOAK_PUB_KEY = res.locals.companyConfig.keycloak_pub_key;
    const publicKey = `-----BEGIN PUBLIC KEY-----\n${KEYCLOAK_PUB_KEY}\n-----END PUBLIC KEY-----`;

    const decodedToken = jwtmod.verify(rawToken!, publicKey, {
      algorithms: ['RS256'],
    });

    if (!decodedToken) {
      return next(new AuthError('Authentication Error'));
    }

    const token = decodedToken as KeycloakToken

    const requestUsername = token.preferred_username ?? 'Unknown User';
    const userId = token.sub ?? 'Unknown ID';
    const sessionId = token.sid ?? 'Unknown Session';

    datadogTracerManager.setUser(userId, requestUsername, sessionId)

    try {
      addUsernameToRequest(req, requestUsername);
    } catch (e) {
      return next(e);
    }

    sentryManager.setUser(requestUsername);
    next();
  } catch (error) {
    next(new AuthError(`Authentication Error: ${error}`));
  }
};

export default isUserAuthenticated;
