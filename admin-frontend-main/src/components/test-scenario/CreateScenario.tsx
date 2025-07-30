import {
  CreateScenarioProp,
  CSVRow,
  FormattedScenarioType,
  ScenarioItem,
} from '@/types/scenario'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from '../elements/Modal'
import { InputWithIcon } from '../elements/Input'
import Button from '../elements/Button'
import ConfirmationBody from '../batchSend/mini-elements/confirmation-body'
import { FaPlus } from 'react-icons/fa6'
import { IoRemoveSharp } from 'react-icons/io5'
import { toast } from 'react-toastify'
import Papa from 'papaparse'
import CustomTooltip from '../elements/CustomTooltip'
import SelectInput from '../elements/SelectInput'
import { scenarioTypeSelectionOptions } from '@/utils/data'

const emptyScenarioValue: FormattedScenarioType = {
  testScenarioId: '',
  name: '',
  type: null,
  createdAt: '',
  testRuns: [],
  questions: [],
  correctAnswers: [],
}

const CreateScenario = ({
  isOpen,
  handleCloseModal,
  selectedScenario,
  handleSubmitForm,
}: CreateScenarioProp) => {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    text: '',
    type: '',
  })
  const [inputValues, setInputValues] =
    useState<FormattedScenarioType>(emptyScenarioValue)
  const newQuestionRef = useRef<HTMLTextAreaElement | null>(null)

  const resetForm = () => {
    setInputValues(emptyScenarioValue)
  }

  const handleFormResetAndClose = () => {
    resetForm()
    setConfirmModal({ isOpen: false, text: '', type: '' })
    handleCloseModal()
  }

  const handleVerifyCloseModal = () => {
    const hasUnsavedChanges = inputValues.questions && inputValues.type

    if (hasUnsavedChanges) {
      setConfirmModal({
        isOpen: true,
        text: t('scenario.unsavedChanges'),
        type: 'cancel',
      })
      return
    }
    handleFormResetAndClose()
  }

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    handleUpdateValue(name, value)
  }

  const handleUpdateValue = (key: string, value: any) => {
    setInputValues(prev => ({ ...prev, [key]: value }))
  }

  const handleRemoveScenario = (id: string) => {
    if (inputValues.questions.length === 1) {
      toast.error(t('scenario.feedback.oneScenarioRequired'))
      return
    }

    const newQuestions = inputValues.questions.filter(
      question => question.id !== id
    )
    handleUpdateValue('questions', newQuestions)
  }

  const handleValidateResponse = () => {
    setConfirmModal({
      isOpen: true,
      text: t('scenario.submitFormCheck', { name: inputValues.name }),
      type: 'submit',
    })
  }

  const handleScenarioTypeSelection = (value: string) => {
    handleUpdateValue('type', value)
    handleUpdateValue('questions', [{ id: 1, message: '' }])
  }

  const handleAddUserMessage = () => {
    const hasEmptyScenario = inputValues.questions.some(
      question => !question.message
    )

    if (hasEmptyScenario) {
      toast.error(t('scenario.feedback.emptyScenario'))
      return
    }

    const newId = Math.max(...inputValues.questions.map(s => Number(s.id))) + 1
    const newQuestion = { id: newId, message: '' }

    handleUpdateValue('questions', [...inputValues.questions, newQuestion])
  }

  const handleSubmit = () => {
    if (confirmModal.type === 'cancel') {
      handleFormResetAndClose()
    }
    if (confirmModal.type === 'submit') {
      handleSubmitData()
    }
  }

  const handleCloseConfirmModal = () => {
    if (confirmModal.type === 'cancel') {
      setConfirmModal({ isOpen: false, text: '', type: '' })
    }
    if (confirmModal.type === 'submit') {
      handleFormResetAndClose()
    }
  }

  const handleSubmitData = () => {
    const filteredQuestions = inputValues.questions.filter(
      question => question.message.trim() !== ''
    )

    const formData = {
      ...inputValues,
      questions: filteredQuestions,
    }

    resetForm()
    setConfirmModal({ isOpen: false, text: '', type: '' })

    handleSubmitForm(formData)
  }

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    Papa.parse<CSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        if (!results?.data?.length) {
          toast.error(t('feedback.fileProcessingFailed'))
          return
        }

        const firstRow = results.data[0] as CSVRow
        const headers = Object.keys(firstRow)
        const requiredFields = ['message']

        const missingFields = requiredFields.filter(
          field => !headers.includes(field)
        )
        if (missingFields.length > 0) {
          toast.error(
            t('feedback.fileInclude', { name: missingFields.join(', ') })
          )
          return
        }

        try {
          const newQuestions = (results.data as CSVRow[])
            .map((row, index: number) => ({
              id: index + 1,
              message: row.message || '',
            }))
            .filter(question => question.message.trim() !== '')

          if (newQuestions.length === 0) {
            toast.error(t('scenario.feedback.noValid'))
            return
          }

          const newCorrectAnswers = (results.data as CSVRow[])
            .map((row, index: number) => ({
              id: index + 1,
              answer: row.answer || '',
            }))
            .filter(answer => answer.answer.trim() !== '')

          handleUpdateValue('questions', newQuestions)
          handleUpdateValue('correctAnswers', newCorrectAnswers)
          toast.success(t('scenario.feedback.csvUpload'))
        } catch (error) {
          toast.error(t('scenario.feedback.csvError'))
        }
      },
      error: function (error) {
        toast.error(t('scenario.feedback.csvError'))
      },
    })
  }

  const handleInputChange = (
    e: ChangeEvent<HTMLTextAreaElement>,
    id: string,
    inputType: 'message' | 'answer'
  ) => {
    const newQuestions = inputValues.questions.map(question => 
      question.id === id ? { ...question, [inputType]: e.target.value } : question
    )
    handleUpdateValue('questions', newQuestions)
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    item: ScenarioItem
  ) => {
    if (e.key === 'Enter') {
      if (!e.shiftKey) {
        e.preventDefault()

        if (item.message.trim() !== '') {
          handleAddUserMessage()
        } else {
          toast.error(t('scenario.feedback.emptyScenario'))
        }
      }
    }
  }

  useEffect(() => {
    if (selectedScenario?.testScenarioId) {
      setInputValues(selectedScenario)
    } else {
      setInputValues(emptyScenarioValue)
    }
  }, [selectedScenario])

  useEffect(() => {
    if (newQuestionRef.current) {
      newQuestionRef.current.focus()
    }
  }, [inputValues?.questions?.length])

  return (
    <Modal
      isOpen={isOpen}
      toggle={handleVerifyCloseModal}
      additionalClass={
        confirmModal.isOpen
          ? 'max-h-[450px] min-w-[450px] w-[450px]'
          : 'p-6 !max-h-[85%] min-w-[70%]'
      }
    >
      {confirmModal.isOpen == false && (
        <>
          <h1 className='text-2xl bold-text mb-5'>{t('scenario.create')}</h1>
          <div className='h-full overflow-y-auto flex flex-col'>
            <div className='flex-1'>
              <InputWithIcon
                label={t('scenario.form.name')}
                placeholder=''
                name='name'
                onChange={handleChangeInput}
                value={inputValues.name}
                extraClass='!pt-2 pb-4'
              />
              <SelectInput
                label={t('scenario.table.type')}
                placeholder={t('scenario.table.type')}
                value={inputValues.type || ''}
                extraClass={'w-full'}
                data={scenarioTypeSelectionOptions}
                onValueChange={handleScenarioTypeSelection}
              />

              {inputValues.type && (
                <div className='my-4'>
                  <div className='border-b border-gray-300 flex mb-4 justify-between items-center'>
                    <label className='text-xl font-medium '>
                      {t('scenario.interactionBuilder')}
                    </label>

                    <CustomTooltip
                      title={t('scenario.feedback.fileInfo')}
                      noWrap={false}
                    >
                      <label
                        className='text-blue-400 text-sm cursor-pointer hover:text-blue-600 inline-block'
                        role='button'
                      >
                        <input
                          id='dropzone-file'
                          type='file'
                          accept='.csv'
                          className='hidden'
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                        />
                        {t('scenario.actions.uploadCSV')}
                      </label>
                    </CustomTooltip>
                  </div>
                  {inputValues.questions.map((item, i) => (
                    <div key={item.id} className='flex gap-4 mb-4'>
                      <div className={'w-full'}>
                        <div className='flex justify-between'>
                          <label>
                            {inputValues.type === 'session'
                              ? t('scenario.form.userMessage')
                              : t('scenario.form.question')}{' '}
                            {i + 1}
                          </label>
                          {inputValues.questions.length > 1 && (
                            <button
                              onClick={() => handleRemoveScenario(item.id)}
                            >
                              <IoRemoveSharp className='text-md' />
                            </button>
                          )}
                        </div>
                        <textarea
                          className='mt-1 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 outline-none'
                          value={item.message}
                          ref={
                            i === inputValues.questions.length - 1
                              ? newQuestionRef
                              : null
                          }
                          onChange={e => handleInputChange(e, item.id, 'message')}
                          onKeyDown={e => handleKeyDown(e, item)}
                          placeholder='Question...'
                        >
                        </textarea>
                        {inputValues.type === 'QA' && 
                          <textarea
                          className='mt-1 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 outline-none'
                          value={item.answer}
                          onChange={e => handleInputChange(e, item.id, 'answer')}
                          onKeyDown={e => handleKeyDown(e, item)}
                          placeholder='Answer (optional)...'
                        ></textarea>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {inputValues.questions?.length > 0 && (
                <div className='flex px-3 justify-end'>
                  <button
                    onClick={handleAddUserMessage}
                    className='app-bg-blue text-sm text-white flex gap-1 py-1.5 px-2 rounded-md items-center'
                  >
                    <FaPlus className='text-sm' />
                    {t('button.add')}
                  </button>
                </div>
              )}
            </div>

            <div className='flex items-center justify-center gap-4'>
              <Button
                disabled={!inputValues.name || !inputValues.type || !inputValues.questions.length} 
                text={
                  selectedScenario?.testScenarioId ? t('button.update') : t('button.submit')
                }
                variant='contained'
                className='flex px-6'
                onClick={handleValidateResponse}
                loading={loading}
              />
              <button
                className='text-white bg-red-400 px-4 py-2 rounded-lg font-semibold text-lg'
                onClick={handleFormResetAndClose}
              >
                {t('button.cancel')}
              </button>
            </div>
          </div>
        </>
      )}
      {confirmModal.isOpen === true && (
        <ConfirmationBody
          toggle={handleCloseConfirmModal}
          title={confirmModal.text}
          confirm={handleSubmit}
          buttonText={t('button.confirm')}
        />
      )}
    </Modal>
  )
}

export default CreateScenario
