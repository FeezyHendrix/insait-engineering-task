import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useAppDispatch } from '@/hook/useReduxHooks';
import { Button } from "@/components/ui/button";
import { FaGlobe, FaHistory} from "react-icons/fa";
import constants from '@/utils/constants';
import { PageInfo } from './CrawlingComponents/CrawledCard';
import CrawledPageList from './CrawlingComponents/CrawledPageList';
import CrawlProgress from './CrawlingComponents/CrawlProgress';
import { startKnowledgeCrawlProcess, fetchKnowledgeCrawlStatusRequest, fetchActiveCrawlingJob, fetchCrawlHistory, fetchCrawlJobData } from '@/redux/slices/knowledgeHub/request';
import { URLCrawlingProp } from '@/types/knowledge';

export const URLCrawling = ({
  urlData,
  setUrlData,
  refetchItems
}: URLCrawlingProp) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [url, setUrl] = useState('');
  const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set());
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<string>();
  const [status, setStatus] = useState<"INITIALIZING" | "STARTING" | "PENDING" | "COMPLETED" | "ERROR">("COMPLETED");
  const [isCrawling, setIsCrawling] = useState(false);
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  useEffect(() => {
    const resumeIfNeeded = async () => {
      try {
        const activeJob = await dispatch(fetchActiveCrawlingJob()).unwrap();
        if (activeJob && activeJob.status === "PENDING") {
          toast.info(t("knowledgeHub.resumePreviousCrawl"));
          resumeCrawling(activeJob.id, activeJob.url);
        }
      } catch (err) {
        return
      }
    };
    resumeIfNeeded();
  }, []);

  useEffect(() => {
    const getHistory = async () => {
      setLoadingJobs(true);
      try {
        const jobs = await dispatch(fetchCrawlHistory()).unwrap();
        setRecentJobs(jobs || []);
      } catch (err) {
        setRecentJobs([]);
      } finally {
        setLoadingJobs(false);
      }
    };
    getHistory();
  }, [dispatch]);

  const isValidURL = (string: string) => {
    const urlPattern = /^https:\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;
    return urlPattern.test(string);
  };

  const startPollingJob = (jobId: string) => {
    const poller = setInterval(async () => {
      try {
        const statusData = await dispatch(fetchKnowledgeCrawlStatusRequest({ jobId })).unwrap();
        if (statusData.progress > 0 && statusData.progress < 100) setStatus("PENDING");
        if (statusData.progress === 1 && pages.length < 1) setStatus("STARTING");
        if (statusData.status === "COMPLETED") statusData.progress = 100;

       if (status === "STARTING") {
          setProgress(0);
       } else if (statusData.status === "PENDING") {
          setProgress(statusData.progress ?? progress);
          setPages(statusData.documents);
        } else if (statusData.status === "COMPLETED") {
          setProgress(statusData.progress ?? progress);
          setPages(statusData.documents);
          setIsCrawling(false);
          setStatus("COMPLETED");
          toast.success(t('knowledgeHub.CrawlingCompleted'));
          clearInterval(poller);
        } else {
          setStatus("ERROR");
          toast.error(t('knowledgeHub.crawlFailed'));
          clearInterval(poller);
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 2000);
  };

  const resumeCrawling = (jobId: string, jobUrl: string) => {
    setUrl(jobUrl);
    setIsCrawling(true);
    setStatus("PENDING");
    setProgress(0);
    setTimeRemaining(undefined);
    setPages([]);
    setSelectedPages(new Set());
    startPollingJob(jobId);
  };

  const handleAddURL = async () => {
    if (!url || !isValidURL(url)) {
      toast.error(!url ? t('knowledgeHub.specifyURL') : t('knowledgeHub.enterValidURL'));
      return;
    }

    setIsCrawling(true);
    setStatus("INITIALIZING");
    setProgress(0);
    setTimeRemaining(undefined);
    setPages([]);
    setSelectedPages(new Set());

    try {
      const startRes = await dispatch(startKnowledgeCrawlProcess({ url })).unwrap();
      const jobId = startRes.crawlJobId;
      startPollingJob(jobId);
    } catch (error) {
      console.error("Start crawl failed:", error);
      toast.error(t('knowledgeHub.crawlFailed'));
      setIsCrawling(false);
      setStatus("ERROR");
    }
  };

  const handleTogglePage = (id: string | number, selected: boolean) => {
    setSelectedPages((prev) => {
      const newSet = new Set(prev);
      selected ? newSet.add(String(id)) : newSet.delete(String(id));
      return newSet;
    });
  };

  const handleSelectAll = (selected: boolean) => {
    const allPageIds = selected ? pages.map(p => String(p.id)) : [];
    setSelectedPages(new Set(allPageIds));
  };

  const handleRemovePages = (idsToRemove: string[]) => {
    setPages((prev) => prev.filter(p => !idsToRemove.includes(String(p.id))));
    setSelectedPages((prev) => {
      const newSet = new Set(prev);
      idsToRemove.forEach(id => newSet.delete(String(id)));
      return newSet;
    });
  };

  const handleShowJob = async (job: any) => {
    if (job.status === 'ERROR') {
      toast.info(t('knowledgeHub.FailedJobLoaded'));
      setUrl(job.url);
      return;
    }
    setIsCrawling(false);
    setStatus('COMPLETED');
    setUrl(job.url);
    setProgress(100);
    setTimeRemaining(undefined);
    setSelectedPages(new Set());
    setPages([]);
    try {
      const data = await dispatch(fetchCrawlJobData({ jobId: job.id })).unwrap();
      setPages(data.documents || []);
      toast.success(t('knowledgeHub.jobLoaded'));
    } catch (err) {
      toast.error(t('knowledgeHub.loadJobFailed'));
    }
  };

  const sortedJobs = useMemo(() => {
    return [...recentJobs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [recentJobs]);

  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * jobsPerPage;
    return sortedJobs.slice(start, start + jobsPerPage);
  }, [sortedJobs, currentPage]);

  const totalPages = Math.ceil(sortedJobs.length / jobsPerPage);

  return (
    <div>
      <p className='text-xs mt-1 mb-2'>{t('knowledgeHub.crawlLinkOnSite')}</p>
      <div className='flex gap-3 pt-1'>
        <input
          onChange={e => setUrl(e.target.value)}
          value={url}
          disabled={isCrawling}
          onKeyDown={e => {
            if (e.key === 'Enter' && !isCrawling) handleAddURL();
          }}
          className='rounded-md h-10 w-10/12 outline-none px-2 text-md border border-gray-300'
          placeholder={t('input.enterValidURL')}
        />
        <Button
          onClick={handleAddURL}
          className='bg-gradient-to-r from-blue-700 to-blue-400 hover:from-blue-700 hover:to-blue-600 text-white transition-all duration-300'
          disabled={isCrawling}
        >
          <FaGlobe className="h-4 w-4 me-2" />
          {t('knowledgeHub.crawlingButton')}
        </Button>
      </div>

      <hr className='w-full h-0.5 bg-gray-300 my-5' />
      <div className='flex flex-col gap-2 overflow-y-auto'>
        {(pages.length > 0 || isCrawling) && (
          <CrawlProgress
            progress={progress}
            pagesFound={pages.length}
            pagesSelected={selectedPages.size}
            timeRemaining={timeRemaining}
            status={status}
          />
        )}
        {pages.length > 0 && (
          <>
            <CrawledPageList
              pages={pages}
              selectedPages={selectedPages}
              onSelectPage={handleTogglePage}
              onSelectAll={handleSelectAll}
              isLoading={false}
              onRemovePages={handleRemovePages}
              refetchItems={refetchItems}
            />
          </>
        )} {!isCrawling && pages.length === 0 && sortedJobs.length > 0 && (
          <div>
            <p className='text-gray-500 text-sm mb-2 flex items-center'>
            <FaHistory className="inline-block h-4 w-4 text-gray-800 me-1" />
              {t("knowledgeHub.RenctlyCrawledJobs")}
            </p>
            <div className='flex flex-col gap-2'>
              {loadingJobs ? (
                <div className='text-center text-gray-400 py-4 animate-pulse'>Loading...</div>
              ) : (
                <>
                  {paginatedJobs.map(job => (
                    <button 
                      key={job.id}
                      
                      onClick={() => handleShowJob(job)}
                      className='flex items-center justify-between rounded-lg border border-gray-200 bg-white hover:bg-blue-50 transition-all shadow-sm px-4 py-3 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-blue-400'
                    >
                      <div className='flex flex-col text-left'>
                        <span className='font-medium text-blue-700 group-hover:underline truncate max-w-xs'>{job.url}</span>
                        <span className='text-xs text-gray-400 mt-1'>
                          {job.createdAt
                            ? new Date(job.createdAt).toLocaleString('en-GB', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false
                              }).replace(',', '')
                            : 'Not started'}
                        </span>
                      </div>
                      <span
                        className={`text-xs rounded px-2 py-1 ml-2
                        ${job.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-700'
                        : job.status === 'ERROR'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {job.status === 'ERROR' ? 'FAILED' : job.status}
                      </span>
                    </button>
                  ))}
                  {totalPages > 1 && sortedJobs.length > jobsPerPage && (
                    <div className='flex justify-center items-center gap-2 mt-2'>
                      <button
                        className='px-2 py-1 rounded border text-xs disabled:opacity-50'
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        Prev
                      </button>
                      <span className='text-xs text-gray-500'>Page {currentPage} of {totalPages}</span>
                      <button
                        className='px-2 py-1 rounded border text-xs disabled:opacity-50'
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
