import { useEffect, useState } from 'react'
import Button from '@/components/elements/Button'
import ChatConversationModal from '@/components/chat/ChatConversationModal'
import useModal from '@/hook/useModal'
import {
  convertDateToReadableFormat,
  convertDatetimeToTime,
  getStartEndDateRange,
} from '@/utils/dateHelper'
import botImg from '@image/bot.svg'
import trashImg from '@image/icons/trash.svg'
import { BookmarkIcon } from '@/components/icons'
import { deleteUnansweredQRequest, fetchUnansweredQsData, getUnansweredQsDataRequest, putUnansweredQArchiveRequest } from '@/redux/slices/analytics/request'
import { useAppDispatch } from '@/hook/useReduxHooks'
import { toast } from 'react-toastify'
import { UnansweredQsType } from '@/types/unansweredQs'
import ReactPaginate from 'react-paginate'
import { camelToSentenceCase, UNANSWERED_QA_PER_PAGE } from '@/utils/data'
import { formatUnansweredQuestionData, getEllipsisForLongText } from '@/utils'
import { BiSupport } from "react-icons/bi";
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import ExportByOptions from '@/components/elements/ExportByOptions'
import { ExportDateOptions } from '@/types/chat'
import { handleExcelExport } from '@/utils/export'
import CustomTooltip from '@/components/elements/CustomTooltip'

