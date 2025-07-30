import constants from '../../constants';
import { prisma } from '../../libs/prisma';
import { generateChartTimeFilter, useOptionalFlowId } from '../../utils/charts';

export const fetchConversationDuration = async (startDate: string | undefined, endDate: string | undefined, flowId?: string | null) => {
    const queryFilters = generateChartTimeFilter(startDate, endDate);
    const conversations: { startedTime: Date, endTime: Date | null}[] = await prisma.interaction.findMany({
        select: {
            startedTime: true,
            endTime: true,
        },
        where: {
            messageCount: {
                gt: 1
            },
            endTime: {
                not: undefined
            },
            startedTime: {
                ...queryFilters,
                not: undefined,
                lt: prisma.interaction.fields.endTime
            },
            ...useOptionalFlowId(flowId),
        }
    });

    const conversationDurations = constants.CONVERSATION_DURATION_RANGES.map((range) => {
        const count = conversations.filter((conversation: { startedTime: Date, endTime: Date | null }) => {
            const durationMinutes = conversation.endTime ? (new Date(conversation.endTime).getTime() - new Date(conversation.startedTime).getTime()) / 60 / 1000 : 0;
            return durationMinutes >= range.min && (range.max === null || durationMinutes <= range.max);
        }).length;
        return {
            "name": range.label,
            "value": count
        }
    });

    return conversationDurations;
};