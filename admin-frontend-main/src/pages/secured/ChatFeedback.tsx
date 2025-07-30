import { Fragment, useEffect, useState } from 'react';
import { FaStar } from "react-icons/fa";
import Button from '@/components/elements/Button';
import ChatConversationModal from '@/components/chat/ChatConversationModal';
import useModal from '@/hook/useModal';
import {
  convertNumberToReadableFormat,
  convertNumberToTime,
} from '@/utils/dateHelper';
import { fetchChatFeedbackForExport, getChatFeedback } from '@/redux/slices/analytics/request';
import { useAppDispatch, useAppSelector } from '@/hook/useReduxHooks';
import { toast } from 'react-toastify';
import '../../components/pagination/Pagination.css'
import { FEEDBACK_ITEMS_PER_PAGE } from '@/utils/data.ts'
import { chatSelector } from '@/redux/slices/analytics';
import { CompletionTableBodyType } from '@/types/dashboard';
import ReactPaginate from 'react-paginate';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Loader from '@/components/elements/Loader';
import { useTranslation } from 'react-i18next'
import { BiSupport } from "react-icons/bi";
import excelIcon from '@image/icons/excel.png'
import dayjs from 'dayjs';
import { handleExcelExport } from '@/utils/export';

const ChatFeedback = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const { toggle, isOpen } = useModal();
  const [chatId, setChatId] = useState<string>('');
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [tableData, setTableData] = useState<Array<CompletionTableBodyType>>([])
  const { totalRecords } = useAppSelector(chatSelector)
  const { data, loading } = useAppSelector(chatSelector)
  const conversationId = searchParams.get("conversationId");

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected)
  }

  const launchModal = (id: string) => {
    searchParams.set("conversationId", id)
    setSearchParams(searchParams);
    setChatId(id);
    toggle(true);
  };

  const closeModal = () => {
    searchParams.delete("conversationId")
    setSearchParams(searchParams)
    toggle()
  }

  const fetchConversationFeedback = (
    page: number,
    itemsPerPage: number,
    selectedRating: number | null
  ) => {
    try {
      searchParams.set("page", `${page + 1}`)
      setSearchParams(searchParams)
      dispatch(getChatFeedback({ page: page + 1, itemsPerPage, order: 'des', orderBy: 'createdAt', selectedRating }));
    } catch (error: any) {
      toast.error(error?.message || t("feedback.errorWrong"))
    }
  };

  useEffect(() => {
    fetchConversationFeedback(currentPage, FEEDBACK_ITEMS_PER_PAGE, selectedRating);
  }, [currentPage, selectedRating]);

  useEffect(() => {
    const chatIdParam = searchParams.get('chatId')

    if (chatIdParam) {
      searchParams.delete('chatId');
      launchModal(chatIdParam)
    }
  }, [location.search]);

  useEffect(() => {
    if (data.length && conversationId) {
      launchModal(conversationId)
    }
  }, [data.length])

  const showStars = (countOfStars: number) => {
    const stars = [];
    for (let i = 0; i < countOfStars; i++) {
      stars.push(<FaStar key={i} className="w-4 h-4 text-yellow-300" />);
    }
    return stars;
  };

  const handleStarClick = (rating: number) => {
    setSelectedRating(rating === selectedRating ? null : rating);
    setCurrentPage(0);
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={`w-8 h-8 cursor-pointer ${selectedRating && i <= selectedRating ? 'text-yellow-300' : 'text-gray-300'}`}
          onClick={() => handleStarClick(i)}
        />
      );
    }
    return stars;
  };

  const showAllMessages = () => {
    setSelectedRating(null);
    setCurrentPage(0);
  };

  const handleReportIssue = (msg: CompletionTableBodyType) => {
    const url = `${window.location.href}?conversationId=${msg.chatId}`
    navigate("/support", { state: { chatLink: url, message: msg?.userFeedback }});
  }

  const exportToExcel = async () => {
    try {
      const exportData = await fetchChatFeedbackForExport(totalRecords);
      if (!exportData || !exportData.length) {
        toast.error(t('feedback.noData'));
        return;
      }
      const headers = ['User ID', 'Chat ID', 'Rating', 'Feedback', 'Created At', 'First Name', 'Last Name']
      const ticketData = exportData.map(detail => [
        detail.user?.id || '',
        detail.chatId || '',
        detail.userRating || '',
        detail.userFeedback || '',
        dayjs(detail.createdAt).format('DD-MM-YYYY'),
        detail.user.firstName || '',
        detail.user.lastName || ''
      ]);
      const timestamp = dayjs().format('YYYYMMDD_HH_mm');
      const combinedData = [headers, ...ticketData, []];
  
      handleExcelExport(
        combinedData,
        `ChatFeedback_${timestamp}.xlsx`,
        'Feedback',
        'xlsx'
      );
      toast.success(t('feedback.fileDownloadSuccess'));
    } catch (error) {
      toast.error(t('feedback.fileDownloadError'));
    }
  };

  useEffect(() => {    
    setTableData(data)
  }, [data])

  return (
    <Fragment>
      <div className='bg-white rounded-2xl m-5 max-h-page-scroll-150 border flex-1'>
      <div className='p-5 bg-white rounded-2xl mb-10 w-full md:h-[62vh] flex flex-col gap-y-2 overflow-y-auto'>
          <div className="flex flex-col md:flex-row">
            <div className="flex justify-center items-center">
              <p className="mr-2">{t("chats.showWithRatings")}</p>
              <div className="flex">{renderStars()}</div>
                <p
                className="mx-4 px-4 py-2 bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300"
                onClick={showAllMessages}
                >
                {t('button.showAll')}
                </p>
            </div>
            <div className='flex-1 flex justify-end'>
              {tableData?.length && (
                <button onClick={exportToExcel}>
                  <img src={excelIcon} width={23} />
                </button>
              )}
            </div>
          </div>


      {tableData.length === 0 ? (
        <p className='text-center text-gray flex-1 flex justify-center items-center'>{t('feedback.noData')}</p>
      ) : 
        <>
          {loading ? <Loader /> : 
          tableData.map((message) => (
            <div
              key={message.chatId}
              className='flex flex-col md:flex-row p-5 rounded-lg border justify-between items-center gap-x-4'
            >
              <div className='w-full'>
                <div className='items-center gap-x-3'>
                  <div className='flex items-center gap-x-3 pb-5 w-full'>
                    {message.userRating ? showStars(message.userRating) : null}
                  </div>
                  <p className='font-bold text-md mb-2'>
                    {message.userFeedback && `"${message.userFeedback}"`}
                  </p>
                  <p className='text-gray-500 italic text-md mb-2'>
                    {message.user.id && `-${t('chats.user')} ${message.user.id}`}
                  </p>
                </div>
              </div>
              <div className='shrink-0 w-full md:w-auto gap-y-3'>
                <div className='flex gap-x-3'>
                  <span
                    className='flex items-center justify-center rounded-[7px] md:bg-[#f3f5f7] w-11 cursor-pointer'
                    onClick={() => handleReportIssue(message)}
                  >
                    <BiSupport className='text-2xl' />
                  </span>
                  <Button
                    className='px-3'
                    text={t('button.viewConversation')}
                    onClick={() => launchModal(message.chatId)}
                  />
                </div>
                <p className='mt-1 md:text-right text-base text-gray'>
                  {`${convertNumberToReadableFormat(message.createdAt)} ${convertNumberToTime(message.createdAt)}`}
                </p>
              </div>
            </div>
          ))}

        </>
      }
      </div>
      <ReactPaginate
            previousLabel='&#x2C2;'
            previousLinkClassName='text-xl flex items-center justify-center border border-blue-400 px-2 rounded-lg app-text-blue w-full h-full'
            nextLabel='&#x2C3;'
            nextLinkClassName='text-xl flex items-center justify-center text-center text-white app-bg-blue px-3 rounded-lg w-full h-full'
            pageLinkClassName='px-3 py-1 border rounded-lg flex items-center justify-center w-full h-full'
            breakLinkClassName='page-link'
            pageCount={Math.ceil(totalRecords / FEEDBACK_ITEMS_PER_PAGE)}
            onPageChange={handlePageChange}
            containerClassName='flex flex-wrap gap-3 justify-start md:justify-end md:mr-10 md:pt-5 px-2 pb-5 md:pb-0'
            activeClassName='text-white app-bg-blue rounded-lg'
            forcePage={currentPage}
          />
      </div>
      <ChatConversationModal 
        chatId={chatId} 
        toggle={closeModal} 
        isOpen={isOpen} 
        tableData={data}
        showReportButton={false}
      />
    </Fragment>
  );
};

export default ChatFeedback;

