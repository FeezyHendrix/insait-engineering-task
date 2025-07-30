import { JsonValue } from '@prisma/client/runtime/library';
import { prisma } from '../libs/prisma';

export const fetchSecurityViolationMessages = async () => {
  const allConversations: {
    conversationId: string, 
    securityViolationMessages: JsonValue | null, 
    startedTime: Date
    }[] = await prisma.interaction.findMany({
    select: {
        conversationId: true,
        securityViolationMessages: true,
        startedTime: true
        },
        where: {
            messageCount: {
                gt: 1
            },
            securityViolations: {
                gt: 1
            },
            securityViolationMessages: {
                not: []
            }
        },
        orderBy: {
            startedTime: 'desc'
        }
  });
  const formattedData: {securityViolationMessageId: string, securityViolationMessage: string, conversationId: string, conversationStartedTime: Date}[] = [];

  allConversations.forEach((conversation) => {
          (conversation.securityViolationMessages as any[]).forEach((message: string) => {
              formattedData.push({
                  securityViolationMessageId: Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
                  securityViolationMessage: message,
                  conversationId: conversation.conversationId,
                  conversationStartedTime: conversation.startedTime,
              });
          });
  });

  return formattedData;
};