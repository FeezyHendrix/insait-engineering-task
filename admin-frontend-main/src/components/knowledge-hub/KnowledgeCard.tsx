import { HintActionType, KnowledgeItem } from "@/lib/types";
import { format } from "date-fns";
import { MdMoreHoriz, MdDescription, MdHelpOutline, MdLink, MdOpenInNew, MdVisibility, MdDelete } from "react-icons/md";
import { FaInfoCircle } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from 'react-i18next';
import { useState } from "react";
import HintModal from "./HintModal";
import { sendKnowledgeHint } from "@/redux/slices/knowledgeHub/request";
import { toast } from "react-toastify";


interface KnowledgeCardProps {
  item: KnowledgeItem;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: () => void;
}

export const KnowledgeCard = ({
  item,
  onEdit,
  onDelete,
  onView,
}: KnowledgeCardProps) => {
  const getIcon = () => {
    switch (item.type) {
      case "document":
        return <MdDescription className="h-5 w-5 text-blue-600" />;
      case "qa":
        return <MdHelpOutline className="h-5 w-5 text-purple-600" />;
      case "link":
        return <MdLink className="h-5 w-5 text-green-600" />;
      default:
        return <MdDescription className="h-5 w-5" />;
    }
  };
  const { t } = useTranslation();
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy");
  };

  const displayName =
    item.type === "link"
      ? item.pageTitle
      : item.type === "qa"
      ? item.question
      : item.name;

  const displayDescription =
    item.type === "link"
      ? item.pageDescription
      : item.type === "qa"
      ? item.answer
      : "";

  const [isHintModalOpen, setHintModalOpen] = useState<boolean>(false);

  const handleHint = () => {
    setHintModalOpen(true);
  };

  const saveHint = async (newHint: string, previousHint: string, toDelete?: boolean) => {
    setHintModalOpen(false);
    try {
      if (!item.r2rId) throw new Error("Item does not have a valid r2rId");
      const action: HintActionType = toDelete ? "delete" : item.hint ? "edit" : "add";
      await sendKnowledgeHint(item.id, item.r2rId, action, newHint, previousHint);
      toast.info(`Hint set to be updated. This may take a few minutes.`);
    } catch (error) {
      toast.error("Error sending hint");
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-knowledge-border shadow-sm hover:shadow transition-shadow p-5 relative flex flex-col ${item.pending ? 'border-l-4 border-l-amber-400' : ''}`}>
      {item.pending && (
        <div className="absolute top-0 right-0 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-bl-md rounded-tr-md font-medium">
          Pending Approval
        </div>
      )}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center">
            {getIcon()}
          </div>
          <h3 className="font-medium text-gray-900 flex-1">{displayName}</h3>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MdMoreHoriz className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white">
            <DropdownMenuItem
              onClick={onView}
              className="cursor-pointer hover:bg-blue-600 hover:text-white"
            >
              <MdVisibility className="me-2 h-4 w-4" />
              <span>{t("knowledgeHub.view")}</span>
            </DropdownMenuItem>
            {item.r2rId && 
              <DropdownMenuItem
                onClick={() => handleHint()}
                className="cursor-pointer hover:bg-blue-600 hover:text-white"
              >
                <FaInfoCircle className="me-2 h-4 w-4 text-gray-400" />
                <span>{item.hint ? "Edit / Remove" : "Add"} Hint</span>
              </DropdownMenuItem>
            }
            <DropdownMenuItem
              onClick={() => onDelete(item.id)}
              className="cursor-pointer text-red-600 focus:text-red-300 hover:bg-blue-600 hover:text-white"
            >
              <MdDelete className="me-2 h-4 w-4" />
                <span>{t("knowledgeHub.delete")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <p className="text-sm text-gray-500 mt-2 flex-grow">
        {displayDescription || t("knowledgeHub.noDescription")}
      </p>
      {
        item.hint && (
          <p className="text-xs text-gray-500 mt-2">
            <span className="font-semibold text-blue-500">{t("knowledgeHub.hint")}: </span>
            {item.hint}
          </p>
        )
      }

      <div className="mt-4 flex flex-wrap gap-2">
        {item.type === "link" && item.status === "SCRAPING" && (
          <div className="relative group mb-2">
            <Badge variant="outline" className="flex items-center space-x-1 text-xs text-gray-500">
              <AiOutlineLoading3Quarters className="h-4 w-4 animate-spin me-1 text-blue-500" />
              <span>{t("knowledgeHub.processing")}</span>
            </Badge>
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-black text-white text-xs rounded px-3 py-2 min-w-[280px] text-center">
              {t("knowledgeHub.analyzingPageMessage")}
            </span>
          </div>
        )}
        {item.tags?.map((tag) => (
          <Badge
            key={tag.id}
            variant="outline"
            className="text-xs text-gray-600"
            style={{ backgroundColor: tag.color || "#f0f0f0" }}
          >
            {tag.name}
          </Badge>
        ))}
      </div>

      <div className="mt-auto pt-3 border-t border-gray-100 text-xs text-gray-400 flex justify-between items-center">
        <span>Updated {formatDate(item.createdAt)}</span>
        {item.type === "document" && (
          <span>{item.type} · {(item.size! / 1000000).toFixed(1)} MB</span>
        )}
        {item.type === "link" && (
          <span className="truncate max-w-[150px] flex items-center space-x-1">
            <a href={item.url || "#"} target={"_blank"} className="flex items-center">
              {item.url || t("knowledgeHub.noURL")}
              <MdOpenInNew className="h-3 w-3 text-gray-500 ml-1" />
            </a>
          </span>
        )}
      </div>
      <HintModal
        isOpen={isHintModalOpen}
        item={item}
        onSave={saveHint}
        onClose={() => setHintModalOpen(false)}
      />
    </div>
    
  );
};
