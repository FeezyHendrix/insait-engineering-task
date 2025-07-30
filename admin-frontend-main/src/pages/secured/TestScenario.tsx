import Button from '@/components/elements/Button'
import CreateScenario from '@/components/test-scenario/CreateScenario'
import ScenarioTable from '@/components/test-scenario/ScenarioTable'
import ViewScenario from '@/components/test-scenario/ViewScenario'
import { useAppDispatch } from '@/hook/useReduxHooks'
import { createNewTestScenario, deleteTestScenario, getTestScenariosRequest } from '@/redux/slices/analytics/request'
import { OrderSortType, TableHeaderKeyType } from '@/types/chat'
import { ScenarioModalTypes, NewScenarioType, ScenarioResponseType, FormattedScenarioType } from '@/types/scenario'
import { ITEMS_PER_PAGE } from '@/utils/data'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'

const TestScenario = () => {
  const { t } = useTranslation()
  const [scenarioData, setScenarioData] = useState<Array<FormattedScenarioType>>([])
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch()
  const [selectedScenario, setSelectedScenario] =
    useState<FormattedScenarioType | null>(null)
  const [loading, setLoading] = useState(false)
  const [totalCount, setTotalCount] = useState<number>(0)
  const [selectedTestRun, setSelectedTestRun] = useState<string | null>(null)

  const [modalOpened, setModalOpened] = useState<ScenarioModalTypes>('none')
  const formatTestScenarioData = (data: ScenarioResponseType[]): FormattedScenarioType[] => {
    return data.map((scenario) => ({
      ...scenario,
      testRuns: scenario.TestRun,
      questions: scenario.questions.map((question, qIndex) => ({
        id: (qIndex + 1).toString(),
        message: question
      }))
    }));
  };
  const handleOpenModal = (
    type: ScenarioModalTypes,
    detail: FormattedScenarioType | null
  ) => {
    if (type === 'delete') {
      if(!detail?.testScenarioId) return;
      handleDelete(detail.testScenarioId);
      return;
    }
      searchParams.delete("testRunId");
      setSearchParams(searchParams);
    setSelectedScenario(detail);
    setModalOpened(type);
  }

  const handleCloseModal = () => {
    setSelectedScenario(null)
    setModalOpened('none')

    searchParams.delete("testRunId");
    setSearchParams(searchParams);
    setSelectedTestRun(null);
  }

  const handleSubmitForm = async (newScenario: FormattedScenarioType) => {
    const currentDate = new Date().toISOString()

    if (selectedScenario?.testScenarioId) {
      setScenarioData(prev =>
        prev.map(scenario =>
          scenario.testScenarioId === selectedScenario.testScenarioId
            ? { ...newScenario, updatedAt: currentDate }
            : scenario
        )
      )
    } else {
      const formattedScenario: NewScenarioType = {
        name: newScenario.name,
        type: newScenario.type?.toString().toUpperCase() as 'QA' | 'SESSION',
        questions: newScenario.questions.map(question => ({
          message: question.message,
          answer: !question.answer || question.answer === '' ? null : question.answer
        }))
      };
      const createScenarioResponse = await dispatch(createNewTestScenario(formattedScenario))
      if (createScenarioResponse.payload.success) {
        toast.success("Test scenario created successfully")
        fetchTestScenarios(0, 'asc', 'createdAt', '');
      } else {
        toast.error("Failed to create test scenario")
      }
    }
    handleCloseModal()
  }

  const handleDelete = async (id: string) => {
    const deleteResponse = await dispatch(deleteTestScenario(id));
    if (deleteResponse.payload.success) {
      toast.success("Test scenario deleted successfully")
      fetchTestScenarios(0, 'asc', 'createdAt', '');
    } else {
      toast.error("Failed to delete test scenario")
    }
    handleCloseModal()
  }
 
  const fetchTestScenarios = async (
    page: number,
    order: OrderSortType,
    orderBy: TableHeaderKeyType,
    search: string
  ) => {
    try {
      searchParams.set('page', `${page + 1}`)
      searchParams.set('search', search)
      setSearchParams(searchParams)
      setLoading(true)
      const request = await dispatch(
        getTestScenariosRequest({
          page: page + 1,
          itemsPerPage: ITEMS_PER_PAGE,
          orderBy,
          order,
          search
        })
      )
      const response = request.payload
      if (response.data) {      
          const formattedData = formatTestScenarioData(response.data)
          setScenarioData(formattedData)
          setTotalCount(response.pagination.totalRecords)
          return
      }   
      toast.error(response?.message || t('feedback.errorWrong'))
    } catch (error) {
      toast.error(t('feedback.errorWrong'))
    } finally {
      setLoading(false)
    }
  };

  const testRunId = searchParams.get("testRunId") || undefined;
  useEffect(() => {
    if(testRunId && scenarioData.length > 0){
      const foundScenario = scenarioData.find(scenario => scenario.testRuns?.some(run => run.testRunId === testRunId));
      if(foundScenario){
        setSelectedScenario(foundScenario);
        setSelectedTestRun(testRunId);
        setModalOpened('view');      
      }
    }
  },[testRunId, scenarioData]);

  return (
    <section className='chats-conversation-container flex-1 px-2 md:px-5 pt-4 pb-5 bg-white rounded-2xl flex flex-col max-h-[85vh] m-5 border'>
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className='text-2xl bold-text'>{t('menu.scenario')}</h1>
        </div>
        <div className='flex gap-6'>
          <Button
            text={t('scenario.create')}
            onClick={() => handleOpenModal('create', null)}
            className='px-4 !text-base'
          />
        </div>
      </div>

      <ScenarioTable
        data={scenarioData}
        handleOpenModal={handleOpenModal}
        loading={loading}
        totalCount={totalCount}
        fetchTableData={fetchTestScenarios}
      />

      <CreateScenario
        isOpen={modalOpened === 'create'}
        handleCloseModal={handleCloseModal}
        selectedScenario={selectedScenario}
        handleSubmitForm={handleSubmitForm}
      />
      { selectedScenario && <ViewScenario
        isOpen={modalOpened === 'view'}
        handleCloseModal={handleCloseModal}
        selectedScenario={selectedScenario}
      />}
    </section>
  )
}

export default TestScenario
