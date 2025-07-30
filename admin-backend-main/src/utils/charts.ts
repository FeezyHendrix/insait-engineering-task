export const generateDisplayTime = (hour: number) => {
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    const ampm = hour < 12 ? "AM" : "PM";
    return { displayHour, ampm }
}

export function getDateRange(month: string): { startDate: Date; endDate: Date } {
    const [monthStr, yearStr] = month.split('-');
    const yearNum = parseInt(yearStr, 10);
    const monthNum = parseInt(monthStr, 10);
    const sixDaysAgo = new Date();
    sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);

    const startDate = (month === 'last7Days') ? sixDaysAgo : new Date(Date.UTC(yearNum, monthNum, 1));

    const endDate = (month === 'last7Days') ? new Date() : new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1)

    return { startDate, endDate };
}

export function getStartOfWeek(date: Date | null): Date {
    if (!date) throw new Error('Date is null');
    const day = date.getDay();
    const diff = date.getDate() - day;
    const startDate = new Date(date.setDate(diff));
    startDate.setHours(0, 0, 0, 0);
    return startDate;
}

export function getEndOfWeek(date: Date | null): Date {
    if (!date) throw new Error('Date is null');
    const startOfWeek = getStartOfWeek(date);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return endOfWeek
}


export function formatDate(date: Date): string {
    const month = date.toLocaleString('default', { month: 'short' });
    return `${month} ${date.getDate()}`
}

export function formatDateLabel(date: Date): string {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return formatDate(date);
}

export function formatMonthDay(weekStart: Date): string {
    const weekEnd = getEndOfWeek(weekStart)

    const startMonth = weekStart.toLocaleString('default', { month: 'short' });
    const endMonth = weekEnd.toLocaleString('default', { month: 'short' });

    const label = startMonth === endMonth
        ? `${startMonth} ${weekStart.getDate()}-${weekEnd.getDate()}`
        : `${startMonth} ${weekStart.getDate()}-${endMonth} ${weekEnd.getDate()}`;

    return label
}

export const generateChartTimeFilter = (startDate: string | undefined, endDate: string | undefined) => {
    const filters: { [key: string]: any } = {};
    if (startDate && startDate !== 'null') {
        filters['gte'] = new Date(startDate)
    }
        
    if (endDate && endDate !== 'null') {
        filters['lte'] = new Date(endDate)
    }

    return filters;
};

export const useOptionalFlowId = (flowId: string | null | undefined) => flowId !== undefined ? { flowId } : {};