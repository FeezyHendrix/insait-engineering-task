import { prisma } from "../../libs/prisma";
import { generateChartTimeFilter, useOptionalFlowId } from "../../utils/charts";

export const fetchPersona = async (startDate?: string, endDate?: string, flowId?: string | null) => {
    const queryFilters = generateChartTimeFilter(startDate, endDate);
    const conversations = await prisma.interaction.findMany({
        select: {
            persona: true,
        },
        where: {
            persona: {
                not: null,
            },
            startedTime: queryFilters,
            ...useOptionalFlowId(flowId),
        }
    });
    
    const personaData = conversations.reduce((acc: { [key: string]: number }, conversation: { persona: string | null }) => {
        const persona = conversation.persona;
        if (persona) {
            acc[persona] = (acc[persona] || 0) + 1;
        }
        return acc;
    }, {});
    
    const result = {
        label: Object.keys(personaData),  
        data: Object.values(personaData)   
    };

    return result;
}