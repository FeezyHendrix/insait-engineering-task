import { JsonValue } from "@prisma/client/runtime/library";
import { prisma } from "../../libs/prisma";
import { generateChartTimeFilter, useOptionalFlowId } from "../../utils/charts";

export const fetchUserResponseTime = async (startDate: string | undefined, endDate: string | undefined, flowId?: string | null) => {
    const queryFilters = generateChartTimeFilter(startDate, endDate);
    const calculateUserResponseTime = (messages: any[]) => {
        return messages
            .filter((msg, i) => msg.pov === 'bot' && messages[i + 1]?.pov === 'user')
            .map((msg, i) => (new Date(messages[i + 1].time)).getTime() - (new Date(msg.time)).getTime())
            .reduce((sum, time) => sum + time, 0) / 1000;
    };
    
    const getTimeRange = (time: number) => {
        if (time > 0 && time <= 10) return '0-10 sec';
        if (time <= 30) return '10-30 sec';
        if (time <= 60) return '30-60 sec';
        if (time <= 300) return '1-5 min';
        return '5 min +';
        
    };
    const allConversations: { messages: JsonValue}[] = await prisma.interaction.findMany({
        select: { messages: true },
        where: {
            messageCount: {
                gt: 1
            },
            startedTime: queryFilters,
            ...useOptionalFlowId(flowId),
        }    
    });
    const timeRanges = allConversations
        .filter(conversation => conversation.messages && Array.isArray(conversation.messages) && conversation.messages.length)
        .map(conversation => calculateUserResponseTime(conversation.messages as any[]))
        .filter(time => !isNaN(time) && time > 0)
        .reduce((acc: Record<string, number>, time: number) => {
            const range = getTimeRange(time);
            acc[range] = (acc[range] || 0) + 1;
            return acc;
        }, {
            '0-10 sec': 0,
            '10-30 sec': 0,
            '30-60 sec': 0,
            '1-5 min': 0,
            '5 min +': 0
        });

    return Object.entries(timeRanges).map(([name, value]) => ({ name, value }));
};
