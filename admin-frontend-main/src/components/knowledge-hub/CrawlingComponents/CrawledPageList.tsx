import React from "react";
import { Checkbox } from "@/components/elements/Checkbox";
import { FaCheckDouble } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import CrawledCard , { PageInfo } from "./CrawledCard";
import { appendURLToKnowledgeBase } from '@/redux/slices/knowledgeHub/request'
import { useAppDispatch } from '@/hook/useReduxHooks'
import constants from "@/utils/constants";
import { toast } from 'react-toastify'


interface CrawledPageListProps {
  pages: PageInfo[];
  selectedPages: Set<string>;
  onSelectPage: (id: string | number, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  isLoading: boolean;
  onRemovePages: (ids: string[]) => void;
  refetchItems: () => Promise<void>;
}

const CrawledPageList: React.FC<CrawledPageListProps> = ({
  pages,
  selectedPages,
  onSelectPage,
  onSelectAll,
  isLoading,
  onRemovePages,
  refetchItems
}) => {
  const dispatch = useAppDispatch();
  const { TENANT } = constants;
  const allSelected = pages.length > 0 && selectedPages.size === pages.length;

  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-between">
        <div className="flex items-center gap-2">
          <Checkbox
            id="select-all"
            checked={allSelected}
            onCheckedChange={(checked) => onSelectAll(!!checked)}
            disabled={isLoading || pages.length === 0}
          />
          <label
            htmlFor="select-all"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {allSelected ? "Deselect All" : "Select All"} 
            {pages.length > 0 && ` (${selectedPages.size}/${pages.length})`}
          </label>
        </div>
      </div>

      {isLoading && pages.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pages.map((_, i) => (
            <CrawledCard
              key={`loading-${i}`}
              page={{
                id: `loading-${i}`,
                url: _.url,
                pageTitle: _.pageTitle,
                pageDescription: _.pageDescription,
                words: _.words,
                startTime: new Date(_.startTime).toISOString(),
                status: _.status,
                pagePath: _.pagePath,
                endTime: new Date(_.endTime).toISOString(),
              }}
              isSelected={false}
              onToggleSelect={() => {}}
            />
          ))}
          
        </div>
      )  : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pages.map((page) => (
            <CrawledCard
              key={page.id}
              page={page}
              isSelected={selectedPages.has(String(page.id))}
              onToggleSelect={onSelectPage}
            />
          ))}
        </div>
      )}

      {selectedPages.size > 0 && (
      <div className="fixed bottom-10 left-0 right-0 z-50">
      <div className="bg-white border shadow-lg rounded-lg p-4 max-w-md mx-auto">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
      {selectedPages.size} {selectedPages.size === 1 ? "page" : "pages"} selected
          </span>
          <Button
            onClick={async () => {
              const appendURLResponse = await dispatch(
                appendURLToKnowledgeBase({
                    pageIds: Array.from(selectedPages),
                    tenant: TENANT,
                })
                
              );
              if (appendURLResponse.meta.requestStatus === "fulfilled") {
                onRemovePages(Array.from(selectedPages));
                refetchItems();
                // Handle success
                toast.success(
                  `${selectedPages.size} pages have been added to your knowledge base`
                );
              }
              if (appendURLResponse.meta.requestStatus === "rejected") {
                // Handle error
                toast.error(
                  "Failed to add pages to knowledge base. Please try again."
                );
              }
            }}
            className="bg-primary hover:bg-primary/90 text-white font-medium rounded-lg text-sm px-4 py-2 flex items-center gap-2"
          >
      <FaCheckDouble className="mr-2 h-4 w-4" />
      Add to Knowledge Base
          </Button>
        </div>
      </div>
    </div>
    )}
    </div>
  );
};

export default CrawledPageList;