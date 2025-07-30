import { TestConversationType, TestRunType, ViewScenarioProp } from '@/types/scenario'
import Modal from '../elements/Modal'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { useAppDispatch } from '@/hook/useReduxHooks'
import { getTestRunsRequest } from '@/redux/slices/analytics/request'
import { toast } from 'react-toastify'
import { t } from 'i18next'
import { generateStatusTextColor, pageOptions } from '@/utils/data'
import excelIcon from '@image/icons/excel.png'
import { handleExcelExport } from '@/utils/export'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { normalizeMenuLink } from '@/utils'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { BiSupport } from 'react-icons/bi'

const ViewScenario = ({
  isOpen,
  handleCloseModal,
  selectedScenario,
  showReportButton = true
}: ViewScenarioProp) => {

  const [testRuns, setTestRuns] = useState<Array<TestRunType>>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTestRun, setSelectedTestRun] = useState<TestRunType | null>(null);
  const [viewQuestions, setViewQuestions] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch()
  const navigate = useNavigate();
  

  const handleConversationClick = async (testRunId: string) => {
    const clickedTestRun: TestRunType | undefined = testRuns.find((testRun) => testRun.testRunId === testRunId);
    setSelectedTestRun(clickedTestRun || null)
    searchParams.set("testRunId", testRunId);
    setSearchParams(searchParams);

    const selectedConversationData: TestConversationType[] | null = testRuns.find((testRun) => testRun.testRunId === testRunId)?.messages || null;
    if (!selectedConversationData) return;
  }
  const visiblePages = useSelector((state: RootState) => state.companyConfig.pages);
  const pagesToShow = pageOptions
    .filter(option => visiblePages.regularUsers.includes(normalizeMenuLink(option.link)))
    .map(page => page.link);
    
    const closeModal = () => {
      const testRunId = searchParams.get("testRunId");
      if (selectedTestRun) {
        setSelectedTestRun(null);
        if (testRunId) {
          searchParams.delete("testRunId");
          setSearchParams(searchParams);
        }
        return;
      }
      handleCloseModal();
    };

  const fetchTestRuns = async () => {
    setIsLoading(true)

    try {
      const scenarioId = selectedScenario.testScenarioId;
      if (!scenarioId) return;
      const response = await dispatch(getTestRunsRequest(scenarioId));
      const runs = response.payload;
      setTestRuns(runs)
      const testRunIdFromUrl = searchParams.get("testRunId");
      if (testRunIdFromUrl) {
        const foundRun = runs.find((run: TestRunType) => run.testRunId === testRunIdFromUrl);
        if (foundRun) {
          setSelectedTestRun(foundRun);
        }
      }
    } catch (error) {
      toast.error(t('feedback.errorWrong'))
    }
    setIsLoading(false)
  };

  const formatTestRunScore = (messages: TestConversationType[] | undefined): string => {
    const correctAnswerCount = selectedScenario.correctAnswers.filter((answer) => answer).length;
    const output = (!messages || !correctAnswerCount) ? '-' 
    : `${messages.filter((message) => message.correct).length} / ${correctAnswerCount}`;
    return output;
  };

  useEffect(() => {
    if (isOpen) {
      fetchTestRuns()
    }
  }, [isOpen])

  useEffect(() => {
    const testRunId = searchParams.get("testRunId");
  
    if (testRunId && testRuns.length > 0 && !selectedTestRun) {
      const found = testRuns.find(run => run.testRunId === testRunId);
      if (found) {
        setSelectedTestRun(found);
      }
    }
  }, [searchParams, testRuns, selectedTestRun]);
  

    const exportToExcel = () => {
      try {
        const headers = [
          t('scenario.view.userMessage'), 
          t('scenario.view.botResponse'),
          ...(selectedScenario.type === 'QA' ? [t('scenario.view.correctAnswers'), t('scenario.view.answeredCorrectly')] : [])
        ];
        const messageData = selectedTestRun?.messages.map((message, index) => [
          message.user,
          message.assistant,
          ...selectedScenario.type === 'QA' ? [
            selectedScenario.correctAnswers[index] || '-',
            !selectedScenario.correctAnswers[index] ? '-' : message.correct ? "Yes" : "No"
          ] : []
        ]);
        const timestamp = dayjs(selectedTestRun?.runDate).format('YYYY_MM_DD_HH_mm')
        if (!messageData) {
          toast.error(t('feedback.fileDownloadError'))
          return
        };
        const combinedData = [headers, ...messageData, []]
        handleExcelExport(
          combinedData,
          `Test_Scenario_${selectedScenario.name}_Run_${timestamp}.csv`,
          'Tickets',
          'csv'
        )
        toast.success(t('feedback.fileDownloadSuccess'))
      } catch (error) {
        toast.error(t('feedback.fileDownloadError'))
      }
    }
    const handleIssueReport = () => {
      navigate("/support", { state: { chatLink: window.location.href }});
    }
  

  return (
    <Modal
      isOpen={isOpen}
      toggle={closeModal}
      additionalClass={'p-6 !max-h-[85%] min-w-[70%]'}
    >
      <h1 className='text-2xl text-center bold-text mb-5'>
        {t('scenario.view.testScenario')}: {selectedScenario.name}
      </h1>
      <div className='overflow-y-auto max-h-[75vh]'>
      {selectedTestRun ? (
        <>
          <h3 className='text-xl text-center bold-text mb-5'>
            {t('scenario.view.testRun')} {selectedTestRun.testRunId}
          </h3>
          <div className='flex justify-end mb-4'>
            {pagesToShow.includes('/support/') && showReportButton &&(
              <button
                title={`${t('support.ReportIssue')}`}
                onClick={handleIssueReport}
                className='copy-icon flex justify-center items-center'
              >
                <BiSupport className='text-2xl' />
              </button>
            )}
          </div>
          <div className='flex gap-2'>
            <span className='font-bold'>{t('scenario.view.runDate')}:</span>
            <span>
              {dayjs(selectedTestRun.runDate).format('MMMM D, YYYY HH:mm')}
            </span>
          </div>
          <div className='flex gap-2'>
            <span className='font-bold'>{t('scenario.view.type')}:</span>
            <span>
              {selectedScenario.type}
            </span>
          </div>
          <div className='flex gap-2'>
            <span className='font-bold'>{t('scenario.view.status')}:</span>
            <span>
              {selectedTestRun.status}
            </span>
          </div>
          <div className='flex gap-2 mb-4'>
            <button onClick={() => exportToExcel()}>
                <img src={excelIcon} width={23} />
            </button>
            <span>{t('unanswered.actions.exportToExcel')}</span>
          </div>

          <table className='w-full'>
            <thead className='primary-style sticky top-0 z-10'>
              <tr>
                <th className=''>{t('scenario.view.userMessage')}</th>
                <th className=''>{t('scenario.view.botResponse')}</th>
                {selectedScenario.type === 'QA' && <th className=''>{t('scenario.view.correctAnswers')}</th>}
                {selectedScenario.type === 'QA' && <th className=''>{t('scenario.view.answeredCorrectly')}</th>}
              </tr>
            </thead>
            { selectedTestRun.messages &&
            <tbody>
              {selectedTestRun.messages.map((message, index) => (
                <tr key={index} className=' border-b'>
                  <td className=' py-4 app-word-break'>
                    {message.user}
                  </td>
                  <td className=' py-4 app-word-break'>
                    {message.assistant && /(https?:\/\/[^\s]+)/g.test(message.assistant) ? (
                        <a 
                          href={message.assistant.match(/(https?:\/\/[^\s)]+)/g)?.[0]} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-500" 
                          title={message.assistant.match(/(https?:\/\/[^\s)]+)/g)?.[0]}>
                        {message.assistant}
                        </a>
                    ) : (
                      message.assistant
                    )}
                  </td>
                  {selectedScenario.type === 'QA' && <>
                  <td className=' py-4 app-word-break'>
                    {selectedScenario.correctAnswers[index] || '-'}
                  </td>
                  <td className={`py-4 app-word-break ${selectedScenario.correctAnswers[index] ? (message.correct ? 'text-green-600' : 'text-red-600') : ''}`}>
                    {!selectedScenario.correctAnswers[index] ? '-' : message.correct ? "Yes" : "No"}
                  </td>
                  </>}
                </tr>
              ))}
            </tbody>}
          </table>
          {!selectedTestRun.messages.length &&
            <div className='flex justify-center py-4'>
              <p className='text-center'>{t('scenario.view.noMessages')}</p>
            </div>
          }  
        </>
      ) : (
        <>
          <div className='flex gap-2 py-2'>
            <span className='font-bold'>{t('scenario.view.type')}:</span>
            <span>{selectedScenario.type}</span>
          </div>

          <div className="flex gap-2 py-2 items-center">
            <span className="font-bold">
              {selectedScenario.type === 'QA' ? t('scenario.view.questions') : t('scenario.view.messages')}:
            </span>
            <span>{selectedScenario.questions.length}</span>
            <button 
              type="button" 
              onClick={() => setViewQuestions(!viewQuestions)} 
              className={`rounded-lg text-xs px-2 py-1 me-2 mb-2 transition 
                ${viewQuestions ? 'text-black bg-gray-300 hover:bg-gray-500' : 'text-white bg-blue-500 hover:bg-blue-800'}`}>
              {viewQuestions ? t('scenario.view.hideQuestions') : t('scenario.view.viewQuestions')}
            </button>
          </div>

          {viewQuestions && (
            <div className="bg-gray-100 w-1/2 rounded-lg pl-2 shadow-md text-sm">
              {selectedScenario.questions.map((question, index) => (
                <div key={index} className="p-2 border-b last:border-none">
                  <p className="text-base font-medium">
                    {index + 1}. {question.message}
                  </p>
                  {selectedScenario.correctAnswers[index] && (
                    <p className="text-sm text-gray-500 mt-1 italic">
                      Correct Answer:  
                      <span className="ml-2 font-normal text-green-600">
                        {selectedScenario.correctAnswers[index]}
                      </span>
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          <p className='text-xl font-semibold mt-5'>{t('scenario.view.pastTestRuns')}</p>
          {isLoading ? 
         <p className='text-center'>{t('feedback.loading')}</p>
         :
         <>
         {testRuns.length > 0 ?
          <table className='w-full'>
            <thead className='primary-style sticky top-0 z-10'>
              <tr>
                <th className='text-center'>{t('scenario.view.status')}</th>
                <th className='text-center'>{t('scenario.view.runDate')}</th>
                {selectedScenario.type === 'QA' && <th className='text-center'>{t('scenario.view.score')}</th>}
                <th className='w-20'></th>
              </tr>
            </thead>
            <tbody>
              {testRuns.map(testRun => (
                <tr key={testRun.testRunId} className=' border-b'>
                  <td className={`text-center py-4 text-${generateStatusTextColor(testRun.status)}-600`}>{testRun.status}</td>
                  <td className='text-center py-4'>
                    {dayjs(testRun.runDate).format(
                      'MMMM D, YYYY HH:mm'
                    )}
                  </td>
                  {selectedScenario.type === 'QA' && 
                  <td className={`text-center py-4`}>
                    {formatTestRunScore(testRun.messages)}
                  </td>}
                  <td
                    onClick={() => handleConversationClick(testRun.testRunId)}
                    className={`w-20 cursor-pointer text-blue-500`}
                  >
                    {t('scenario.actions.view')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        :
          <p className='text-center'>{t('scenario.view.hasntRun')}</p> 
          // TODO add run button 
        }
        </>}
        </>
      )}
      </div>
    </Modal>
  )
}

export default ViewScenario
