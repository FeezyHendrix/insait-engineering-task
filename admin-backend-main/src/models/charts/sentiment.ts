import { prisma } from "../../libs/prisma";
import { generateChartTimeFilter, useOptionalFlowId } from "../../utils/charts";

export const fetchSentiment = async (startDate?: string, endDate?: string, flowId?: string | null) => {
    const queryFilters = generateChartTimeFilter(startDate, endDate);
    
    const conversations = await prisma.interaction.findMany({
        select: {
            sentiment: true,
        },
        where: {
            sentiment: {
                not: null,
            },
            messageCount: {
                gt: 1
            },
            startedTime: queryFilters,
            ...useOptionalFlowId(flowId),
        }
    })
    
    const sentimentData = conversations.reduce((acc: { [key: string]: number }, conversation: { sentiment: string | null }) => {
        const sentiment = conversation.sentiment;
        if (sentiment) {
            acc[sentiment] = (acc[sentiment] || 0) + 1;
        }
        return acc;
    }, {});
    
    const result = {
        label: Object.keys(sentimentData),  
        data: Object.values(sentimentData)   
    };

    return result;
}