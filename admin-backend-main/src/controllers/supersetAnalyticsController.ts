import { Request, Response } from 'express';
import {
  getSessionAnalytics,
  getStepAnalytics,
  getMessageAnalytics,
  getTimeBasedAnalytics,
} from '../models/supersetAnalyticsModel';
import { OperationalError, ValidationError } from '../utils/error';
import tryCatch from '../utils/tryCatch';

export const getSessionAnalyticsData = tryCatch(async (req: Request, res: Response) => {
  const days = parseInt(req.query.days as string) || 30;
  
  if (days < 1 || days > 365) {
    throw new ValidationError('Days parameter must be between 1 and 365');
  }
  
  const data = await getSessionAnalytics(days);
  
  res.json({
    success: true,
    data,
    message: 'Session analytics retrieved successfully',
  });
});

export const getStepAnalyticsData = tryCatch(async (req: Request, res: Response) => {
  const days = parseInt(req.query.days as string) || 30;
  
  if (days < 1 || days > 365) {
    throw new ValidationError('Days parameter must be between 1 and 365');
  }
  
  const data = await getStepAnalytics(days);
  
  res.json({
    success: true,
    data,
    message: 'Step analytics retrieved successfully',
  });
});

export const getMessageAnalyticsData = tryCatch(async (req: Request, res: Response) => {
  const days = parseInt(req.query.days as string) || 30;
  
  if (days < 1 || days > 365) {
    throw new ValidationError('Days parameter must be between 1 and 365');
  }
  
  const data = await getMessageAnalytics(days);
  
  res.json({
    success: true,
    data,
    message: 'Message analytics retrieved successfully',
  });
});

export const getTimeBasedAnalyticsData = tryCatch(async (req: Request, res: Response) => {
  const days = parseInt(req.query.days as string) || 30;
  
  if (days < 1 || days > 365) {
    throw new ValidationError('Days parameter must be between 1 and 365');
  }
  
  const data = await getTimeBasedAnalytics(days);
  
  res.json({
    success: true,
    data,
    message: 'Time-based analytics retrieved successfully',
  });
});

export const getAllAnalytics = tryCatch(async (req: Request, res: Response) => {
  const days = parseInt(req.query.days as string) || 30;
  
  if (days < 1 || days > 365) {
    throw new ValidationError('Days parameter must be between 1 and 365');
  }
  
  const [sessionData, stepData, messageData, timeData] = await Promise.all([
    getSessionAnalytics(days),
    getStepAnalytics(days),
    getMessageAnalytics(days),
    getTimeBasedAnalytics(days),
  ]);
  
  res.json({
    success: true,
    data: {
      sessions: sessionData,
      steps: stepData,
      messages: messageData,
      timeBased: timeData,
    },
    message: 'All analytics retrieved successfully',
  });
});