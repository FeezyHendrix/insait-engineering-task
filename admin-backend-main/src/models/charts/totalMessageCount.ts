import { prisma } from "../../libs/prisma";
import { generateChartTimeFilter, useOptionalFlowId } from "../../utils/charts";

export const fetchTotalMessageCount = async (startDate: string | undefined, endDate: string | undefined, flowId?: string | null) => {
    const queryFilters = generateChartTimeFilter(startDate, endDate);
    const conversationMessageCounts: {messageCount: number | null}[] = await prisma.interaction.findMany({
        select: {
            messageCount: true
        },
        where: {
            messageCount: {
                gt: 1
            },
            startedTime: queryFilters,
            ...useOptionalFlowId(flowId),
        }
    });
    const totalSum = conversationMessageCounts
    .reduce((sum, record) => sum + (record.messageCount ?? 0), 0);
    return totalSum
};