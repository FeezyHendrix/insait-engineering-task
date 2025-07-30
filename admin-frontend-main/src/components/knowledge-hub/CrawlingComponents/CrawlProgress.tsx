import React from "react";
import { Progress } from "./Progress"
import { Card } from "./Card";
import { MdAutoAwesome } from "react-icons/md";
import { FaSpinner, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

interface CrawlProgressProps {
  progress: number;
  pagesFound: number;
  pagesSelected: number;
  timeRemaining?: string;
  status: "INITIALIZING"| "STARTING" | "PENDING" | "COMPLETED" | "ERROR";
}

const CrawlProgress: React.FC<CrawlProgressProps> = ({
  progress,
  pagesFound,
  pagesSelected,
  timeRemaining,
  status,
}) => {
  // Round progress to nearest integer
  const roundedProgress = Math.round(progress);
  
  const renderStatusIcon = () => {
    switch (status) {
      case "INITIALIZING":
        return (
          <div className="rounded-full bg-crawl-starting/20 p-2 text-crawl-starting">
             <MdAutoAwesome className="h-8 w-8 text-blue-600" />
          </div>
        );
      case "STARTING":
        return (
          <div className="rounded-full bg-crawl-starting/20 p-2 text-crawl-starting">
            <FaSpinner className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
        );
      case "PENDING":
        return (
          <div className="rounded-full bg-crawl-pending/20 p-2 text-crawl-pending animate-spin">
            <FaSpinner className="h-8 w-8 text-blue-600" />
          </div>
        );
      case "COMPLETED":
        return (
          <div className="rounded-full bg-crawl-success/20 p-2 text-crawl-success">
            <FaCheckCircle className="h-8 w-8 text-green-600" />
          </div>
        );
      case "ERROR":
        return (
          <div className="rounded-full bg-crawl-error/20 p-2 text-crawl-error">
            <FaTimesCircle className="h-8 w-8 text-red-600" />
          </div>
        );
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "INITIALIZING":
        return "Initializing crawl job...";
      case "STARTING":
        return "Crawl job starting...";
      case "PENDING":
        return "Crawling in progress...";
      case "COMPLETED":
        return "Crawl completed!";
      case "ERROR":
        return "Crawl failed!";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "PENDING":
        return "text-orange-600";
      case "COMPLETED":
        return "text-green-600";
      case "ERROR":
        return "text-red-600";
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {renderStatusIcon()}
          <div>
            <h3 className="font-medium">Crawl Status</h3>
            <p className={`text-sm ${getStatusColor()}`}>{getStatusText()}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">{`${pagesSelected} / ${pagesFound} pages selected`}</p>
          {timeRemaining && status === "PENDING" && (
            <p className="text-xs text-muted-foreground">
              Est. time remaining: {timeRemaining}
            </p>
          )}
        </div>
      </div>

      <Progress value={roundedProgress} className="h-2" />

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-muted rounded-md">
          <p className="text-2xl font-semibold">{pagesFound}</p>
          <p className="text-xs text-muted-foreground">Pages Found</p>
        </div>
        <div className="text-center p-3 bg-muted rounded-md">
          <p className="text-2xl font-semibold">{pagesSelected}</p>
          <p className="text-xs text-muted-foreground">Pages Selected</p>
        </div>
        <div className="text-center p-3 bg-muted rounded-md">
          <p className="text-2xl font-semibold">{roundedProgress}%</p>
          <p className="text-xs text-muted-foreground">Progress</p>
        </div>
      </div>
    </Card>
  );
};

export default CrawlProgress;