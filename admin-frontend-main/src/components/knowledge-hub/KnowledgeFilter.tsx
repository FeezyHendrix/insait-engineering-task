import { FilterType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { MdGridView, MdDescription, MdHelpOutline, MdLink } from "react-icons/md";
import { useTranslation } from 'react-i18next';


interface KnowledgeFilterProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  requireApproval: boolean;
  onToggleApproval: () => void;
}

export const KnowledgeFilter = ({
  activeFilter,
  onFilterChange,
  requireApproval,
  onToggleApproval,
}: KnowledgeFilterProps) => {
  const { t } = useTranslation();
  const filters = [
    { id: "all", label: t("knowledgeHub.all"), icon: MdGridView },
    { id: "document", label: t("knowledgeHub.documents"), icon: MdDescription },
    { id: "qa", label: t("knowledgeHub.qa"), icon: MdHelpOutline },
    { id: "link", label: t("knowledgeHub.links"), icon: MdLink }
    ];

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-knowledge-border mb-6">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id as FilterType)}
            className={cn(
              "inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
              activeFilter === filter.id
                ? "bg-gray-900 text-white"
                : "text-gray-700 hover:bg-gray-100"
            )}
          >
            <filter.icon className="h-4 w-4 me-2" />
            {filter.label}
          </button>
        ))}
      </div>
      {/* <div className="flex items-center">    <------------- Toggle for require approval (for future use)
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only"
            checked={requireApproval}
            onChange={onToggleApproval}
          />
          <div
            className={cn(
              "relative w-11 h-6 bg-gray-200 rounded-full transition-colors",
              requireApproval ? "bg-blue-600" : "bg-gray-200"
            )}
          >
            <div
              className={cn(
                "absolute top-[2px] left-[2px] bg-white w-5 h-5 rounded-full transition-transform",
                requireApproval ? "translate-x-5" : "translate-x-0"
              )}
            />
          </div>
          <span className="ml-3 text-sm font-medium text-gray-700">
            Require Approval
          </span>
        </label>
      </div> */}
    </div>
  );
};
