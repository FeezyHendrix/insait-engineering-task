import { useState } from "react";
import { MdSearch, MdClose } from "react-icons/md";
import { Input } from "@/components/ui/input";
import { useTranslation } from 'react-i18next';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div className="relative">
      <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        type="text"
        placeholder={t("knowledgeHub.searchPlaceholder")}
        className="pl-10 pr-8 py-2 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-full"
        value={query}
        onChange={handleChange}
      />
      {query && (
        <button
          type="button"
          onClick={clearSearch}
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
        >
          <MdClose className="h-4 w-4 text-gray-400 hover:text-gray-600" />
        </button>
      )}
    </div>
  );
};
