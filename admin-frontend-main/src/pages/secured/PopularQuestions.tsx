import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/hook/useReduxHooks';
import { getPopularQuestionsRequest } from '@/redux/slices/analytics/request';
import { toast } from 'react-toastify';
import { handleNetworkError, truncateText } from '@/utils';
import SelectInput from '@/components/elements/SelectInput';
import { LabelValueType } from '@/types/chat';
import { useNavigate } from 'react-router-dom';
import PreviousNextPagination from '@/components/pagination/PreviousNextPagination';
import { ITEMS_PER_PAGE, MAX_QUESTION_LENGTH } from '@/utils/data';

type SortByType = 'mostPopular' | 'mostRecent';
type TimeRangeType = 'today' | 'pastWeek' | 'pastMonth' | 'allTime';

const sortOptions: LabelValueType[] = [
  { label: 'Most Popular', value: 'mostPopular' },
  { label: 'Most Recent', value: 'mostRecent' }
];

const timeOptions: LabelValueType[] = [
  { label: 'Today', value: 'today' },
  { label: 'Past Week', value: 'pastWeek' },
  { label: 'Past Month', value: 'pastMonth' },
  { label: 'All Time', value: 'allTime' }
];

export default function PopularQuestions() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { clusters: unsortedClusters, loading, error } = useAppSelector((state) => state.popularQuestions);
  const [sortBy, setSortBy] = useState<SortByType>('mostPopular');
  const [timeRange, setTimeRange] = useState<TimeRangeType>('allTime');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter clusters based on time range
  const filteredClusters = [...(unsortedClusters || [])].filter(cluster => {
    if (timeRange === 'allTime') return true;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const timeRanges = {
      'today': () => today,
      'pastWeek': () => {
        const date = new Date(today);
        date.setDate(date.getDate() - 7);
        return date;
      },
      'pastMonth': () => {
        const date = new Date(today);
        date.setMonth(date.getMonth() - 1);
        return date;
      }
    };

    const getStartDate = timeRanges[timeRange as keyof typeof timeRanges];
    if (!getStartDate) return true;

    const cutoffDate = getStartDate();
    const clusterDate = new Date(cluster.createdAt);
    
    const clusterDateStart = new Date(
      clusterDate.getFullYear(),
      clusterDate.getMonth(),
      clusterDate.getDate()
    );

    return clusterDateStart >= cutoffDate;
  });

  // Sort filtered clusters
  const clusters = [...filteredClusters].sort((a, b) => {
    if (sortBy === 'mostPopular') {
      return (b.questions?.length || 0) - (a.questions?.length || 0);
    } else {
      return (a.questions?.length || 0) - (b.questions?.length || 0);
    }
  });

  // Calculate pagination
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedClusters = clusters.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Load data only once when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getPopularQuestionsRequest({
          sortBy: 'mostPopular',
          timeRange: 'allTime'
        })).unwrap();
      } catch (error: any) {
        const message = handleNetworkError(error);
        toast.error(message || t('feedback.errorWrong')); 
      }
    };
    fetchData();
  }, []);

  const handleClusterClick = (clusterId: string) => {
    navigate(`/unanswered-questions/popular/${clusterId}`);
  };

  if (error) {
    return (
      <p className="text-center text-red-500 flex-1 flex justify-center items-center">
        {error}
      </p>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto py-12 bg-gray-50">
      <div className="flex justify-between items-center mb-1 px-8 relative z-50">
        <div className="flex items-center gap-6">
          <h2 className="text-3xl font-medium text-gray-900">Popular Questions</h2>
          {clusters?.length > 0 && (
            <span className="text-3xl font-medium text-blue-700">
              {clusters.length}
            </span>
          )}
        </div>
        <div className="flex gap-4">
          <SelectInput
            data={sortOptions}
            value={sortBy}
            onValueChange={(value) => setSortBy(value as SortByType)}
            containerClass="w-48"
          />
          <SelectInput
            data={timeOptions}
            value={timeRange}
            onValueChange={(value) => setTimeRange(value as TimeRangeType)}
            containerClass="w-48"
          />
        </div>
      </div>

      <div className="relative">
        {loading ? (
          <p className="text-center text-gray-500 flex-1 flex justify-center items-center min-h-[400px]">
            {t('feedback.fetching')}
          </p>
        ) : !clusters?.length ? (
          <p className="text-center text-gray-500 flex-1 flex justify-center items-center min-h-[400px] text-[32px] font-medium">
            {t('feedback.noData')}
          </p>
        ) : (
          <>
            <div className="grid gap-4 px-8">
              {paginatedClusters.map((cluster) => (
                <div
                  key={cluster.id}
                  className="bg-white rounded-xl border border-gray-100/50 p-6 cursor-pointer transition-all 
                    hover:shadow-[0_0_20px_rgba(0,0,0,0.05)] hover:border-blue-500 hover:border-2
                    shadow-[0_2px_8px_rgba(0,0,0,0.02)] relative group h-[180px] flex flex-col"
                  onClick={() => handleClusterClick(cluster.id)}
                >
                  <div className="flex flex-1">
                    <div className="flex-1 pr-16">
                      <h3 className="text-[22px] font-normal text-gray-900 leading-relaxed mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {truncateText(cluster.representativeQuestion, MAX_QUESTION_LENGTH)}
                      </h3>
                      
                      {cluster.questions && cluster.questions.length > 0 && (
                        <div className="space-y-0.5">
                          <div className="border-t border-gray-100 mb-1" />
                          {cluster.questions.slice(0, 2).map((question, index) => (
                            <div 
                              key={index}
                              className="text-[13px] text-gray-500 py-0.5 hover:bg-gray-50/80 rounded transition-colors truncate"
                              title={question.question}
                            >
                              {truncateText(question.question, MAX_QUESTION_LENGTH)}
                            </div>
                          ))}
                          {cluster.questions.length > 2 && (
                            <div className="text-sm text-gray-400">
                              + {cluster.questions.length - 2} more questions
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-end justify-between h-full">
                      <span className="text-[15px] text-gray-500">
                        {cluster.questions?.length} questions
                      </span>
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <PreviousNextPagination
                currentPage={currentPage}
                totalItems={clusters.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
} 