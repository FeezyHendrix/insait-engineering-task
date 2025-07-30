import { DateRange, ExportDateOptions, GroupedLiveMessagesDataType, LiveMessagesDataType } from "@/types/chat";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/he'; 
import { t } from "i18next";
import { store } from "@/redux/store";

dayjs.extend(relativeTime);

export const groupMessagesByDate = (messages: LiveMessagesDataType[]): GroupedLiveMessagesDataType[] => {
  const groupedMessages: { [key: string]: LiveMessagesDataType[] } = {};
  
  messages.forEach((message) => {
    const today = new Date(); // TODO  - fix later today is hardcoed
    const dateString = today.toISOString().split("T")[0];
    const combinedString = `${dateString} ${message.time}`;
    const formattedDate = dayjs(combinedString).format('YYYY-MM-DD');
    if (!groupedMessages[formattedDate]) {
      groupedMessages[formattedDate] = [];
    }
    groupedMessages[formattedDate].push(message);
  });

  return Object.keys(groupedMessages).map((key) => ({
    time: key,
    data: groupedMessages[key],
  }));
};

const parseValueToDate = (dateVal: string | number): dayjs.Dayjs | null => {

  const cleanedDate = typeof dateVal === 'string' ? dateVal.replace(/\.\d+/, '') : dateVal;

  const actualDate = dayjs(cleanedDate);
  return actualDate.isValid() ? actualDate : null;
}


export const convertDateToReadableFormat = (dateVal: string | number, format?: string): string => {
  const date = parseValueToDate(dateVal);
  const now = dayjs();
  if(!date) return dateVal?.toString();
  const dateOutput = formatDateOutput(date, now, format)
  return dateOutput;
};

export const convertNumberToReadableFormat = (dateVal: number, format?: string): string => {
  const date = dayjs(dateVal);
  const now = dayjs();  
  const dateOutput = formatDateOutput(date, now, format)
  return dateOutput;
};

export const convertDatetimeToDateOrTime = (last_message_time: string | undefined) => {
  if (last_message_time) {
    const lastMessageTime = new Date(last_message_time);
    const today = new Date();
    if (lastMessageTime.getDate() === today.getDate()) {
      const lastMessageHours = lastMessageTime.getHours()
      const lastMessageMinutes = String(lastMessageTime.getMinutes()).padStart(2, '0');
      let displayHour;
      let ampm;
      if (lastMessageHours <= 11) {
        ampm = "AM"
        if (lastMessageHours === 0) {
          displayHour = 12
        } else {
          displayHour = lastMessageHours
        }
      } else {
        ampm = "PM"
        displayHour = lastMessageHours - 12
      }
      return `${displayHour}:${lastMessageMinutes} ${ampm}`
    }
    let day: number = lastMessageTime.getDate();
    let month: number = lastMessageTime.getMonth() + 1;
    let year: number = lastMessageTime.getFullYear();
    let formattedDay: string = day < 10 ? '0' + day : day.toString();
    let formattedMonth: string = month < 10 ? '0' + month : month.toString();
    let formattedDate: string = formattedDay + '/' + formattedMonth + '/' + year;
    return formattedDate
  }
}

export const convertUTCtoLocalTimeString = (utcString: string) => {
  const utcDate = new Date(utcString);
  const hours = utcDate.getHours();
  const minutes = utcDate.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

  return `${formattedHours}:${formattedMinutes} ${ampm}`;
}


export const convertDatetimeToTime = (dateTime: string | undefined) => {
  if (dateTime) {
    const lastMessageTime = parseValueToDate(dateTime);
    if(!lastMessageTime) return dateTime.toString();

    const lastMessageHours = lastMessageTime.hour()
    const lastMessageMinutes = String(lastMessageTime.minute()).padStart(
      2,
      '0'
    )
    let displayHour
    let ampm
    if (lastMessageHours < 12) {
      ampm = 'AM'
      if (lastMessageHours === 0) {
        displayHour = 12
      } else {
        displayHour = lastMessageHours
      }
    } else {
      ampm = 'PM'
      displayHour = lastMessageHours === 12 ? 12 : lastMessageHours - 12
    }
    return `${displayHour}:${lastMessageMinutes} ${ampm}`
  }
};

export const convertNumberToTime = (dateTime: number | undefined) => {
  if (!dateTime) return '';  
    const lastMessageTime = new Date(dateTime);    
    const lastMessageHours = lastMessageTime.getHours();
    const lastMessageMinutes = String(lastMessageTime.getMinutes()).padStart(
      2,
      '0'
    );    
    const ampm = lastMessageHours >= 12 ? 'PM' : 'AM';
    const displayHour = lastMessageHours % 12 || 12;
    return `${displayHour}:${lastMessageMinutes} ${ampm}`;
}

export const getKnowledgeDateTime = (date: string) => {
  const currentDate = new Date(date)
  const hours = currentDate.getHours()
  const minutes = currentDate.getMinutes()
  const ampm = hours >= 12 ? 'pm' : 'am'
  const formattedDate = `${hours % 12 || 12}:${
    minutes < 10 ? '0' : ''
  }${minutes} ${ampm}, ${currentDate.getDate()} ${currentDate.toLocaleString(
    'default',
    { month: 'short' }
  )} ${currentDate.getFullYear()}`
  return formattedDate
}

const formatDateOutput = (date: dayjs.Dayjs, now: dayjs.Dayjs, format: string | undefined) => {
  const defaultLang = store.getState().companyConfig.language
  dayjs.locale(defaultLang ?? "en");

  if (date.isSame(now, 'day')) return format ? date.format(format) : t('date.today');
  if (date.isSame(now.subtract(1, 'day'), 'day')) return t('date.yesterday');
  if (date.isAfter(now.subtract(7, 'day'), 'day')) return date.format('dddd');
  return date.format('DD/MM/YYYY');
}


export const getStartEndDateRange = (value: ExportDateOptions): DateRange => {
  const endDate = dayjs().endOf('day').toISOString();

  switch (value) {
    case 'last7Days':
      return {
        startDate: dayjs().subtract(7, 'day').startOf('day').toISOString(),
        endDate
      };
    case 'last30Days':
      return {
        startDate: dayjs().subtract(30, 'day').startOf('day').toISOString(),
        endDate
      };
    default:
      return { startDate: '', endDate };
  }
};