import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MdDescription, MdHelpOutline, MdLink, MdPublic, MdClose, MdCloudUpload, MdAdd } from "react-icons/md";
import { WebCrawler } from "./WebCrawler";
import { CrawledPage, KnowledgeItem, Tag, CrawledDomain, KnowledgeCard } from "@/lib/types";
import { mockTags } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';


interface AddKnowledgePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: Omit<KnowledgeCard, "id" | "createdAt" | "updatedAt">) => void;
  requireApproval: boolean;
  onAddPages: (pages: CrawledPage[], domain: string, url: string) => void;
  crawledDomains: CrawledDomain[];
  onDomainCrawled: (domain: CrawledDomain) => void;
}

export const AddKnowledgePanel = ({
  isOpen,
  onClose,
  onAddItem,
  requireApproval,
  onAddPages,
  crawledDomains,
  onDomainCrawled
}: AddKnowledgePanelProps) => {
  const [activeTab, setActiveTab] = useState<string>("document");
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>(mockTags);
  const { t } = useTranslation();
  
  // Document form state
  const [documentTitle, setDocumentTitle] = useState("");
  const [documentDescription, setDocumentDescription] = useState("");
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  
  // Q&A form state
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  
  // Link form state
  const [linkTitle, setLinkTitle] = useState("");
  const [linkDescription, setLinkDescription] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  const handleAddTag = (tag: Tag) => {
    setSelectedTags([...selectedTags, tag]);
    setAvailableTags(availableTags.filter(t => t.id !== tag.id));
  };

  const handleRemoveTag = (tag: Tag) => {
    setSelectedTags(selectedTags.filter(t => t.id !== tag.id));
    setAvailableTags([...availableTags, tag]);
  };

  const handleDocumentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentTitle.trim() || !documentDescription.trim() || !documentFile) {
      toast.error("Please fill all the fields and upload a file.");
      return;
    }

    onAddItem({
      title: documentTitle,
      description: documentDescription,
      type: "document",
      tags: selectedTags,
      fileType: documentFile.name.split('.').pop()?.toUpperCase() || "PDF",
      fileSize: documentFile.size,
      pending: requireApproval,
      status: requireApproval ? "Pending Approval" : "Approved"
    });

    resetForm();
    toast.success(
      requireApproval 
        ? "Your document was added and is pending approval." 
        : "Your document was added successfully."
    );
  };

  const handleQASubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) {
      toast.error("Please fill both question and answer fields.");
      return;
    }

    onAddItem({
      title: question,
      description: answer.substring(0, 100) + (answer.length > 100 ? "..." : ""),
      type: "qa",
      tags: selectedTags,
      question,
      answer,
      pending: requireApproval,
      status: requireApproval ? "Pending Approval" : "Approved"
    });

    resetForm();
    toast.success(
      requireApproval 
        ? "Your Q&A was added and is pending approval." 
        : "Your Q&A was added successfully."
    );
  };

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkTitle.trim() || !linkDescription.trim() || !linkUrl.trim()) {
      toast.error("Please fill all the fields.");
      return;
    }

    onAddItem({
      title: linkTitle,
      description: linkDescription,
      type: "link",
      tags: selectedTags,
      url: linkUrl,
      pending: requireApproval,
      status: requireApproval ? "Pending Approval" : "Approved"
    });

    resetForm();
    toast.success(
      requireApproval 
        ? "Your link was added and is pending approval." 
        : "Your link was added successfully."
    );
  };

  const resetForm = () => {
    setDocumentTitle("");
    setDocumentDescription("");
    setDocumentFile(null);
    setQuestion("");
    setAnswer("");
    setLinkTitle("");
    setLinkDescription("");
    setLinkUrl("");
    setSelectedTags([]);
    setAvailableTags(mockTags);
  };

  return (
    <div
      className={`fixed top-0 right-0 w-full md:w-96 h-full bg-white border-l border-gray-200 shadow-lg z-30 transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">{t('knowledgeHub.addKnowledge')}</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <MdClose className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-4">
        <Tabs defaultValue="document" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="document" className="flex flex-col items-center py-2">
              <MdDescription className="h-5 w-5 mb-1" />
              <span className="text-xs">Document</span>
            </TabsTrigger>
            <TabsTrigger value="qa" className="flex flex-col items-center py-2">
              <MdHelpOutline className="h-5 w-5 mb-1" />
              <span className="text-xs">Q&A</span>
            </TabsTrigger>
            <TabsTrigger value="link" className="flex flex-col items-center py-2">
              <MdLink className="h-5 w-5 mb-1" />
              <span className="text-xs">Link</span>
            </TabsTrigger>
            <TabsTrigger value="crawl" className="flex flex-col items-center py-2">
              <MdPublic className="h-5 w-5 mb-1" />
              <span className="text-xs">Crawl</span>
            </TabsTrigger>
          </TabsList>

          {/* Common tags section - only show if not on crawl tab */}
          {activeTab !== "crawl" && (
            <div className="mb-6">
              <Label className="block mb-2">Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedTags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    className="bg-knowledge-tag text-gray-700 hover:bg-knowledge-tag/90 cursor-pointer flex items-center gap-1"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag.name}
                    <MdClose className="h-3 w-3" />
                  </Badge>
                ))}
                {selectedTags.length === 0 && (
                  <span className="text-sm text-gray-500">No tags selected</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    className="bg-white text-gray-500 hover:bg-gray-50 cursor-pointer flex items-center gap-1"
                    onClick={() => handleAddTag(tag)}
                  >
                    <MdAdd className="h-3 w-3" />
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <TabsContent value="document">
            <form onSubmit={handleDocumentSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="documentTitle">Title</Label>
                  <Input
                    id="documentTitle"
                    value={documentTitle}
                    onChange={(e) => setDocumentTitle(e.target.value)}
                    placeholder="Enter document title"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="documentDescription">Description</Label>
                  <Textarea
                    id="documentDescription"
                    value={documentDescription}
                    onChange={(e) => setDocumentDescription(e.target.value)}
                    placeholder="Enter description"
                    className="h-24"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="documentFile">File</Label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <MdCloudUpload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="documentFile"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="documentFile"
                            name="documentFile"
                            type="file"
                            className="sr-only"
                            onChange={(e) => setDocumentFile(e.target.files?.[0] || null)}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF, DOCX, PPTX, XLSX up to 10MB
                      </p>
                    </div>
                  </div>
                  {documentFile && (
                    <p className="mt-2 text-sm text-gray-600">
                      Selected: {documentFile.name}
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full">
                  Add Document
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="qa">
            <form onSubmit={handleQASubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="question">Question</Label>
                  <Input
                    id="question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Enter question"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="answer">Answer</Label>
                  <Textarea
                    id="answer"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Enter answer"
                    className="h-40"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Add Q&A
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="link">
            <form onSubmit={handleLinkSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="linkTitle">Title</Label>
                  <Input
                    id="linkTitle"
                    value={linkTitle}
                    onChange={(e) => setLinkTitle(e.target.value)}
                    placeholder="Enter link title"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="linkUrl">URL</Label>
                  <Input
                    id="linkUrl"
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://example.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="linkDescription">Description</Label>
                  <Textarea
                    id="linkDescription"
                    value={linkDescription}
                    onChange={(e) => setLinkDescription(e.target.value)}
                    placeholder="Enter description"
                    className="h-24"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Add Link
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="crawl" className="h-[calc(100vh-180px)] overflow-y-auto pr-1">
            <WebCrawler 
              onAddPages={onAddPages} 
              crawledDomains={crawledDomains}
              onDomainCrawled={onDomainCrawled}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
