import { HeatMapType } from "@/types/chart";
import { calculatePercentagePortion } from "./";
import { MISC } from "./data";

export const transformAnsweredQuestionsDataToPercent = (data: any[], keyTranslations: { [key: string]: { [key: string]: string } }, language: string): any[] => {
  try {
    if (!data.length) return [];
    return data.map(item => {
      const totalQuestions = item[keyTranslations["answered"][language]] + item[keyTranslations["unanswered"][language]];

      const answeredPercentage = calculatePercentagePortion(totalQuestions, item[keyTranslations["answered"][language]])
      const notAnsweredPercentage = calculatePercentagePortion(totalQuestions, item[keyTranslations["unanswered"][language]])
      return {
        ...item,
        [keyTranslations["answered"][language]]: answeredPercentage,
        [keyTranslations["unanswered"][language]]: notAnsweredPercentage,
      };
    });
  } catch (error) {
    return []
  }
}

export const arrangePeakDataDayOrder = (originalData: Array<HeatMapType>): ApexAxisChartSeries => {

  if(!Array.isArray(originalData)) return [];

  const maxValue = Math.max(...originalData.flatMap(day => day.data.map(entry => entry.y)));

  const normalizedData = originalData.map(day => ({
    name: day.name,
    data: day.data.map(entry => ({
      x: entry.x,
      y: Math.round((entry.y / maxValue) * 100),
      z: entry.y,
    }))
  }));
  

  const dayOrder = ["Sun", "Sat", "Fri", "Thu", "Wed", "Tue", "Mon"];
  const transformedData = dayOrder.map(day => {
    const dayData = normalizedData.find(d => d.name === day);
    if (!dayData) return { name: day, data: [] }
    return { ...dayData };
  });

  return transformedData;
};

export const formatInteractionDuration = (duration: number) => {
  if (isNaN(duration) || duration === 0) {
    return "-";
  };
  const durationToDisplay = duration < MISC.SECONDS_PER_MINUTE ? 
    `${Math.round(duration)}s` : 
    `${Math.floor(duration / MISC.SECONDS_PER_MINUTE)}m ${Math.round(duration % MISC.SECONDS_PER_MINUTE)}s`;
  return durationToDisplay;
};

export const transformRatingDataForChart = (data:   { [key: string]: number }): {
  transformedData: {name: string, percent: number, count: number, percentageString: string}[], 
  totalRatings: number | null, 
  averageRating: number | null
} => {
  try {
    if (!data || data.length === 0) return {
      transformedData: [],
      totalRatings: null,
      averageRating: null
    };
    const totalRatings = Object.values(data).reduce((acc, curr) => acc + curr, 0);
    const averageRating = Object.keys(data).reduce((acc, curr) => acc + parseInt(curr) * data[curr], 0) / totalRatings;
    const transformedData = Array.from({ length: 5 }, (_, i) => {
      const rating = i + 1;
      const count = data[rating];
      return {
      name: `${rating} Star${rating > 1 ? 's' : ''}`,
      percent: Math.round(count * 100 / totalRatings) || 0,
      count,
      percentageString: isNaN(count) ? '' : `${Math.round(count * 100 / totalRatings)}%`,
      };
    }).reverse();
    return { transformedData, totalRatings, averageRating }
  } catch (error) {
    return {
      transformedData: [],
      totalRatings: null,
      averageRating: null
    }
  }
};