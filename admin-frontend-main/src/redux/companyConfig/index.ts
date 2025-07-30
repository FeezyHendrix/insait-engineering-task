import { CountryInfoType } from "@/types/batch";
import { StringObjectType } from "@/types/dashboard";
import { CompanyConfigState, LanguageShortType, TablePayloadType } from "@/types/redux";
import { getDirFromLang } from "@/utils";
import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";


const companyConfigInitialState: CompanyConfigState = {
    keycloakClientID: null,
    keycloakRealm: null,
    keycloakUrl: null,
    isConfig: false,
    company: "",
    charts: [],
    metrics: [],
    pages: {
      internal: [],
      regularUsers: []
    },
    tables:  {
      completedSessions: {
        columns: [
          'userId',
          'date',
          'name',
          'email',
          'country',
          'fullConversation',
          'allData',
        ],
      },
      chats: {
        columns: [
          'conversationId',
          'customerID',
          'date',
          'time',
          'rating',
          'messages',
          'fullConversation',
        ],
      },
    },
    dateSettings: null,
    language: 'en',
    batchChannels: ['WHATSAPP', 'SMS', 'EMAIL'],
    mockData: false,
    countryInfo: {
      name: '',
      code: '',
    },
    knowledgeSource: [],
    specialTerms: {},
    allDataFields: [],
  };
  
  export const companyConfigSlice = createSlice({
    name: "companyConfig",
    initialState: companyConfigInitialState,
    reducers: {
      setKeycloakClientID: (state,action : PayloadAction<string>) => {
        state.keycloakClientID = action.payload;
      },
      setKeycloakRealm: (state,action : PayloadAction<string>) => {
        state.keycloakRealm = action.payload;
      },
      setKeycloakUrl: (state, action: PayloadAction<string>) => {        
        state.keycloakUrl = action.payload
      },
      resetCompanyConfig: (state) => {
        state.keycloakClientID = null;
        state.keycloakRealm = null;
        state.keycloakUrl = null;
      },
      setIsConfig: (state, action : PayloadAction<boolean>) => {
        state.isConfig = action.payload
      },
      setCompany: (state, action: PayloadAction<string>) => {
        state.company = action.payload
      },
      setCharts: (state, action: PayloadAction<string[]>) => {
        state.charts = action.payload
      },
      setMetrics: (state, action: PayloadAction<string[]>) => {
        state.metrics = action.payload
      },
      setPages: (state, action: PayloadAction<{ internal: string[], regularUsers: string[] }>) => {
        state.pages = action.payload
      },
      setTables: (state, action: PayloadAction<TablePayloadType>) => {
        state.tables = action.payload
      },
      setDateSettings: (state, action: PayloadAction<string>) => {
        state.dateSettings = action.payload
      },
      setLanguage: (state, action: PayloadAction<LanguageShortType>) => {
        state.language = action.payload
        document.documentElement.lang = action.payload
        document.documentElement.dir = getDirFromLang(action.payload)
      },
      setBatchChannels: (state, action: PayloadAction<string[]>) => {
        state.batchChannels = action.payload
      },
      setMockData: (state, action: PayloadAction<boolean>) => {
        state.mockData = action.payload
      },
      setCountryInfo: (state, action: PayloadAction<CountryInfoType>) => {
        state.countryInfo = action.payload
      },
      setSpecialTerms: (state, action: PayloadAction<StringObjectType>) => {
        state.specialTerms = action.payload
      },
      setAllDataFields: (state, action: PayloadAction<Array<string>>) => {
        state.allDataFields = action.payload
      },
      setKnowledgeSource: (state, action: PayloadAction<string[]>) => {
        state.knowledgeSource = action.payload
      },
    }
  })
  
  export const { setKeycloakClientID, setKeycloakRealm, setKeycloakUrl, resetCompanyConfig, setIsConfig, setCharts, setMetrics, setPages, setTables, setDateSettings, setCompany, setLanguage, setBatchChannels, setMockData, setCountryInfo, setSpecialTerms, setAllDataFields, setKnowledgeSource } = companyConfigSlice.actions;
  export const selectKeycloakClientID = (state: { companyConfig: CompanyConfigState }) => state.companyConfig.keycloakClientID;
  export const selectKeycloakRealm = (state: { companyConfig: CompanyConfigState }) => state.companyConfig.keycloakRealm;
  export const selectKeycloakUrl = (state: { companyConfig: CompanyConfigState }) => state.companyConfig.keycloakUrl;
  export const selectIsConfig = (state: {companyConfig: CompanyConfigState }) => state.companyConfig.isConfig;
  export const selectDateSettings = (state: {companyConfig: CompanyConfigState}) => state.companyConfig.dateSettings;
  export const selectCompany = (state: {companyConfig: CompanyConfigState}) => state.companyConfig.company;
  export default companyConfigSlice.reducer