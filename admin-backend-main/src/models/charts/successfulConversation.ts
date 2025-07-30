import constants from "../../constants";
import { SuccessfulConversationStatType } from "../../types/interfaces";
import { prisma } from "../../libs/prisma";
import { formatDate, formatDateLabel, getStartOfWeek, getEndOfWeek, formatMonthDay, generateChartTimeFilter, useOptionalFlowId } from "../../utils/charts";

const keyTranslations = {
  unsuccessful: {
    en: "Unsuccessful",
    he: "לא מוצלח"
  },
  successful: {
    en: "Successful",
    he: "מוצלח"
  }
}

export const fetchSuccessfulConversationsStats = async (startDate: string | undefined, endDate: string | undefined, showPercentage: boolean = false, language: 'en' | 'he' = 'en', flowId?: string | null)  => {
  const queryFilters = generateChartTimeFilter(startDate, endDate);
  const conversationData: [{ startedTime: Date | null, botSuccess: boolean | null }[], { startedTime: Date | null, botSuccess: boolean | null } | null ] = await prisma.$transaction([
    prisma.interaction.findMany({
      where: {
        startedTime: queryFilters,
        messageCount: {
          gt: 1,
        },
        ...useOptionalFlowId(flowId),
      },
      select: {
        startedTime: true,
        botSuccess: true,
      },
    }),
    prisma.interaction.findFirst({
      where: {
        startedTime: queryFilters,
        messageCount: {
          gt: 1,
        },
        ...useOptionalFlowId(flowId),
      },
      orderBy: {
        startedTime: 'asc',
      },
      select: {
        startedTime: true,
        botSuccess: true,
      },
    }),
  ]);
  const [conversations, earliestConversationDate] = conversationData;
  if (!earliestConversationDate) return [];
  earliestConversationDate.startedTime?.setHours(0, 0, 0, 0);
  const chartEarliestDate = queryFilters.gte && startDate ? new Date(startDate) : earliestConversationDate.startedTime;
  if (!chartEarliestDate) {
    throw new Error('Earliest conversation date not found');
  };
  const chartLatestDate = queryFilters.lte && endDate ? new Date(endDate) : new Date();
  const timeRangeInDays = (chartLatestDate.getTime() - chartEarliestDate.getTime()) / (constants.MISC.MILLISECONDS_PER_MINUTE * constants.MISC.MINUTES_PER_HOUR * constants.MISC.HOURS_PER_DAY);

  // decide how to aggregate the data based on the time range
  if (timeRangeInDays <= constants.MAX_BAR_CHART_COLUMNS) {
    return aggregateDailyStats(conversations, chartEarliestDate, chartLatestDate, showPercentage, language);
  };
  if (timeRangeInDays / constants.MISC.WEEKS_PER_MONTH <= constants.MAX_BAR_CHART_COLUMNS) {
    return aggregateWeeklyStats(conversations, chartEarliestDate, chartLatestDate, showPercentage, language);
  };
  if (timeRangeInDays / constants.MISC.DAYS_IN_MONTH <= constants.MAX_BAR_CHART_COLUMNS) {
    return aggregateMonthlyStats(conversations, chartEarliestDate, chartLatestDate, showPercentage, language);
  };
  return aggregateQuarterlyStats(conversations, chartEarliestDate, chartLatestDate, showPercentage, language);
};

function aggregateDailyStats(
  interactions: { startedTime: Date | null, botSuccess?: boolean | null }[], 
  startDate: Date, 
  endDate: Date, 
  showPercentage: boolean = true,
  language: 'en' | 'he'
) {
  const currentDate = startDate;
  const currentEndDate = endDate;

  currentDate.setHours(0,0,0,0);
  currentEndDate.setHours(23,59,59,999);
  const dailyStats: Record<string, { success: number, total?: number }> = {};
 
  interactions.forEach(interaction => {
    if (!interaction.startedTime) return;

  const interactionDate = interaction.startedTime;
  interactionDate.setHours(0, 0, 0, 0)

  if (interactionDate < currentDate || interactionDate > currentEndDate) {
    return [];
  }
  const dateKey = interactionDate.toLocaleDateString('en-US');
  if (!dailyStats[dateKey]) {
    dailyStats[dateKey] = { success: 0, ...(showPercentage && { total: 0 }) };
  }
  if (interaction.botSuccess) {
    dailyStats[dateKey].success += 1;
  };
  if (dailyStats[dateKey].total !== undefined) {
    dailyStats[dateKey].total += 1;
  }
  });
  return Object.entries(dailyStats)
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .map(([date, stats]) => {
      const dateString = new Date(date);
      const successTotal = stats.success;
      const grandTotal = stats.total;
      return {
        name: formatDate(dateString),
        label: formatDateLabel(dateString),
        [keyTranslations["successful"][language]]: grandTotal ? Math.round(successTotal / grandTotal * 100) : successTotal,
      }
    });
}

