import constants from "../../constants";
import { prisma } from "../../libs/prisma";
import { generateChartTimeFilter, useOptionalFlowId } from "../../utils/charts";

export const fetchUserMessagesPerConversationData = async (startDate: string | undefined, endDate: string | undefined, flowId?: string | null) => {
  const queryFilters = generateChartTimeFilter(startDate, endDate);
  const allConversations: {messages: any}[] = await prisma.interaction.findMany({
    where: {
      messageCount: {
        gt: 1
      },
      startedTime: queryFilters,
      ...useOptionalFlowId(flowId),
    },
    select: {
      messages: true
    }
  });

  const userMessagesPerConversation = constants.USER_MESSAGE_COUNT_RANGES.map((range) => {
    const count = (allConversations).filter((conversation: {messages: any}) => {
      const messages = conversation.messages as any[];
      const messageLength = conversation.messages ? Math.floor(messages.length / 2) : 0;
      return messageLength >= range.min &&
             (range.max === null || messageLength <= range.max);
    }).length;
  
    return {
      "name": range.label,
      "value": count
    };
  });
  return userMessagesPerConversation
};
