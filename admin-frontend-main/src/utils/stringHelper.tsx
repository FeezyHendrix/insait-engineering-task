import { camelToSentenceCase } from "./data"
import { StringObjectType } from "../types/dashboard";
import { t } from "i18next";
import dayjs from "dayjs";

export const CapitalizeEachWord = (str: string) => {
  const string = str.includes('_') ? str.split('_').join(' ') : str
  const words = string.split(' ')
  const capitalizedWords: string[] = []
  words.forEach(element => {
    capitalizedWords.push(element[0].toUpperCase() + element.slice(1))
  })
  return capitalizedWords.join(' ')
}

export const convertToClickableLinks = (str: string): React.ReactNode => {
  const strType = typeof str
  if(strType === 'number') return str;
  if(strType !== 'string') return '';
  const urlMatch = str.match(/(https?:\/\/[^\s]+|www\.[^\s]+)/)
  if (urlMatch) {
    return (
      <a href={str} className=" text-blue-600" target='_blank' rel='noopener noreferrer'>
        {str}
      </a>
    )
  }
  return str
}

export const formatDataViewText = (data: any, dateSettings: string): React.ReactNode => {
  if(!data) return '';
  const isValidDate = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(data)
  if (typeof data === 'object') {
    if (Array.isArray(data)) {
      return data.map((item, index) => (
        <ul key={index}>
          {Object.keys(item).map((subKey) => (
            <li key={subKey}>
              <strong>{camelToSentenceCase(subKey).replace(/_/g, ' ')}:</strong> {formatDataViewText((item)[subKey], dateSettings)}
            </li>
          ))}
        </ul>
      ));
    }

    return (
      <div>
        {Object.keys(data).map((key) => (
          <div key={key}>
            <strong>{camelToSentenceCase(key).replace(/_/g, ' ')}:</strong> {convertToClickableLinks((data)[key].toString())}
            </div>
        ))}
      </div>
    );
  }
  return isValidDate ? dayjs(data).format(`${dateSettings} HH:MM`) : convertToClickableLinks(data);
};

export const formatMenuTextDisplay = (text: string, specialTerms: StringObjectType) => {
  switch (text) {
    case "menu.completedSessions":
      return specialTerms?.completedSessions || t(text)
    default:
      return t(text);
  }
}

export const getFilteredData = (data: any, fieldsToKeep: string[]) => {
  if(!data) return {}
  if (!fieldsToKeep.length) return data;
  return Object.fromEntries(
    Object.entries(data).filter(([key]) => fieldsToKeep.includes(key))
  );
};

export const formatRating = (rating: number | null | undefined): string => {
  if (!rating) return '-';
  return rating % 1 === 0 ? Math.floor(rating).toString() : rating.toFixed(1);
};

export function cn(...classes: (string | undefined)[]): string {  const allClasses = classes
  .filter((cls): cls is string => cls !== undefined && cls !== '')
  .flatMap(cls => cls.trim().split(/\s+/));
  
  return [...new Set(allClasses)].join(' ');
}

export function isValidUrl(url: string): boolean {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' +                    
    '([\\w-]+\\.)+[\\w-]{2,}' +              
    '(\\:[0-9]{1,5})?' +                   
    '(\\/.*)?$',                    
    'i'
  );
  return pattern.test(url.trim());
}

export function flattenNewlines(str: string): string {
  return str.replace(/[\r\n]+/g, ' ');
}
