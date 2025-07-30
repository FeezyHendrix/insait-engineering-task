import { prisma } from "../../libs/prisma";
import { getDateRange, useOptionalFlowId } from "../../utils/charts";

export const fetchFeedbackData = async (month: string, flowId?: string | null) => {
    const { startDate, endDate } = getDateRange(month);
    const ratingData: {userRating: number | null}[] = await prisma.interaction.findMany({
        where: {
            startedTime: {
                gte: startDate,
                lt: endDate
            },
            userRating: {
                not: null,
            },
            messageCount: {
                gt: 1
            },
            ...useOptionalFlowId(flowId),
        },
        select: {
            userRating: true,
        },
    });
    const ratingCounts = ratingData.reduce((acc: {[key: number]: number}, { userRating }) => {
        if (userRating !== null) {
            acc[userRating] = (acc[userRating] || 0) + 1;
        }
        return acc;
    }, {});

    return ratingCounts;
};
