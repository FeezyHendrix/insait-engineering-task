import { AdminConversationType } from '../../types/interfaces';
import { prisma } from '../../libs/prisma';
import { generateChartTimeFilter, useOptionalFlowId } from '../../utils/charts';

export const fetchInteractionDuration = async (startDate: string | undefined, endDate: string | undefined, flowId?: string | null) => {
    const queryFilters = generateChartTimeFilter(startDate, endDate);
    const interactions: { startedTime: Date, endTime: Date | null}[] = await prisma.interaction.findMany({
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
                lt: prisma.interaction.fields.endTime
            },
            ...useOptionalFlowId(flowId),
        }
    });

    const medianDuration = interactions
        .map((interaction) => {
            if (!interaction.endTime) return 0;
            return (new Date(interaction.endTime).getTime() - new Date(interaction.startedTime).getTime()) / 1000;
        })
        .sort((a, b) => a - b)[Math.floor(interactions.length / 2)];

    return medianDuration;
};