import { AnalysisPropsType } from "./analytics";
import { CountryInfoType } from "./batch";
import { timeButtonSelectionType } from "./chart";
import {  TransferredConversation } from "./chat";
import { AdminLanguage, BotLanguage, R2REditableParams, R2RQueryEditableParams, SkinNames, UrlEntry } from "./configurations";
import { ChatDataTableBodyType, CompletionTableBodyType, DashboardPropsType, StringObjectType } from "./dashboard";

export interface AnalyticsState {
  dashboard: {
    loading: boolean,
    error: string,
    data: DashboardPropsType | null
  },
  analytics: {
    loading: boolean,
    error: string,
    data: AnalysisPropsType | null
  }
  chat: {
    loading: boolean,
    data: Array<CompletionTableBodyType>
    totalRecords: number
  },
  liveChat: {
    loading: boolean,
    readyState: boolean
    inbox: Array<TransferredConversation>
  },
  chatData: {
    loading: boolean,
    data: Array<ChatDataTableBodyType>
    totalRecords: number
  },
  charts: {
    loading: boolean,
  },
  globalFilters: {
    startDate: string | null,
    endDate: string | null,
    button: timeButtonSelectionType
    flowId: string | null
  },
  favoriteCharts: string[]
}
 
export interface UpdateInteractionPayload {
  id: string;
  value: string;
}

export interface AuthState {
  isAuth: boolean;
  token: string | null;
  currentUser: string | null;
}

export interface TablePayloadType {
  [key: string]: {
    columns: string[];
  }
}

export type LanguageShortType = 'en' | 'he';

export interface CompanyConfigState {
  keycloakUrl: string | null;
  keycloakRealm: string | null;
  keycloakClientID: string | null;
  isConfig: boolean | null;
  company: string;
  charts: string[];
  metrics: string[];
  pages: {
    internal: string[],
    regularUsers: string[]
  };
  tables: TablePayloadType;
  dateSettings: string | null;
  language: LanguageShortType;
  batchChannels: string[];
  mockData: boolean;
  countryInfo: CountryInfoType;
  knowledgeSource: string[];
  specialTerms: StringObjectType;
  allDataFields: string[];
}

export interface SettingsState {
  editable: {
    bot: {
      ui: {
        bot_name: string | null,
        bot_image: string| null,
        disclaimer_text: string | null,
        color1: string | null,
        color2: string | null,
        default_open_enabled: boolean,
        skin_name: SkinNames | null,
        language: BotLanguage | null,
        page_title: string | null,
        button_text: string | null,
        streaming_enabled: boolean,
        ab_test_percentage: number | null,
        preview_enabled: boolean,
        disclaimer_enabled: boolean,
      },
      api: {
        whitelisted_urls: UrlEntry[],
        blacklisted_urls: UrlEntry[],
        first_message: string | null,
        first_prompt: string | null,
        second_prompt: string | null,
        use_second: boolean | null,
        use_parse_question: boolean | null,
        use_naive_history: boolean | null, 
        r2r_wrapper_params: R2REditableParams | null
        r2r_query_params: R2RQueryEditableParams | null
      }
    },
    admin: {
      ui: {
        language: AdminLanguage | null
      }
    }
  },
  loading: boolean,
  error: string,
  editEnabled: boolean,
  showInternalPage: boolean,
}

export interface LoginPreferencesState {
  google: {
    buttonText: string
    loading: boolean
  }
  microsoft: {
    buttonText: string
    loading: boolean
  },
  other: {
    buttonText: string
    loading: boolean
  },
  provider: 'google' | 'microsoft' | 'other' | null
}

export interface LoginStatePayload {
  provider: 'google' | 'microsoft' | 'other'
  loading?: boolean
  buttonText?: string
}