import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { KnowledgeType } from "@/types/knowledge"; // שים לב
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from "@/hook/useReduxHooks";
import { postNewKnowledgeRequest } from "@/redux/slices/knowledgeHub/request";
import { uuid } from "@/utils/clientDataHelper";

interface AddQAProps {
  onAddItem: (item: Omit<KnowledgeType, "id" | "createdAt" >) => void;
  requireApproval: boolean;
}

export const AddQA = ({onAddItem,  requireApproval }: AddQAProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const company = useAppSelector(state => state.companyConfig.company);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) {
      toast.error(t('feedback.requiredFields') || "Please fill both question and answer fields");
      return;
    }

    const newItem: KnowledgeType = {
      id: uuid(),
      question,
      answer,
      createdAt: new Date().toISOString(),
      product: company,
      active: true
    };

    try {
      const response = await dispatch(postNewKnowledgeRequest({ data: newItem, isUpdate: false }));
      if (!response.payload?.msg?.id) {
        toast.error(response?.payload?.msg?.meta?.cause || t('feedback.errorWrong'));
        return;
      }


      onAddItem(newItem);

      setQuestion("");
      setAnswer("");

      toast.success(
        requireApproval
          ? t('knowledge.addedPendingApproval', { title: question }) || "Q&A added and pending approval"
          : t('knowledge.addedSuccess', { title: question }) || "Q&A added successfully"
      );
    } catch (error) {
      console.error("Error adding Q&A:", error);
      toast.error(t('feedback.errorWrong'));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="question" className="text-sm font-medium text-gray-700">
          {t('knowledge.question')}
        </Label>
        <Input
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={t('knowledgeHub.egQuestion') || "Enter question"}
          className="w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="answer" className="text-sm font-medium text-gray-700">
          {t('knowledge.answer')}
        </Label>
        <Textarea
          id="answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder={t('knowledgeHub.egAnswer') || "Enter answer"}
          className="h-40 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300"
      >
        {t('knowledge.addQA')}
      </Button>
    </form>
  );
};
