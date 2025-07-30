import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/hook/useReduxHooks';
import { Question, Cluster } from '@/redux/slices/analytics/popularQuestionsSlice';
import Button from '@/components/elements/Button';
import ChatConversationModal from '@/components/chat/ChatConversationModal';
import useModal from '@/hook/useModal';
import { getConversationAnswerRequest, getConversationByIdRequest } from '@/redux/slices/analytics/request';
import { unwrapResult } from '@reduxjs/toolkit';
import PreviousNextPagination from '@/components/pagination/PreviousNextPagination';
import { ITEMS_PER_PAGE, MAX_ANSWER_LENGTH, MAX_QUESTION_LENGTH } from '@/utils/data';
import chatPlusIcon from '@/assets/images/icons/chat-plus.svg';
import { toast } from 'react-toastify';

const truncateAnswer = (answer: string): string => {
  if (answer.length <= MAX_ANSWER_LENGTH) return answer;
  return answer.substring(0, MAX_ANSWER_LENGTH).trim() + '...';
};

const truncateText = (text: string, maxLength: number = MAX_QUESTION_LENGTH): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
};

export default function ClusterDetails() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { clusterId } = useParams();
  const { clusters } = useAppSelector((state) => state.popularQuestions);
  const [cluster, setCluster] = useState<Cluster | null>(null);
  const { toggle, isOpen } = useModal();
  const [chatId, setChatId] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [questionsWithAnswers, setQuestionsWithAnswers] = useState<Array<Question>>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const currentCluster = clusters.find((c) => c.id === clusterId);
    if (currentCluster) {
      setCluster(currentCluster);
      fetchAnswersForQuestions(currentCluster.questions);
    }
  }, [clusterId, clusters]);

  const fetchAnswersForQuestions = async (questions: Question[]) => {
    const questionsWithAnswersPromises = questions.map(async (question) => {
      if (!question.conversationId) return question;
      
      try {
        const response = unwrapResult(
          await dispatch(getConversationAnswerRequest({
            id: question.conversationId,
            question: question.question
          }))
        );
        return {
          ...question,
          answer: response.answer
        };
      } catch (error) {
        console.error('Error fetching answer for question:', question.question, 'Error:', error);
        toast.error(t('feedback.errorFetchingAnswer'));
        return question;
      }
    });

    const updatedQuestions = await Promise.all(questionsWithAnswersPromises);
    setQuestionsWithAnswers(updatedQuestions);
  };

  const handleBack = () => {
    navigate('/unanswered-questions/popular');
  };

  const launchModal = (conversationId: string) => {
    setChatId(conversationId);
    setConversationIdParams(conversationId);
    toggle(true);
  };

  const setConversationIdParams = (id?: string | null) => {
    if (id) {
      searchParams.set('conversationId', id);
    } else {
      searchParams.delete('conversationId');
    }
    setSearchParams(searchParams);
  };

  const handleCloseModal = () => {
    toggle(false);
    setConversationIdParams();
  };

  useEffect(() => {
    const conversationId = searchParams.get('conversationId');
    if (conversationId && !isOpen) {
      setChatId(conversationId);
      toggle(true);
    }
  }, [location.search]);

  // Calculate pagination
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedQuestions = questionsWithAnswers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (!cluster) {
    return (
      <p className="text-center text-gray-500 flex-1 flex justify-center items-center">
        {t('feedback.noData')}
      </p>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-8">
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            {t('clusterDetails.backToPopular')}
          </button>

          <h1 className="text-3xl font-semibold text-gray-900 mb-3">
            {truncateText(cluster.representativeQuestion)}
          </h1>
          <p className="text-gray-500 text-lg">
            {cluster.questions?.length || 0} {t('clusterDetails.questionsInCategory')}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">{t('clusterDetails.questionsTitle')}</h2>
          </div>

          <div className="divide-y divide-gray-100">
            {!questionsWithAnswers.length ? (
              <div className="p-6 text-center text-gray-500">
                {t('clusterDetails.noQuestions')}
              </div>
            ) : (
              <>
                {paginatedQuestions.map((question: Question) => (
                  <div key={question.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                    <div className="flex flex-col space-y-2">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="text-[17px] font-medium text-gray-900 flex-1 truncate" title={question.question}>
                          {truncateText(question.question)}
                        </h3>
                        <div className="flex-shrink-0">
                          {question.conversationId && (
                            <button
                              onClick={() => launchModal(question.conversationId)}
                              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-full text-white bg-gray-900 hover:bg-gray-800 transition-colors gap-1.5"
                            >
                              <img src={chatPlusIcon} alt="chat icon" className="w-4 h-4 brightness-0 invert" />
                              {t('clusterDetails.viewConversation')}
                            </button>
                          )}
                        </div>
                      </div>
                      {question.answer && (
                        <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
                          {truncateAnswer(question.answer)}
                        </div>
                      )}
                      <div className="text-xs text-gray-400">
                        {formatDate(question.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="p-4 border-t border-gray-100">
                  <PreviousNextPagination
                    currentPage={currentPage}
                    totalItems={questionsWithAnswers.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <ChatConversationModal 
        chatId={chatId} 
        toggle={handleCloseModal} 
        isOpen={isOpen} 
        showReportButton={false} 
      />
    </div>
  );
} 