function aggregateWeeklyStats(
  interactions: { startedTime: Date | null, botSuccess?: boolean | null }[],
  startDate: Date,
  endDate: Date,
  showPercentage: boolean,
  language: 'en' | 'he'
) {
  const weeklyStats: Record<string, SuccessfulConversationStatType> = {};


  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const weekStart = getStartOfWeek(new Date(currentDate));
    const weekEnd = getEndOfWeek(new Date(currentDate));
    const weekKey = `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;
    if (!weeklyStats[weekKey]) {
      weeklyStats[weekKey] = {
        success: 0,
        startDate: new Date(weekStart),
        ...(showPercentage && { total: 0 })
      };
    }
    currentDate.setDate(currentDate.getDate() + 1);
  };
  interactions.forEach(interaction => {
    const date = interaction.startedTime;
    const weekStart = getStartOfWeek(date);
    const weekEnd = getEndOfWeek(date);
    const weekKey = `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;
    if (!weeklyStats[weekKey]) {
      throw new Error(`Week ${weekKey} not found in weeklyStats object`);
    }
    if (interaction.botSuccess) {
      weeklyStats[weekKey].success += 1;
    };
    if (weeklyStats[weekKey].total !== undefined) {
      weeklyStats[weekKey].total += 1
    }
  });

  return Object.entries(weeklyStats)
    .sort(([, a], [, b]) => a.startDate.getTime() - b.startDate.getTime())
    .map(([weekRange, stats]) => {
      const successTotal = stats.success;
      const grandTotal = stats.total;
      return {
        name: weekRange,
        label: formatMonthDay(stats.startDate),
        [keyTranslations["successful"][language]]: grandTotal ? Math.round(successTotal / grandTotal * 100) : successTotal,
      };
    });
};

function aggregateMonthlyStats(
  interactions: { startedTime: Date | null, botSuccess?: boolean | null }[],
  startDate: Date,
  endDate: Date,
  showPercentage: boolean,
  language: 'en' | 'he'
) {
  const monthlyStats: Record<string, SuccessfulConversationStatType> = {};
  const currentDate = startDate;
  while (currentDate <= endDate) {
    const monthKey = `${currentDate.toLocaleString('default', { month: 'short' })} ${currentDate.getFullYear()}`;
    if (!monthlyStats[monthKey]) {
      monthlyStats[monthKey] = {
        success: 0,
        startDate: new Date(currentDate),
        ...(showPercentage && { total: 0 })
      };
    }
    currentDate.setDate(currentDate.getDate() + 1);
  };

  interactions.forEach(interaction => {
    const date = interaction.startedTime;
    if (!date) throw new Error('Date is null');
    const monthKey = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    if (!monthlyStats[monthKey]) {
      throw new Error(`Month ${monthKey} not found in monthlyStats object`);
    }
    if (interaction.botSuccess) {
      monthlyStats[monthKey].success += 1;
    };
    if (monthlyStats[monthKey].total !== undefined) {
      monthlyStats[monthKey].total += 1;
    };
  });

  return Object.entries(monthlyStats)
    .sort(([, a], [, b]) => a.startDate.getTime() - b.startDate.getTime())
    .map(([month, stats]) => {
      const successTotal = stats.success;
      const grandTotal = stats.total;

      return {
        label: month,
        [keyTranslations["successful"][language]]: grandTotal ? Math.round(successTotal / grandTotal * 100) : successTotal,
      };
    });
};

function aggregateQuarterlyStats(
  interactions: { startedTime: Date | null, botSuccess?: boolean | null }[],
  startDate: Date,
  endDate: Date,
  showPercentage: boolean,
  language: 'en' | 'he'
) {
  const quarterlyStats: Record<string, SuccessfulConversationStatType> = {};
  const currentDate = startDate;
  while (currentDate <= endDate) {
    const quarter = Math.floor(currentDate.getMonth() / 3) + 1;
    const quarterKey = `Q${quarter} ${currentDate.getFullYear()}`;
    if (!quarterlyStats[quarterKey]) {
      quarterlyStats[quarterKey] = {
        success: 0,
        startDate: new Date(currentDate),
        ...(showPercentage && { total: 0 })
      };
    }
    currentDate.setDate(currentDate.getDate() + 1);
  };
  interactions.forEach(interaction => {
    const date = interaction.startedTime;
    if (!date) throw new Error('Date is null');
    const quarter = Math.floor(date.getMonth() / 3) + 1;
    const quarterKey = `Q${quarter} ${date.getFullYear()}`;
    if (!quarterlyStats[quarterKey]) {
      throw new Error(`Quarter ${quarterKey} not found in quarterlyStats object`);
    };
    if (interaction.botSuccess || !showPercentage) {
      quarterlyStats[quarterKey].success += 1;
    };
    if (quarterlyStats[quarterKey].total !== undefined) {
      quarterlyStats[quarterKey].total += 1;
    };
  });
  return Object.entries(quarterlyStats)
    .sort(([, a], [, b]) => a.startDate.getTime() - b.startDate.getTime())
    .map(([quarter, stats]) => {
      const successTotal = stats.success;
      const grandTotal = stats.total;
      return {
        label: quarter,
        [keyTranslations["successful"][language]]: grandTotal ? Math.round(successTotal / grandTotal * 100) : successTotal,
      };
    });
};