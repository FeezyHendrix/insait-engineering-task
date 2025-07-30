import { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { baseUrlPrefix } from '../constants';

export const useCORS = (req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith(`${baseUrlPrefix}/health`)) {
      return next();
    };
    const { hostname } = req;

    const corsOptions = {
      origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        if (!origin) {
          callback(null, true);
          return
        };
        const originUrl = new URL(origin || '');
        const originHostname = originUrl.hostname;
        if (originHostname === hostname) {
          callback(null, true);
        } else {
          callback(new Error(`Not allowed by CORS: "${originHostname}" does not match "${hostname}"`));
        }
      },
    };

    cors(corsOptions)(req, res, next);
  };
