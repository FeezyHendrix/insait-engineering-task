import { useState } from "react";
import { CrawledPage } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MdDescription, MdFiberManualRecord, MdOpenInNew, MdSearch } from "react-icons/md";

interface PagesListProps {
  pages: CrawledPage[];
  onPageSelect: (pageId: string) => void;
  onAddToKnowledgeBase: (selectedPages: CrawledPage[]) => void;
  scrapingStatus: Record<string, "pending" | "scraping" | "scraped">;
}

export const PagesList = ({ pages, onPageSelect, onAddToKnowledgeBase, scrapingStatus }: PagesListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredPages = pages.filter(page => 
    page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visiblePages = filteredPages.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const selectedPages = pages.filter(page => page.selected);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="relative flex-1 max-w-md">
          <MdSearch className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        {selectedPages.length > 0 && (
          <Button 
            onClick={() => onAddToKnowledgeBase(selectedPages)}
            className="ml-4 bg-[#10b3e8] hover:bg-[#10b3e8]/90"
          >
            <MdDescription className="mr-2 h-4 w-4" />
            Add to Knowledge Base ({selectedPages.length})
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {visiblePages.map((page) => (
          <div 
            key={page.id}
            className="flex items-start gap-3 p-3 rounded-md bg-white border border-gray-100 hover:border-gray-200 transition-colors"
          >

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <MdDescription className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <label 
                    htmlFor={page.id}
                    className="font-medium truncate cursor-pointer"
                  >
                    {page.title}
                  </label>
                </div>
                <a
                  href={page.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <MdOpenInNew className="h-4 w-4" />
                </a>
              </div>
              
              <span className="text-xs text-gray-500 block truncate mb-2">
                {page.url}
              </span>
              
              <div className="flex flex-wrap gap-2">
                {scrapingStatus[page.id] && (
                  <Badge variant="outline" className="text-xs h-5">
                    <MdFiberManualRecord className="h-3 w-3 mr-1" />
                    {scrapingStatus[page.id] === "scraping" ? (
                      "Scraping..."
                    ) : scrapingStatus[page.id] === "scraped" ? (
                      "Scraped ✅"
                    ) : (
                      "Pending"
                    )}
                  </Badge>
                )}
                {page.wordCount && (
                  <Badge variant="outline" className="text-xs h-5">
                    {page.wordCount} words
                  </Badge>
                )}
                {page.language && (
                  <Badge variant="outline" className="text-xs h-5">
                    {page.language.toUpperCase()}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
 
    </div>
  );
};
