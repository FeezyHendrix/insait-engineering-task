import { ReactNode } from "react";
import { AnalysisPropsType } from "./analytics";
import { DashboardPropsType, } from "./dashboard";

export interface NameValueType {
  name: string;
  value: number;
  month: number;
  year: number
}

export interface HeatMapType {
  name: string,
  data: HeatMapRowType[]
}

interface HeatMapRowType {
  x: string,
  y: number
}

export interface BarChartType {
  name: string,
  value: number,
  allMessagesCount?: number,
  allConversationsCount?: number,
  avgResponseTimeInDecimalSeconds?: number,
}

export interface MultiBarChartType {
  name: string,
  complexity: number,
  depth: number,
}

export interface PieChartType {
  data: Array<number>,
  label: Array<string>,
}

export interface FunnelChartType {
  value: number;
  name: string;
  short: string;
  step?: string;
  fill?: string; // this will be added on the frontend 
}


export interface AreaChartType {
  data: Array<[number, number]>
}

export interface LineChartType {
  date: string;
  a: number;
  b: number;
}

export type EarliestInteractionType = ''

export type PlaceholderDataType = 'pie' | 'product' | 'month' | 'heatMap' | 'funnel' | 'multichart' | 'day' | 'weekly' | 'line' | 'oneToFive' | 'positive-negative' | 'answeredAndUnanswered' | 'securityModuleCost' | 'averageLengthOfUserAndBotMessages' | 'responseTimeFromAClient' | 'charts'| 'policyCounter' | 'userRating' | 'messageReactionsChart';

export type PageType = 'dashboard' | 'analytics' | 'charts';

type DashboardPropsKeys = keyof DashboardPropsType;
type AnalysisPropsKeys = keyof AnalysisPropsType;


export type DataKeyType = DashboardPropsKeys | AnalysisPropsKeys ;

export interface CreateShapeProps {
  props: {
    x: number
    y: number
    width: number
    height: number
  }
  radius: number
  id: string
}

export interface ChartLoaderType {
  children: ReactNode
  type: PageType
  hasData?: boolean
  loading?: boolean
}

export interface CustomToolTipType {
  payload?: any
  additionalText?: string
  numericFormat?: boolean
}

export type ChatStatusType = 'dropOff' | 'customerService' | 'completion'

interface ApexChartContext {
  globals: {
    initialSeries: Array<{
      data: Array<{
        x: string;
        y: number;
        z: number;
      }>
    }>
  }
}

export interface HeatMapCustomTooltipParams {
  seriesIndex: number;
  dataPointIndex: number;
  w: ApexChartContext;
}

export interface CardVersionControl {
  title: string
  current: string
  update: string
}

export interface ExposureChartType {
  data: Array<number>
  categories: Array<string>
}
 export interface NodeData {
  nodeName: string;       
  instances: number;      
  wasLast: number;      
  wasLastPercentage: number;
  formattedNodeName: string;
}

export interface UniqueChartItem {
  key: string;
  count: number;
}

export interface UniqueChartData {
  label: string;
  data: UniqueChartItem[];
}


export type timeButtonSelectionType = 'today' | 'lastWeek' | 'lastMonth' | 'lastYear' | 'allTime' | 'custom' | null;

export type favoriteChartAction = 'add' | 'remove';

export type KeyTranslations = {
  answered: {
    en: string;
    he: string;
  };
  unanswered: {
    en: string;
    he: string;
  };
};

export type FlowOption = {
  label: string;
  value: string;
}