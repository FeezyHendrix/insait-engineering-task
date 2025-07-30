import { prisma } from '../libs/prisma';

export interface SessionAnalytics {
  totalSessions: number;
  completedSessions: number;
  abandonedSessions: number;
  avgSessionDuration: number;
  completionRate: number;
}

export interface StepAnalytics {
  stepName: string;
  stepType: string;
  successRate: number;
  avgDuration: number;
  dropOffCount: number;
}

export interface MessageAnalytics {
  totalMessages: number;
  avgResponseTime: number;
  messagesByType: Array<{ type: string; count: number }>;
  sentimentDistribution: Array<{ sentiment: string; count: number }>;
}

export const getSessionAnalytics = async (days: number = 30): Promise<SessionAnalytics> => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const sessions = await prisma.clientSession.findMany({
    where: {
      createdAt: {
        gte: startDate,
      },
    },
  });

  const totalSessions = sessions.length;
  const completedSessions = sessions.filter(s => s.status === 'COMPLETED').length;
  const abandonedSessions = sessions.filter(s => s.status === 'ABANDONED').length;
  
  const avgSessionDuration = sessions
    .filter(s => s.sessionDuration)
    .reduce((sum, s) => sum + (s.sessionDuration || 0), 0) / 
    sessions.filter(s => s.sessionDuration).length || 0;

  const completionRate = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

  return {
    totalSessions,
    completedSessions,
    abandonedSessions,
    avgSessionDuration: Math.round(avgSessionDuration),
    completionRate: Math.round(completionRate * 100) / 100,
  };
};

export const getStepAnalytics = async (days: number = 30): Promise<StepAnalytics[]> => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const steps = await prisma.conversationStep.findMany({
    where: {
      createdAt: {
        gte: startDate,
      },
    },
    include: {
      session: true,
    },
  });

  // Group by step name and type
  const stepGroups = steps.reduce((acc, step) => {
    const key = `${step.stepName}_${step.stepType}`;
    if (!acc[key]) {
      acc[key] = {
        stepName: step.stepName,
        stepType: step.stepType,
        total: 0,
        successful: 0,
        durations: [],
        dropOffs: 0,
      };
    }
    
    acc[key].total++;
    if (step.wasSuccessful) acc[key].successful++;
    if (step.duration) acc[key].durations.push(step.duration);
    if (!step.wasSuccessful) acc[key].dropOffs++;
    
    return acc;
  }, {} as Record<string, any>);

  return Object.values(stepGroups).map((group: any) => ({
    stepName: group.stepName,
    stepType: group.stepType,
    successRate: Math.round((group.successful / group.total) * 100 * 100) / 100,
    avgDuration: group.durations.length > 0 
      ? Math.round(group.durations.reduce((sum: number, d: number) => sum + d, 0) / group.durations.length)
      : 0,
    dropOffCount: group.dropOffs,
  }));
};

export const getMessageAnalytics = async (days: number = 30): Promise<MessageAnalytics> => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const messages = await prisma.messageLog.findMany({
    where: {
      timestamp: {
        gte: startDate,
      },
    },
  });

  const totalMessages = messages.length;
  
  const botMessages = messages.filter(m => m.sender === 'BOT' && m.responseTime);
  const avgResponseTime = botMessages.length > 0
    ? Math.round(botMessages.reduce((sum, m) => sum + (m.responseTime || 0), 0) / botMessages.length)
    : 0;

  // Group by message type
  const messagesByType = messages.reduce((acc, message) => {
    const existing = acc.find(item => item.type === message.messageType);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ type: message.messageType, count: 1 });
    }
    return acc;
  }, [] as Array<{ type: string; count: number }>);

  // Group by sentiment
  const sentimentDistribution = messages
    .filter(m => m.sentiment)
    .reduce((acc, message) => {
      const existing = acc.find(item => item.sentiment === message.sentiment);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ sentiment: message.sentiment || 'unknown', count: 1 });
      }
      return acc;
    }, [] as Array<{ sentiment: string; count: number }>);

  return {
    totalMessages,
    avgResponseTime,
    messagesByType,
    sentimentDistribution,
  };
};

export const getTimeBasedAnalytics = async (days: number = 30) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Session trends over time
  const sessionTrends = await prisma.$queryRaw`
    SELECT 
      DATE_TRUNC('day', "startTime") as date,
      COUNT(*) as session_count,
      AVG("sessionDuration") as avg_duration,
      COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) as completed_count
    FROM "ClientSession"
    WHERE "startTime" >= ${startDate}
    GROUP BY DATE_TRUNC('day', "startTime")
    ORDER BY date
  `;

  // Response time trends
  const responseTimeTrends = await prisma.$queryRaw`
    SELECT 
      DATE_TRUNC('day', timestamp) as date,
      AVG("responseTime") as avg_response_time,
      COUNT(*) as message_count
    FROM "MessageLog"
    WHERE timestamp >= ${startDate} AND sender = 'BOT' AND "responseTime" IS NOT NULL
    GROUP BY DATE_TRUNC('day', timestamp)
    ORDER BY date
  `;

  return {
    sessionTrends,
    responseTimeTrends,
  };
};