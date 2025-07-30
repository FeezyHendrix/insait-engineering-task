import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { uploadKnowledgeDocument } from '@/redux/slices/knowledgeHub/request';
import { useAppDispatch } from '@/hook/useReduxHooks';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { KnowledgeItem } from "@/lib/types";
import { MdCloudUpload, MdDescription } from "react-icons/md";

interface AddDocumentProps {
  onAddItem: (item: Omit<KnowledgeItem, "id" | "createdAt" | "updatedAt">) => void;
  requireApproval: boolean;
}

export const AddDocument = ({ onAddItem, requireApproval }: AddDocumentProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [files, setFiles] = useState<FileList | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files || files.length === 0) {
      toast.error(t('feedback.missingFiles') || "Please upload at least one file");
      return;
    }

    const formData = new FormData();
    Array.from(files).forEach(file => formData.append('files', file));

    try {
      const response = await uploadKnowledgeDocument(formData);

      response.results.forEach((item: { success: boolean; fileName: string; error?: string }) => {
        if (item.success) {
          toast.success(
            t('feedback.fileUploaded', { name: item.fileName }) || `File ${item.fileName} uploaded successfully`
          );
          onAddItem({
            name: item.fileName,
            type: "document",
            tags: [],
            size: 0, 
            pending: requireApproval
          });
        } else {
          toast.error(item.error || t('feedback.fileProcessingFailed') || "Failed to process file");
        }
      });
    } catch (error) {
      toast.error(t('feedback.fileProcessingFailed') || "Failed to process file");
    }

    setFiles(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="files" className="text-sm font-medium text-gray-700">
          {t('knowledgeHub.uploadDocuments') || "Upload Documents"}
        </Label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-blue-500 transition-colors duration-200 bg-gray-50/50"
        onDrop={(e)=>{
          e.preventDefault();
          const droppedFiles = e.dataTransfer.files;
          if (droppedFiles && droppedFiles.length > 0) {
            setFiles(droppedFiles);
          }
        }}
        onDragOver={(e)=>{
          e.preventDefault();
        }}
        >
        <div className="flex flex-col items-center space-y-2 text-center">
        <MdCloudUpload className="h-12 w-12 text-gray-400" />
        <div className="flex text-sm text-gray-600">
          <label
            htmlFor="files"
            className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:bg-blue-500 hover:text-white hover:shadow"
          >
            <span>{t('knowledgeHub.uploadFiles') || "Upload files"}</span>
            <input
          id="files"
          name="files"
          type="file"
          multiple
          className="sr-only"
          onChange={(e) => setFiles(e.target.files)}
          accept=".docx,.txt,.pdf,.md,.xls,.xlsx,.csv"
            />
          </label>
          <p className="pl-1">{t('knowledgeHub.orDragDrop')}</p>
        </div>
        <p className="text-xs text-gray-500">
          {t('knowledge.supportedFile') || "Supported formats: .docx, .txt, .pdf, etc."}
        </p>
          </div>
        </div>
        {files && files.length > 0 && (
          <div className="mt-2 space-y-2">
        {Array.from(files).map((file, index) => (
          <div key={index} className="flex items-center text-sm text-gray-600">
            <MdDescription className="h-4 w-4 me-2 text-blue-900" />
            {file.name}
          </div>
        ))}
          </div>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300"
        disabled={!files || files.length === 0}
      >
        {t('knowledgeHub.uploadDocuments') || "Add Documents"}
      </Button>
    </form>
  );
};
