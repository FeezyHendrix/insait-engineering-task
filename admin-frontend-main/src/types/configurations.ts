import { SettingsState } from "./redux";

export type ConfigurationsTab = {
    id: number
    label: string
    value: 'agentUi' | 'agentSettings'
  }

export interface UrlEntry { url: string; variant: string }

export interface R2REditableParams {
  number_of_chunks: number | null;
  system_prompt: string | null;
}

export interface R2RQueryEditableParams {
  temperature: number | null,
  top_p: number | null,
  model: string | null,
  use_fulltext_search: boolean | null,
  search_strategy: R2RSearchStrategy | null,
  number_of_chunks: number | null,
  search_mode: R2RSearchModes | null,
  include_title_if_available: boolean | null 
}

export type SkinNames = 'default' | 'default2' | 'alternate' | 'minimalist';

export type BotLanguage = 'english' | 'hebrew';

export type AdminLanguage = 'en' | 'he';

export type EditablePatch = {editable: Partial<SettingsState['editable']>}

export type R2RSearchStrategy = 'vanilla' | 'query_fusion' | 'hyde'

export type R2RSearchModes = 'custom' | 'basic' | 'advanced'