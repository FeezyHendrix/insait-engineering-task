import { Card, CardContent, CardHeader } from './Card';
import { Checkbox } from '@/components/elements/Checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';
import { Badge } from './Badge';
import { FaFileAlt, FaLink } from "react-icons/fa";


export interface PageInfo {
  id: number | string;
  pagePath: string;
  pageTitle: string;
  pageDescription: string;
  status: string;
  startTime: string;
  endTime: string;
  url: string;
  words: number;
}

interface CrawledCardProps {
  page: PageInfo;
  isSelected: boolean;
  onToggleSelect: (id: number | string, selected: boolean) => void;
}

const CrawledCard = ({ page, isSelected, onToggleSelect } : CrawledCardProps) => {
  const { id, url, pageTitle, pageDescription, words, startTime, status } = page;
  return (
<Card className={`overflow-hidden transition-all hover:border-primary/50 ${isSelected ? 'border-primary ring-1 ring-primary/20' : ''} flex flex-col`}>
  <CardHeader className="p-4 pb-0 flex flex-row items-start gap-2">
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <Checkbox
          id={`select-${id}`}
          checked={isSelected}
          onCheckedChange={(checked) => onToggleSelect(id, checked as boolean)}
          className="h-5 w-5"
        />
        <h3 className="font-medium line-clamp-1 text-card-foreground">
          {status === "loading" ? (
            <div className="h-5 w-3/4 shimmer rounded" />
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>{pageTitle || "Untitled Page"}</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{pageTitle || "Untitled Page"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </h3>
      </div>
      <div className="flex items-center text-xs text-muted-foreground mt-1">
        <FaLink className="h-3 w-3 mr-1 inline" />
        {status === "loading" ? (
          <div className="h-3 w-40 shimmer rounded" />
        ) : (
          <span className="truncate max-w-[200px]">{url}</span>
        )}
      </div>
    </div>
  </CardHeader>
  <CardContent className="p-4 flex-grow">
    {status === "loading" ? (
      <div className="space-y-2">
        <div className="h-4 w-full shimmer rounded" />
        <div className="h-4 w-5/6 shimmer rounded" />
        <div className="h-4 w-4/6 shimmer rounded" />
      </div>
    ) : (
      <p className="text-sm text-muted-foreground line-clamp-3">
        {pageDescription || "No description available"}
      </p>
    )}
  </CardContent>
  <div className="p-4 mt-auto">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="flex items-center gap-1 text-xs">
          <FaFileAlt className="h-3 w-3" />
          {status === "loading" ? (
            <div className="h-3 w-10 shimmer rounded" />
          ) : (
            `${words.toLocaleString()} words`
          )}
        </Badge>
      </div>
      {status === "loading" ? (
        <div className="h-4 w-16 shimmer rounded" />
      ) : (
        <span className="text-xs text-muted-foreground"></span>
      )}
    </div>
  </div>
</Card>  )
}

export default CrawledCard
