import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from 'react-toastify'
import { KnowledgeItem, KnowledgeCard } from "@/lib/types";
import { appendSingleLink } from '@/redux/slices/knowledgeHub/request';
import { useAppDispatch } from '@/hook/useReduxHooks';
import { useTranslation } from 'react-i18next';

interface AddLinkProps {
  onAddItem: (item: Omit<KnowledgeItem, "id" | "createdAt" | "updatedAt">) => void;
  refetchItems: () => void;
  requireApproval: boolean;
}

export const AddLink = ({ onAddItem, refetchItems, requireApproval }: AddLinkProps) => { 
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !url.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    onAddItem({
      name: title,
      pageTitle: title,
      pageDescription: description,
      pagePath: url,
      words: 0,
      type: "link",
      tags: [],
      url,
      pending: requireApproval
    });

    try {
      const startRes = await dispatch(appendSingleLink({
        name: url,
        pageTitle: title,
        pageDescription: description,
        url: url
      })).unwrap();

      setTitle("");
      setUrl("");
      setDescription("");

      toast.success(
        requireApproval 
          ? t("knowledgeHub.appendSingleLinkPendingApproval")
          : t("knowledgeHub.appendSingleLinkSuccess")
      );
      refetchItems();
    } catch (error) {
      toast.error(t("knowledgeHub.appendSingleLinkError"));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
      <Label htmlFor="title" className="text-sm font-medium text-gray-700">{t("knowledgeHub.documentTitle")}</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t("knowledgeHub.documentTitlePlaceholder")}
          className="w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="space-y-2">
      <Label htmlFor="url" className="text-sm font-medium text-gray-700">{t("knowledgeHub.documentURL")}</Label>
        <Input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={t("knowledgeHub.documentURLPlaceholder")}
          className="w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="space-y-2">
      <Label htmlFor="description" className="text-sm font-medium text-gray-700">{t("knowledgeHub.documentDescription")}</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t("knowledgeHub.documentDescriptionPlaceholder")}
          className="h-24 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300"
      >
        {t("knowledgeHub.addLinkButtonText")}
      </Button>
    </form>
  );
};
