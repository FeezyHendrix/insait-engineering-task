import { useState, useCallback, useEffect } from "react";
import { KnowledgeCard } from "./KnowledgeCard";
import { KnowledgeFilter } from "./KnowledgeFilter";
import { SearchBar } from "./SearchBar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FiPlus } from "react-icons/fi";
import { IoCloseSharp } from "react-icons/io5";
import { RiFileTextFill } from "react-icons/ri";
import { MdOutlineHelp } from "react-icons/md";
import { IoIosLink } from "react-icons/io";
import { VscRobot } from "react-icons/vsc";


import { toast } from 'react-toastify'
import { AddDocument } from "./AddDocument";
import { AddQA } from "./AddQA";
import { AddLink } from "./AddLink";
import { useAppDispatch } from "@/hook/useReduxHooks";
import { fetchCombinedKnowledgeRequest } from "@/redux/slices/knowledgeHub/request";
import { ITEMS_PER_PAGE } from "@/utils/data";
import type { FilterType, KnowledgeItem, DocumentTypeForBackend,  } from "@/lib/types";
import { CrawledURLType, KnowledgeConfirmProp, KnowledgeFileItemType,KnowledgeFileListProp, KnowledgeFileModalTypes } from "@/types/knowledge";
import { useTranslation } from 'react-i18next';
import { getSourceTypeValue } from '@/utils';
import { URLCrawling } from "./URLCrawling";
import { KnowledgeFileViewModal} from "../knowledge/KnowledgeFileViewModal";
import KnowledgeFileDeleteModal from '../knowledge/KnowledgeFileDeleteModal'
import { deleteFileKnowledgeRequest } from '@/redux/slices/knowledgeHub/request'
import AddKnowledgeModal from '../knowledge/AddKnowledgeModal'
import { KnowledgeType } from '@/types/knowledge'



