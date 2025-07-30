
export type KnowledgeItemType = 'document' | 'qa' | 'link';

export interface Tag {
  id: string;
  name: string;
  color?: string;
}

export interface KnowledgeItem {
  id: string;
  name: string;
  type: KnowledgeItemType;
  url?: string | null;
  pagePath?: string | null;
  pageTitle?: string | null;
  pageDescription?: string | null;
  words?: number | null; published?: boolean;
  key?: string | null;
  size?: number | null;
  hash?: string | null;
  createdAt: string;
  status?: 'SCRAPING' | 'PENDING' | 'COMPLETED' | 'ERROR';
  crawlingJobId?: string | null;
  publishStatus?: 'published' | 'draft';
  tags?: Tag[];
  pending?: boolean;
  question?: string | null;
  answer?: string | null;
  product?: string | null;
  active?: boolean;
  hint?: string | null;
  r2rId?: string | null;
}

export interface KnowledgeCard {
  title: string;
  description: string;
  type: KnowledgeItemType;
  url?: string | null;
  tags: Tag[];
  question?: string;
  answer?: string;
  pending: boolean;
  status: 'Pending Approval' | 'Approved';
  fileType?: string; 
  fileSize?: number; // Added fileSize property
}

export interface CrawledPage {
  id: string;
  title: string;
  url: string;
  description: string;
  selected: boolean;
  wordCount?: number;
  language?: string;
  lastModified?: string;
}

export interface CrawlStatus {
  isLoading: boolean;
  progress: number;
  status: string;
  pages: CrawledPage[];
}

export interface CrawledDomain {
  id: string;
  domain: string;
  url: string;
  crawledAt: string;
  pagesDiscovered: number;
  pagesScraped: number;
  pages: CrawledPage[];
}

export type FilterType = 'all' | 'document' | 'qa' | 'link' | 'cache';

export type PublishStatus = 'all' | 'published' | 'draft';

export interface CrawlPhase {
  isActive: boolean;
  url: string;
  domain: string;
  status: CrawlStatus;
}

export interface ScrapePhase {
  isActive: boolean;
  pages: CrawledPage[];
  domain: string;
  url: string;
}

export type DocumentTypeForBackend = 'document' | 'qa' | 'link';

export type HintActionType = "delete" | "add" | "edit"
