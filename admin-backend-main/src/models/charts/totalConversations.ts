import { prisma } from "../../libs/prisma";
import { generateChartTimeFilter, useOptionalFlowId } from "../../utils/charts";

export const fetchConversationCount = async (startDate: string | undefined, endDate: string | undefined, flowId?: string | null) => {
    const queryFilters = generateChartTimeFilter(startDate, endDate);
    const allConversations: number = await prisma.interaction.count({
        where: {
            messageCount: {
                gt: 1
            },
            startedTime: queryFilters,
            ...useOptionalFlowId(flowId),
        }
    }); 
    return allConversations
};