import dayjs, { Dayjs } from 'dayjs'
import { GroupingType } from '../mswUtils/msw.type'

function getGroupingType(start: dayjs.Dayjs, end: dayjs.Dayjs): GroupingType {
  const diffInDays = end.diff(start, 'day')
  if (diffInDays <= 10) return 'daily'
  if (diffInDays <= 60) return 'weekly'
  return 'monthly'
}

export function generateGroupedData<T>(
  start: dayjs.Dayjs,
  end: dayjs.Dayjs,
  dataGenerator: (
    dateOrRangeStart: dayjs.Dayjs,
    dateOrRangeEnd?: dayjs.Dayjs
  ) => T
): (T & { name: string; label: string })[] {
  const grouping = getGroupingType(start, end)
  const results: Array<T & { name: string; label: string }> = []

  if (grouping === 'daily') {
    let current = start.startOf('day')
    while (current.isBefore(end) || current.isSame(end, 'day')) {
      const dataFields = dataGenerator(current)

      // “Today” / “Yesterday” labeling
      let label = current.format('MMM D')
      if (current.isSame(dayjs(), 'day')) label = 'Today'
      else if (current.isSame(dayjs().subtract(1, 'day'), 'day'))
        label = 'Yesterday'

      results.push({
        name: current.format('MMM D'),
        label,
        ...dataFields,
      })

      current = current.add(1, 'day')
    }
  } else if (grouping === 'weekly') {
    let periodStart = start.startOf('day')
    while (periodStart.isBefore(end)) {
      const periodEnd = periodStart.add(6, 'day')
      const blockEnd = periodEnd.isAfter(end) ? end : periodEnd

      const dataFields = dataGenerator(periodStart, blockEnd)

      const name = `${periodStart.format('MMM D')} - ${blockEnd.format(
        'MMM D'
      )}`
      const label = `${periodStart.format('MMM D')}-${blockEnd.format('D')}`

      results.push({
        name,
        label,
        ...dataFields,
      })

      periodStart = periodEnd.add(1, 'day')
    }
  } else {
    // monthly
    let currentMonth = start.startOf('month')
    while (currentMonth.isBefore(end) || currentMonth.isSame(end, 'month')) {
      const dataFields = dataGenerator(currentMonth)

      results.push({
        name: currentMonth.format('MMM YYYY'),
        label: currentMonth.format('MMM YYYY'),
        ...dataFields,
      })

      currentMonth = currentMonth.add(1, 'month')
    }
  }

  return results
}


export const randomBetween = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const getValidatedDateRange = (
  startDate: string | null,
  endDate: string | null,
  monthsAgo: number = 11
): [Dayjs, Dayjs] => {
  // 1) Provide defaults if missing
  let start = startDate ? dayjs(startDate) : dayjs().subtract(monthsAgo, 'month')
  let end = endDate ? dayjs(endDate) : dayjs()

  // 2) If either date is invalid, fallback to “monthsAgo -> now”
  if (!start.isValid() || !end.isValid()) {
    start = dayjs().subtract(monthsAgo, 'month')
    end = dayjs()
  }

  // 3) Swap if start > end
  if (start.isAfter(end)) {
    const tmp = start
    start = end
    end = tmp
  }

  return [start, end]
}

export const getReducedValue = (baseStr: string, reductionFactor: number): string => {
  const base = parseInt(baseStr.replace(/,/g, ''))
  return Math.floor(base * reductionFactor).toLocaleString()
}

export const getReductionFactor = (days: number) => {
  if (days <= 1) return 0.07;
  if (days <= 7) return 0.20;
  if (days <= 30) return 0.5;
  if (days <= 90) return 0.75;
  return 1;
}

export const interpolateRange = (
  factor: number,
  minVal: number,
  maxVal: number
): number => {
  if (factor < 0) factor = 0
  if (factor > 1) factor = 1
  return minVal + (maxVal - minVal) * factor
}