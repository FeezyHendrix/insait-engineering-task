import { prisma } from "../../libs/prisma";
import { generateChartTimeFilter, useOptionalFlowId } from "../../utils/charts";

export const fetchAvgBotResponseTime = async (startDate: string | undefined, endDate: string | undefined, flowId?: string | null) => {
    const queryFilters = generateChartTimeFilter(startDate, endDate)
    const allResponseTimes = await prisma.interaction.findMany({
        select: {
            avgResponseTimePerQuery: true
        },
        where: {
            avgResponseTimePerQuery: {
                not: 0
            },
            messageCount: {
                gt: 1
            },
            startedTime: queryFilters,
            ...useOptionalFlowId(flowId),
        }
    });
    if (allResponseTimes.length === 0) {
        return 0
    }
    const medianResponseTime = allResponseTimes.map((responseTime: any) => responseTime.avgResponseTimePerQuery).sort((a: any, b: any) => a - b)[Math.floor(allResponseTimes.length / 2)] / 1000;
    return `${medianResponseTime.toFixed(1)}s`
};