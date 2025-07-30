import constants from '../../constants';
import { dateSetter, formatWeekName, getWeekRange, isDateBetween } from '../../utils/dateHelper';
import { prisma } from '../../libs/prisma';
import { useOptionalFlowId } from '../../utils/charts';

export const fetchUserInteraction = async (flowId?: string | null) => {
    const generateLastWeekData = (recentConversations: {endTime: Date | null}[]) => {
      const lastWeekData = Array.from({ length: constants.MISC.DAYS_PER_WEEK + 1 }, (_, index) => {
        const i = constants.MISC.DAYS_PER_WEEK - index;
        const dateToCalculate = dateSetter(-i)
        const nextDay = dateSetter(1, dateToCalculate)      
        const count = recentConversations.filter(conversation => {
          if (!conversation.endTime) return false;
          const endTime = new Date(conversation.endTime);
          return isDateBetween(endTime, dateToCalculate, nextDay)
        }).length;
      
        const day = dateToCalculate.getDate();
        const month = dateToCalculate.getMonth() + 1;
        const formattedDate = `${day}/${month}`;
        return { name: formattedDate, value: count };
      });
      
      return lastWeekData
    }
    const generateLastMonthData = (recentConversations: {endTime: Date | null}[]) => {
      const currentDate = new Date();
      const { start: currentWeekStart } = getWeekRange(currentDate);
      const result = [];
      for (let i = 0; i < constants.USER_INTERACTION_CHART_WEEKS; i++) {
        const weekStartDate = dateSetter(- (i * constants.MISC.DAYS_PER_WEEK), currentWeekStart)
        const { start, end } = getWeekRange(weekStartDate);
        const count = recentConversations.filter(conversation => {
          if (!conversation.endTime) return false;
          const endTime = new Date(conversation.endTime);
          return endTime >= start && endTime <= end;
        }).length;
        const formattedWeekName = formatWeekName(start, end);
        result.unshift({ name: formattedWeekName, value: count });
      }
      return result
    };

    const earliestDate = dateSetter(-21);
    earliestDate.setHours(0,0,0,0); 
    const recentConversations: {endTime: Date | null}[] = await prisma.interaction.findMany({
      select: {
        endTime: true
      },
      where: {
        endTime: {
          gte: earliestDate,
        },
        messageCount: {
          gt: 1
        },
        ...useOptionalFlowId(flowId),
      }
    });
    const lastWeekData = generateLastWeekData(recentConversations);
    const lastMonthData = generateLastMonthData(recentConversations);
    return { lastWeekData, lastMonthData }
  } 
  