const UnansweredQuestions = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate();
  const { toggle, isOpen } = useModal()
  const [chatId, setChatId] = useState<string | null>(null)
  const [totalRecords, setTotalRecords] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [questions, setQuestions] = useState<UnansweredQsType[]>([]);
  const [searchParams, setSearchParams] = useSearchParams()


  const launchModal = (conversationId: string) => {
    setChatId(conversationId)
    setConversationIdParams(conversationId)
  }

  const handleRemove = async (unansweredQ: UnansweredQsType) => {
    setQuestions((prev) => prev.filter((item) => item.unansweredQId !== unansweredQ.unansweredQId))
    try {
      await dispatch(deleteUnansweredQRequest(unansweredQ.unansweredQId))
      toast.success(
        t('unanswered.questionRemoved', {
          question: getEllipsisForLongText(unansweredQ.question)
        }));
      
    } catch (error: any) {
      toast.error(error?.message || t('feedback.errorWrong'))
    }
  }

  const handleArchive = async (unansweredQ: UnansweredQsType) => {
    try {
      const archive = !(questions.find((item) => item.unansweredQId === unansweredQ.unansweredQId)?.archive || false);
      const { unansweredQId } = unansweredQ
      const payload = { unansweredQId, archive };
      await dispatch(putUnansweredQArchiveRequest(payload))
      toast.success(
        t('unanswered.questionArchived', {
          question: getEllipsisForLongText(unansweredQ.question),
          archived: archive ? "archived" : "unarchived",
        }))
      setQuestions((prev: UnansweredQsType[]) =>
        prev.map((item: UnansweredQsType) =>
          item.unansweredQId === unansweredQId ? { ...item, archive: archive } : item
        )
      )
    } catch (error: any) {
      toast.error(error?.message || t('feedback.errorWrong'))
    }
  }
  

  const fetchUnansweredQuestionsData = async () => {
    try {
      const response = await dispatch(getUnansweredQsDataRequest({page: currentPage + 1, limit: UNANSWERED_QA_PER_PAGE}))
      const payload = await response.payload
      if (!payload?.data || isNaN(payload?.total)) {
        toast.error('Error fetching unanswered questions');
        return;
      };
      const questions = formatUnansweredQuestionData(payload.data);
      setQuestions(questions)
      setTotalRecords(payload.total)
      return;
    } catch (error: any) {
      toast.error(error?.message || t('feedback.errorWrong'))
    }

  }

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected)
  }

  const setConversationIdParams = (id?: string | null) => {
    if (id) {
      searchParams.set('conversationId', id)
    } else {
      searchParams.delete('conversationId')
    }
    setSearchParams(searchParams)
  }

  const handleCloseModal = () => {
    toggle(false);
    setConversationIdParams()
  }

  const handleIssueReport = (que: UnansweredQsType) => {
    const url = `${window.location.href}?conversationId=${que.conversationId}`
    navigate("/support", { state: { chatLink: url, subject: que?.question }});
  }

  useEffect(() => {
    const conversationId = searchParams.get('conversationId')

    if (conversationId && !isOpen) {
      setChatId(conversationId)
      toggle(true)
    }
  }, [location.search])

  const exportToExcel = async (value: ExportDateOptions) => {
    try {
      const {startDate, endDate} = getStartEndDateRange(value)
      const response = await fetchUnansweredQsData(startDate, endDate);

      if(!Array.isArray(response) || response?.length === 0) {
        return toast.error(t('feedback.noData'))
      }
      const headers = [...Object.keys(response[0] || []).map(key => camelToSentenceCase(key, true))];
      const exportData = response.map(detail => Object.values(detail).map(String));

      const combinedData = [
        headers,
        ...exportData,
        [],
      ];
      handleExcelExport(combinedData, `UnansweredQues.csv`,  'Unanswered Questions', 'csv')
      toast.success(t('feedback.fileDownloadSuccess'));
    } catch (error) {
      toast.error(t('feedback.fileDownloadError'))
    }
  };

  useEffect(() => {
    fetchUnansweredQuestionsData()
  }, [currentPage])
  return (
    <section className='m-5 py-5 bg-white rounded-2xl mb-4  flex flex-col max-h-page-scroll-150 border'>
      <div className="flex px-5">
        {questions.length > 0 && <ExportByOptions onExport={exportToExcel} title={t('unanswered.actions.exportToExcel')} />}
      </div>
      <div className="flex-1 overflow-y-auto overflow-x-auto flex flex-col gap-y-5 px-5">
      {questions.length === 0 ? (
        <p className='text-center text-gray flex-1 flex justify-center items-center'>{t('unanswered.noUnanswered')}</p>
      ) : (
        questions.map((question) => (
            <div
              key={question.unansweredQId}
              className='flex flex-col md:flex-row p-5 rounded-lg border justify-between items-center gap-x-4'
            >
              <div className='w-full md:w-[calc(100%-350px)]'>
                <p className='font-bold text-md mb-2'>{question.question}</p>
                <div className='flex items-center gap-x-3'>
                  <img src={botImg} width={34} height={34} />
                  <abbr
                    className='text-base w-[40vw] overflow-hidden whitespace-nowrap text-ellipsis no-underline'
                    title={question.answer}
                  >
                    {question.answer}
                  </abbr>
                </div>
              </div>
              <div className='mt-6 md:mt-0 md:shrink-0'>
                <div className='flex gap-x-2'>
                  <span
                    className='flex items-center justify-center rounded-[7px] bg-[#f3f5f7] w-11 cursor-pointer'
                    onClick={() => handleIssueReport(question)}
                    >
                    <CustomTooltip title={t('unanswered.actions.contactSupport')}>
                        <BiSupport className='text-2xl' />
                    </CustomTooltip>
                  </span>
                  <span
                    className='flex items-center justify-center rounded-[7px] bg-[#f3f5f7] w-11 cursor-pointer'
                    onClick={() => handleArchive(question)}
                  >
                    <CustomTooltip title={t('unanswered.actions.archive')}>
                      <BookmarkIcon active={question.archive} />
                    </CustomTooltip>
                  </span>
                  <span
                    className='flex items-center justify-center rounded-[7px] bg-[#f3f5f7] w-11 cursor-pointer'
                    onClick={() => handleRemove(question)}
                  >
                    <CustomTooltip title={t('unanswered.actions.delete')}>
                      <img src={trashImg} alt='pdf' width={28} height={28} />
                    </CustomTooltip>
                  </span>
                  <Button
                    className='px-3'
                    text={t('button.viewConversation')}
                    onClick={() => launchModal(question.conversationId)}
                  />
                </div>
                <p className='mt-1 text-right text-base text-gray'>
                  {`${convertDateToReadableFormat(
                    question.createdAt
                  )} ${convertDatetimeToTime(question.createdAt)}`}
                </p>
              </div>
            </div>
          ))
      )}
      </div>
      {questions.length > 0 && (
        <div className='flex md:justify-end'>
          <ReactPaginate
            previousLabel='&#x2C2;'
            previousLinkClassName='text-xl flex items-center justify-center border border-blue-400 px-2 rounded-lg app-text-blue w-full h-full'
            nextLabel='&#x2C3;'
            nextLinkClassName='text-xl flex items-center justify-center text-center text-white app-bg-blue px-3 rounded-lg w-full h-full'
            pageLinkClassName='px-3 py-1 border rounded-lg flex items-center justify-center w-full h-full'
            breakLinkClassName='page-link'
            pageCount={Math.ceil(totalRecords / UNANSWERED_QA_PER_PAGE)}
            onPageChange={handlePageChange}
            containerClassName='flex gap-3 justify-start md:justify-end md:me-10 pt-5'
            activeClassName='text-white app-bg-blue rounded-lg'
            forcePage={currentPage}
          />
        </div>
      )}
      <ChatConversationModal chatId={chatId} toggle={handleCloseModal} isOpen={isOpen} showReportButton={false} />
    </section>
  )
  
}

export default UnansweredQuestions
