import { AdminConversationType, UnansweredQType } from '../../types/interfaces'
import hardcodedConstants from '../../constants'
import constants from '../../constants'
import { prisma } from '../../libs/prisma'
import { useOptionalFlowId } from '../../utils/charts';

const keyTranslations = {
  answered: {
    en: "Answered Questions",
    he: "שאלות שנענו"
  },
  unanswered: {
    en: "Unanswered Questions",
    he: "שאלות שלא נענו"
  }
};

export const fetchAnsweredAndUnanswered = async (monthYear: string, language: 'en' | 'he' = 'en', flowId?: string | null) => {
    // initialize dates and data variables
    const chosenMonth = parseInt(monthYear.split('-')[0])
    const chosenYear = parseInt(monthYear.split('-')[1])
    const startOfChosenMonth = new Date(Date.UTC(chosenYear, chosenMonth, 1, 0, 0, 0, 0));
    const endOfChosenMonth = new Date(Date.UTC(chosenYear, chosenMonth + 1, 0, 0, 0, 0, 0));
    const timeRanges: Date[] = Array.from({ length: 4 }, (_, i) => {
      const date = new Date(startOfChosenMonth.getFullYear(), startOfChosenMonth.getMonth(), 1 + (constants.MISC.DAYS_PER_WEEK * i), 0, 0, 0, 0);
      return date;
    });        
    
    const timeNames = timeRanges.map((time, i) => 
      `${hardcodedConstants.MONTH_NAMES[chosenMonth]} ${time.getDate()}-${i === timeRanges.length - 1 ? endOfChosenMonth.getUTCDate() : timeRanges[i + 1].getDate() - 1}`
    );

    const startingAccumulator: Record<string, number> = timeNames.reduce((acc: Record<string, number>, timeName) => {
      acc[timeName] = 0;
      return acc;
    }, {});

    const getTimeRange = (time: Date) => {
      if (time <= timeRanges[1]) return timeNames[0];
      if (time <= timeRanges[2]) return timeNames[1];
      if (time <= timeRanges[3]) return timeNames[2];
      return timeNames[3];
    };

    // unanswered q's
    const allUnansweredQs: UnansweredQType[] = await prisma.unansweredQuestion.findMany()
    const unansweredQsByWeek = allUnansweredQs
      .filter((unansweredQ) => {
        return new Date(unansweredQ.createdAt) >= startOfChosenMonth && new Date(unansweredQ.createdAt) < endOfChosenMonth;
      })
      .map((unansweredQ) => new Date(unansweredQ.createdAt))
      .reduce((acc: Record<string, number>, date: Date) => {
        const range = getTimeRange(date)
        acc[range] = (acc[range] || 0) + 1;
        return acc;
      }, {...startingAccumulator});

    // answered q's
    const monthlyConversations: AdminConversationType[] = await prisma.interaction.findMany({
      where: {
        startedTime: {
          gte: startOfChosenMonth,
          lt: endOfChosenMonth
        },
        messageCount: {
          gt: 1
        },
        ...useOptionalFlowId(flowId),
      }
    });

    // final formatting
    const answeredQsByWeek = monthlyConversations
      .map((conversation) => conversation.startedTime)
      .reduce((acc: Record<string, number>, date: Date) => {
        const range = getTimeRange(date)
        acc[range] = (acc[range] || 0) + 1;
        return acc;
      }, {...startingAccumulator});      
      
      const formattedData = timeNames.map((timeName) => {
        return {
          "name": timeName,
          [keyTranslations["answered"][language]]: answeredQsByWeek[timeName],
          [keyTranslations["unanswered"][language]]: unansweredQsByWeek[timeName]
        };
      });      
      return formattedData
  }