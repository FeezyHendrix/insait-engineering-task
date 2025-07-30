import { Method } from "axios";
import { OrderSortType, TableHeaderKeyType } from "./chat";
import { KnowledgeType } from "./knowledge";

export interface ClientParamType {
  path: string;
  isFullURL?: boolean;
  method: Method;
  data?: object;
  contentType?: string;
  headers?: Record<string, string>
}

export interface StatUpdateRequestType {
  month?: string;
  chartType?: string;
  url?: string;
  type?: string;
  startDate?: string | null;
  endDate?: string | null;
  language?: string;
  selectedProduct?: string | null;
  flowId?: string | null;
}

export interface UnansweredQsRequestType {
  page: number;
  limit: number;
}

export interface PaginationSortRequestType {
  page: number;
  limit: number;
  order: OrderSortType,
  orderBy: TableHeaderKeyType
  search?: string
  type?: string
  filters?: {
    [key: string]: string | number | boolean;
  }
}

export interface SupportDataRequestType {
  subject: string;
  companyName: string,
  message: string,
  priority: string,
  requestType: string,
  status: string,
  chatURL: string,
  notificationEmails: string[]
}

export interface ConversationDataRequestType {
  id: number;
}

export interface UnansweredQArchiveRequestType {
  unansweredQId: string;
  archive: boolean
}
export interface KnowledgeTypeRequestType {
  data: KnowledgeType;
  isUpdate: boolean
}

export interface ChatDataRequestParams {
  page?: number;
  order: OrderSortType,
  orderBy: TableHeaderKeyType
  returnAll?: boolean;
  itemsPerPage?: number;
  sentiment?: string
  persona?: string
  node?: string
  search?: string
  status?: string
  priority?: string
  selectedRating?: number | null
  startDate?: string | null;
  endDate?: string | null;
  flowId?: string | null;
}
interface Page {
  id: number;
  pagePath: string;
  pageTitle: string;
  pageDescription: string;
  status: string;
  startTime: string;
  endTime: string | null;
  url: string;
  words: number;
}
export interface CrawlDataRequestParams {
  tenant?: string;
  url?: string;
}

export interface AppendPageRequestParams {
  pageIds: string[];
  tenant: string;
}

export interface ReportDataRequestParams {
  page?: number;
  order: OrderSortType,
  itemsPerPage?: number;
  orderBy: TableHeaderKeyType,
  search?: string
}

// Superset types
export interface SupersetAuthRequest {
  username: string;
  password: string;
  provider: string;
  refresh: boolean;
}

export interface SupersetDashboard {
  id: string;
  dashboard_title: string;
  url: string;
  published: boolean;
}

export interface SupersetEmbeddedConfig {
  uuid: string;
  allowed_domains: string[];
}

export interface SupersetGuestTokenRequest {
  user: {
    username: string;
  };
  resources: Array<{
    type: string;
    id: string;
  }>;
  rls: Array<any>;
}
