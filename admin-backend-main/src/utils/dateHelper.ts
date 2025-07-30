import constants from '../constants';
import { ValidationError } from './error';

export const isDateBetween = (
  startedTime: Date,
  dateToCalculate: Date,
  nextDay: Date
) => {
  return startedTime >= dateToCalculate && startedTime < nextDay;
};

export const dateSetter = (offset: number, date: Date = new Date()) => {
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  startDate.setDate(startDate.getDate() + offset);
  return startDate;
};

export const formatWeekName = (start: Date, end: Date) => {
  const startDate = start.getDate();
  const startMonth = start.getMonth();
  const startMonthName = constants.MONTH_NAMES[startMonth];
  const endDate = end.getDate();
  const endMonth = end.getMonth();
  const endMonthName = constants.MONTH_NAMES[endMonth];

  return `${startMonthName} ${startDate}-${
    startMonth !== endMonth ? endMonthName + ' ' : ''
  }${endDate}`;
};

export const getWeekRange = (date: Date) => {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay());
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(
    constants.MISC.END_OF_DAY.HOUR,
    constants.MISC.END_OF_DAY.MINUTE,
    constants.MISC.END_OF_DAY.SECOND,
    constants.MISC.END_OF_DAY.MILLISECOND
  );
  return { start, end };
};

export const validatePositiveInt = (input: any): number | false => {
  const str = Array.isArray(input) ? input[0] : input; // Handle arrays
  if (typeof str !== 'string' || !/^\d+$/.test(str)) {
    return false;
  }
  const num = Number(str);
  if (num <= 0) {
    return false;
  }
  return num;
};
