import { useState } from "react";
import { CrawlInput } from "./CrawlInput";
import { PagesList } from "./PagesList";
import { CrawledPage, CrawledDomain } from "@/lib/types";
import { toast } from 'react-toastify';

interface WebCrawlerProps {
  onAddPages: (pages: CrawledPage[], domain: string, url: string) => void;
  onDomainCrawled: (domain: CrawledDomain) => void;
  crawledDomains?: CrawledDomain[];
}

type ScrapingStatus = Record<string, "pending" | "scraping" | "scraped">;

export const WebCrawler = ({ onAddPages, onDomainCrawled, crawledDomains = [] }: WebCrawlerProps) => {
  const [crawlPhase, setCrawlPhase] = useState({
    isActive: false,
    url: "",
    domain: "",
    progress: 0,
    status: "pending",
    pages: [] as CrawledPage[],
  });
  
  const [scrapingStatus, setScrapingStatus] = useState<ScrapingStatus>({});

  const extractDomain = (url: string): string => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  const handleStartCrawl = async (url: string) => {
    const domain = extractDomain(url);
    
    setCrawlPhase({
      isActive: true,
      url,
      domain,
      progress: 0,
      status: "STARTING",
      pages: [],
    });

    // Simulate crawling progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Mock discovered pages
        const mockPages: CrawledPage[] = [];

        setCrawlPhase(prev => ({
          ...prev,
          progress: 100,
          status: "Crawl completed",
          pages: mockPages,
        }));

        // Create domain record
        const newDomain: CrawledDomain = {
          id: `domain-${Date.now()}`,
          domain,
          url,
          crawledAt: new Date().toISOString(),
          pagesDiscovered: mockPages.length,
          pagesScraped: 0,
          pages: mockPages
        };
        
        onDomainCrawled(newDomain);
      } else {
        let status = "Crawling pages...";
        if (progress > 75) status = "Indexing content...";
        else if (progress > 50) status = "Processing links...";
        else if (progress > 25) status = "Analyzing structure...";
        
        setCrawlPhase(prev => ({
          ...prev,
          progress,
          status,
        }));
      }
    }, 500);
  };

  const handlePageSelect = async (pageId: string) => {
    // Toggle selection
    setCrawlPhase(prev => ({
      ...prev,
      pages: prev.pages.map(page =>
        page.id === pageId ? { ...page, selected: !page.selected } : page
      ),
    }));

    const page = crawlPhase.pages.find(p => p.id === pageId);
    if (!page) return;

    // If selecting (not deselecting), start scraping
    if (!page.selected) {
      setScrapingStatus(prev => ({ ...prev, [pageId]: "scraping" }));
      
      // Simulate scraping delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setScrapingStatus(prev => ({ ...prev, [pageId]: "scraped" }));
      
      // Add to knowledge base
      onAddPages(
        [page],
        crawlPhase.domain,
        crawlPhase.url
      );

      toast.success(`${page.title} has been added to your knowledge base.`);
    }
  };

  const handleAddToKnowledgeBase = (selectedPages: CrawledPage[]) => {
    // Update scraping status for selected pages
    const newScrapingStatus = { ...scrapingStatus };
    selectedPages.forEach(page => {
      newScrapingStatus[page.id] = "scraping";
    });
    setScrapingStatus(newScrapingStatus);
    
    // Add pages to knowledge base
    onAddPages(
      selectedPages,
      crawlPhase.domain,
      crawlPhase.url
    );
    
    // Reset selection
    setCrawlPhase(prev => ({
      ...prev,
      pages: prev.pages.map(page => ({
        ...page,
        selected: false
      }))
    }));

    toast.success(`${selectedPages.length} pages are being processed`);
  };

  return (
    <div className="space-y-4">
      <CrawlInput 
        onStartCrawl={handleStartCrawl}
        isLoading={crawlPhase.isActive && crawlPhase.progress < 100}
      />
      
      
      {crawlPhase.pages.length > 0 && (
        <div className="border rounded-lg bg-white">
          <PagesList 
            pages={crawlPhase.pages}
            onPageSelect={handlePageSelect}
            onAddToKnowledgeBase={handleAddToKnowledgeBase}
            scrapingStatus={scrapingStatus}
          />
        </div>
      )}
    </div>
  );
};
