import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MdPublic } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface CrawlInputProps {
  onStartCrawl: (url: string) => void;
  isLoading: boolean;
}

export const CrawlInput = ({ onStartCrawl, isLoading }: CrawlInputProps) => {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) onStartCrawl(url);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="url"
        placeholder="Enter website URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="flex-1 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
        disabled={isLoading}
        required
      />
      <Button 
        type="submit" 
        disabled={!url || isLoading} 
        className={`bg-gradient-to-r from-blue-700 to-blue-400 hover:from-blue-700 hover:to-blue-600 text-white transition-all duration-300 ${
          isLoading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? (
          <AiOutlineLoading3Quarters className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <MdPublic className="h-4 w-4 me-2" />
            Discover
          </>
        )}
      </Button>
    </form>
  );
};