export const KnowledgeHub = ({}) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDiscover, setShowDiscover] = useState(false);
  const [requireApproval, setRequireApproval] = useState(false);
  const [urlData, setUrlData] = useState<Array<CrawledURLType>>([]);
  const [loading, setLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState<KnowledgeConfirmProp>({ id: '', title: '', status: 'none' });
  const [selectedKnowledge, setSelectedKnowledge] = useState<KnowledgeFileItemType | null>(null);
  const [selectedQA, setSelectedQA] = useState<KnowledgeType | null>(null);
  const [addEditModal, setAddEditModal] = useState(false)  
  const [modalOpened, setModalOpened] = useState<KnowledgeFileModalTypes>('none')

  
  
  const confirmDelete = (item: KnowledgeItem ) => {
    if (loading) return;
      handleOpenModal('delete', {
        id: item.id,
        name: item.name || '',
        status: item.status || '',
        createdAt: item.createdAt,
        type: item.type,
        url: item.url || '',
        key: item.key || '',
        size: item.size || 0,
      });

  };
  const handleAddNewKnowledgeItem = (item: KnowledgeType) => {
    refetchItems();
  }

  const viewFile = (item: KnowledgeItem) => {
    if (item.type === "link" && typeof item.url === "string") {
      const popupWidth = 1000;
      const popupHeight = 800;
  
      const left = window.screenX + (window.outerWidth - popupWidth) / 2;
      const top = window.screenY + (window.outerHeight - popupHeight) / 2;
  
      window.open(
        item.url,
        'popupWindow',
        `width=${popupWidth},height=${popupHeight},top=${top},left=${left},resizable=yes,scrollbars=yes`
      )
      return;
    }else if (item.type === "qa") {
      setSelectedQA({
        id: item.id,
        question: item.question || "",
        answer: item.answer || "",
        createdAt: item.createdAt,
        product: item.product || "Product Name",
        active: item.published || false,
        type: "qa"
    });

      setAddEditModal(true)
      return;
    } else if (item.type === "document") {
      setSelectedKnowledge({
        id: item.id,
        name: item.name || "Error Fetching File Name",
      status: item.status || "",
      createdAt: item.createdAt,
      type: item.type,
      url: item.url || '',
      key: item.key || '',
      size: item.size || 0,
    });
    setModalOpened('view');
    return;
    } else {
      toast.error(t('knowledgeHub.unknownFileType'));
      throw new Error(`Unknown file type: ${item.type}`);
    }
  };

  const handleCloseAddKnowledgeModal = () => {
    setAddEditModal(false)
  }

  const handleOpenModal = (
    type: KnowledgeFileModalTypes,
    file: KnowledgeFileItemType | null
  ) => {
    setSelectedKnowledge(file)
      setModalOpened(type)
  };

  const handleCloseModal = () => {
    setModalOpened('none')
  };

    const handleDelete = async (id: string) => {
    try {
      setLoading(true)
      const request = await dispatch(deleteFileKnowledgeRequest(id))
      const response = request.payload
      if (response?.code || response?.message) {
        throw new Error(response?.message || t('feedback.errorWrong'))
      } 
      if (request.meta.requestStatus === 'rejected') {
        toast.error(t('feedback.errorWrong'))
      } else {
        toast.success(response?.message)
      }
     
    } catch (error) {
      toast.error(t('feedback.errorWrong'))
    } finally {
      toast.success(t('knowledge.itemRemoved'));
      refetchItems();
      setLoading(false);
      setModalOpened('none');
    }
  }
  
  

  const refetchItems = useCallback(async (customPage?: number) => {
    try {
      setLoading(true);
      const validType: DocumentTypeForBackend | undefined = filter !== 'all' ? (filter as DocumentTypeForBackend) : undefined;
      const response = await dispatch(fetchCombinedKnowledgeRequest({
        page: customPage || page,
        limit: ITEMS_PER_PAGE,
        order: "desc",
        orderBy: "createdAt",
        search: searchQuery,
        type: validType,
      })).unwrap();

      const data = response?.data || [];
      const total = response?.pagination?.totalRecords || 0;
      const totalPages = response?.pagination?.totalPages || 1;
      setItems(data);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching combined knowledge items:", error);
    } finally {
      setLoading(false);
    }
  }, [dispatch, page, searchQuery, filter]);

  useEffect(() => {
    refetchItems();
  }, [page, searchQuery, filter]);

  // Auto-refetch when any link is SCRAPING
  useEffect(() => {
    const hasScrapingLink = items.some(
      (item) => item.type === "link" && item.status === "SCRAPING"
    );
    let interval: NodeJS.Timeout | undefined;
    if (hasScrapingLink) {
      interval = setInterval(() => {
        refetchItems();
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [items, refetchItems]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const renderPagination = () => {
    const groupSize = 5;
    const currentGroup = Math.floor((page - 1) / groupSize);
    const startPage = currentGroup * groupSize + 1;
    const endPage = Math.min(startPage + groupSize - 1, totalPages);

    const buttons = [];

    buttons.push(
      <Button key="prev" variant="outline" size="sm" disabled={page === 1} onClick={() => handlePageChange(page - 1)}>
        &lt;
      </Button>
    );

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button key={i} variant={i === page ? "default" : "outline"} size="sm" onClick={() => handlePageChange(i)}>
          {i}
        </Button>
      );
    }

    buttons.push(
      <Button key="next" variant="outline" size="sm" disabled={page === totalPages} onClick={() => handlePageChange(page + 1)}>
        &gt;
      </Button>
    );

    return buttons;
  };

  return (
    <div className="min-h-screen">
      <div className="p-3">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-800">
              {t('knowledgeHub.title')}
            </h1>
            <p className="text-gray-600 mt-1 max-w-xl">
              {t('knowledgeHub.description')}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <SearchBar onSearch={handleSearch} />
            <Button onClick={() => setShowDiscover(prev => !prev)} className="bg-blue-600 text-white">
                {showDiscover ? <IoCloseSharp className="h-5 w-5" /> : <><FiPlus className="h-5 w-5 mr-2" />{t('knowledgeHub.addKnowledge')}</>}
            </Button>
          </div>
        </div>

        {showDiscover && (
          <div className="bg-white rounded-xl shadow p-6 mb-8">
            <Tabs defaultValue="document" className="w-full">
              <TabsList className="grid grid-cols-4 gap-2 bg-gray-100 p-1 rounded-lg">
                <TabsTrigger value="document" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow"><RiFileTextFill className="h-4 w-4 mr-2" /> Document</TabsTrigger>
                <TabsTrigger value="qa" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow"><MdOutlineHelp className="h-4 w-4 mr-2" /> Q&A</TabsTrigger>
                <TabsTrigger value="link" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow"><IoIosLink className="h-4 w-4 mr-2" /> Link</TabsTrigger>
                <TabsTrigger value="crawl" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow"><VscRobot className="h-4 w-4 mr-2" /> Crawl</TabsTrigger>
              </TabsList> 
              <div className="mt-4">
                <TabsContent value="document"><AddDocument onAddItem={() => refetchItems()} requireApproval={requireApproval} /></TabsContent>
                <TabsContent value="qa"><AddQA onAddItem={() => refetchItems()} requireApproval={requireApproval} /></TabsContent>
                <TabsContent value="link"><AddLink onAddItem={() => {}} refetchItems={refetchItems} requireApproval={requireApproval} /></TabsContent>
                <TabsContent value="crawl"><URLCrawling urlData={urlData} setUrlData={setUrlData} refetchItems={refetchItems} /></TabsContent>
              </div>
            </Tabs>
          </div>
        )}

        <KnowledgeFilter activeFilter={filter} onFilterChange={handleFilterChange} requireApproval={requireApproval} onToggleApproval={() => {}} />

        {items.length === 0 ? (
          <div className="bg-white rounded-lg p-10 text-center border shadow">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">{t("knowledgeHub.noItemsFound")}</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => (
              <KnowledgeCard key={item.id} item={item} onEdit={() => {}} onView={() => viewFile(item)} onDelete={() => confirmDelete(item)} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            {renderPagination()}
          </div>
        )}
        <KnowledgeFileViewModal
          isOpen={modalOpened === 'view'}
          selectedFile={selectedKnowledge}
          setSelectedFile={setSelectedKnowledge}
          closeModal={handleCloseModal}
        />

      <KnowledgeFileDeleteModal
      isOpen={modalOpened === 'delete'}
      loading={loading}
      file={selectedKnowledge}
      closeModal={handleCloseModal}
      handleDelete={handleDelete}
      />
      <AddKnowledgeModal
        isOpen={addEditModal}
        handleClose={handleCloseAddKnowledgeModal}
        handleAdd={handleAddNewKnowledgeItem}
        selectedKnowledge={selectedQA}
      />

      </div>
    </div>
  );
};