import constants from "../../constants";
import { PeakTimeData } from "../../types/interfaces";
import { prisma } from "../../libs/prisma";
import { generateChartTimeFilter, generateDisplayTime, useOptionalFlowId } from "../../utils/charts";

export const fetchPeakTime = async (startDate: string | undefined, endDate: string | undefined, flowId?: string | null) => {
  const queryFilters = generateChartTimeFilter(startDate, endDate);
  const allInteractions: {startedTime: Date}[] = await prisma.interaction.findMany({
      where: {
        messageCount: {
          gt: 1
        },
        startedTime: queryFilters,
        ...useOptionalFlowId(flowId),
      },
      select: {
        startedTime: true
      }
    });
  
    if (allInteractions.length === 0) {
      return constants.ZERO_OBJECTS.PEAK_TIME_ZERO
    }
    
    const allInteractionTimes = allInteractions.map(i => i.startedTime);
    
    const peakTimeData: PeakTimeData[] = [];
    
    const days: string[] = constants.DAYS_NAMES;
    
    days.forEach((day) => {
      const dayData: { x: string; y: number }[] = [];
    
      for (let hour = 0; hour < 24; hour+=3) {
        const currentTimestamp = allInteractionTimes
          .filter((timestamp) => timestamp.getDay() === days.indexOf(day))
          .filter((timestamp) => timestamp.getHours() >= hour && timestamp.getHours() < hour + 3);
    
        const count = currentTimestamp.length;
        const { displayHour, ampm } = generateDisplayTime(hour);
        dayData.push({
          x: `${displayHour} ${ampm}`,
          y: count,
        });
      }
    
      peakTimeData.push({
        name: day,
        data: dayData,
      });
    });
    
    return peakTimeData;
  };
  