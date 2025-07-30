import { prisma } from "../../libs/prisma";
import { generateChartTimeFilter, useOptionalFlowId } from "../../utils/charts";

const keyTranslations = {
    "Messaged Agent": {
        en: "Messaged Agent",
        he: "שלחו הודעה לסוכן"
    },
    "Saw Agent's Initial Message": {
        en: "Saw Agent's Initial Message",
        he: "ראו את ההודעה הראשונה של הסוכן"
    },
    "Saw Agent Button": {
        en: "Saw Agent Button",
        he: "ראו את כפתור הסוכן"
    },
    "Successful Conversation": {
        en: "Successful Conversation",
        he: "שיחה מוצלחת"
    }
}

export const fetchUserExposureWithMedia = async (defaultOpenEnabled: boolean, language: 'en' | 'he', media: string | undefined, startDate?: string, endDate?: string, flowId?: string | null) => {
    const start = startDate && startDate !== 'null' ? new Date(startDate) :undefined;
    const end = endDate && endDate !== 'null' ? new Date(endDate) : undefined;
    const flowIdSpecified = flowId !== undefined;
    const dateFilter = (field:string) => {
        return start && end
        ? { [field]: { gte: start, lte: end } }
        : start
        ? { [field]: { gte: start } }
        : end
        ? { [field]: { lte: end } }
        : {};
    };
    const selectedMedia = media ? media.split(',').map(media => media.toUpperCase()) : [];

    const mediaFilter = selectedMedia.length ? {
        OR: [
            {
                userAgent: {
                    in: selectedMedia
                }
            },
            ...(selectedMedia.includes('UNKNOWN') ? [{ userAgent: null }] : [])
        ]
    } : {};

    const timeFilters = {
        users: dateFilter('createdAt'),
        conversations: dateFilter('startedTime')
    };


    const sawButtonCount: number = defaultOpenEnabled || flowIdSpecified ? 0 : await prisma.user.count({
        where: {
            ...timeFilters.users,
            isTestUser: false,
            ...mediaFilter
        },
    });
    const sawInitialMessage: {messageCount: number | null, botSuccess: boolean | null}[] = await prisma.interaction.findMany({
        include: {
            User: {
                select: {
                    userAgent: true
                }
            }
        },
        where: {
            ...timeFilters.conversations,
            messageCount: {
                not: null
            },
            User: {
                ...mediaFilter
            },
            ...useOptionalFlowId(flowId),
        }
    });
    const messagedAgent = sawInitialMessage.filter((conversation) => conversation.messageCount && conversation.messageCount > 1);
    const successfulConversations = sawInitialMessage.filter((conversation) => conversation.botSuccess);

    const mediaOptions = (await prisma.user.findMany({
        distinct: ['userAgent'],
        select: {
            userAgent: true
        }
    })).map((option: { userAgent: string | null }) => option.userAgent ?? 'UNKNOWN')
    .filter((value: string, index: number, self: string[]) => self.indexOf(value) === index);
    const uniqueMediaOptions = mediaOptions.filter((value: string, index: number, self: string[]) => self.indexOf(value) === index && value !== 'unknown');
    return {
        chartData: {
            data: [
                successfulConversations.length,
                messagedAgent.length,
                sawInitialMessage.length,
                ...(!defaultOpenEnabled && !flowIdSpecified ? [sawButtonCount] : []),
            ],
            categories: [
                keyTranslations["Successful Conversation"][language],
                keyTranslations["Messaged Agent"][language],
                keyTranslations["Saw Agent's Initial Message"][language],
                ...(!defaultOpenEnabled && !flowIdSpecified ? [keyTranslations["Saw Agent Button"][language]] : []),
            ]
        },
        mediaOptions
    };
};