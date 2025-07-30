import {
  enableSendingOfEmailOption,
  prioritySelectionOptions,
  processFileRemove,
  processNewFiles,
  relatedToConversationSelectionOption,
  ticketStatusSelectionOptions,
  ticketTypeSelectionOptions,
} from '@/utils/data'
import Button from '../elements/Button'
import { InputWithIcon } from '../elements/Input'
import MessageInput from '../elements/MessageInput'
import SelectInput from '../elements/SelectInput'
import ToggleRadioSelection from '../elements/ToggleRadioSelection'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '@/hook/useReduxHooks'
import { useEffect, useRef, useState } from 'react'

import Modal from '../elements/Modal'
import ConfirmationBody from '../batchSend/mini-elements/confirmation-body'
import {
  CreateContactSupportProp,
  CreateTicketFormType,
  FileWithPreview,
} from '@/types/support'
import EmailInputBox from '../elements/EmailInputBox'
import {
  createSupportRequest,
  updateSupportRequest,
} from '@/redux/slices/analytics/request'
import { useTranslation } from 'react-i18next'
import { useIsInternalOrAdminUser } from '@/hook/useShowRegularInternalPage'

import AttachFile from './AttachFile'

const CreateContactSupport = ({
  isOpen,
  toggle,
  selectedTicket,
  fetchNewData,
}: CreateContactSupportProp) => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const companyName = useAppSelector(state => state.companyConfig.company)
  const isAdminOrInternalUser = useIsInternalOrAdminUser()

  const [loading, setLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<FileWithPreview[]>([])
  const [inputValues, setInputValues] = useState<CreateTicketFormType>({
    subject: '',
    message: '',
    chatLink: '',
    priority: '',
    status: '',
    requestType: '',
    notificationEmails: [],
  });
  const [isValidChatURL, setIsValidChatURL] = useState<boolean>(false);

  const [isRelatedToConversation, setIsRelatedToConversation] = useState('')
  const [isEmailFieldEnabled, setIsEmailFieldEnabled] = useState('')

  const handleQuerySelection = (value: string) => {
    if (value === 'no') {
      setInputValues(prev => ({ ...prev, chatLink: '' }))
    }
    setIsRelatedToConversation(value)
  }

  const handleEmailEnableSelection = (value: string) => {
    setIsEmailFieldEnabled(value)
  }

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    handleUpdateValue(name, value)
  }

  const handleValidateResponse = () => {
    const { requestType, chatLink, priority, subject, notificationEmails } =
      inputValues

    const linkRegex =
      /^(https?:\/\/)?([\w\d-]+\.){1,2}[a-z]{2,6}(:\d+)?(\/.*)?$/

    if (!subject) {
      toast.error(t('support.validation.subjectMissing'))
      return
    }

    if (!priority) {
      toast.error(t('support.validation.priorityMissing'))
      return
    }
    if (!requestType) {
      toast.error(t('support.validation.requestTypeMissing'))
      return
    }

    if (!isEmailFieldEnabled) {
      toast.error(t('support.validation.emailNotificationNotSelected'))
      return
    }

    if (isRelatedToConversation === 'yes' && !linkRegex.test(chatLink)) {
      toast.error(t('support.validation.invalidLink'))
      return
    }

    if (isEmailFieldEnabled === 'yes' && notificationEmails.length === 0) {
      toast.error(t('support.validation.emailMissing'))
      return
    }

    setShowConfirmation(true)
  }

  const handleUpdateValue = (key: string, value: any) => {
    setInputValues(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmitTicket = async () => {
    try {
      const {
        message,
        chatLink,
        priority,
        subject,
        requestType,
        status,
        notificationEmails,
      } = inputValues
      setShowConfirmation(false)
      setLoading(true)

      const formData = new FormData()

      const data = {
        id: selectedTicket?.id,
        subject,
        companyName,
        message,
        priority,
        requestType,
        status,
        chatURL: chatLink,
        notificationEmails,
      }

      Array.from(uploadedFiles).forEach(file => formData.append('files', file))
      formData.append('data', JSON.stringify(data))

      const response = selectedTicket?.id
        ? await dispatch(updateSupportRequest(data))
        : await dispatch(createSupportRequest(formData))

      if (response.payload?.status) {
        toast.success(
          selectedTicket?.id
            ? t('support.ticketUpdatedSuccess')
            : t('support.ticketCreatedSuccess')
        )
        fetchNewData('reload')
        closeModal()
        return
      }
      toast.error(response?.payload?.message || t('feedback.errorWrong'))
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setInputValues({
      subject: '',
      message: '',
      chatLink: '',
      priority: '',
      status: '',
      requestType: '',
      notificationEmails: [],
    })
    setUploadedFiles([])
    setIsRelatedToConversation('')
    setIsEmailFieldEnabled('')
  }

  const closeModal = () => {
    resetForm()
    setShowConfirmation(false)
    toggle()
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files

    const newFiles = processNewFiles(files)

    if (!newFiles || newFiles.length === 0) return

    setUploadedFiles(prev => [...prev, ...newFiles])

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => processFileRemove(prev, index))
  }

  useEffect(() => {
    if (selectedTicket) {
      const {
        chatURL,
        subject,
        message,
        priority,
        status,
        id,
        requestType,
        notificationEmails,
      } = selectedTicket
      setIsRelatedToConversation(chatURL ? 'yes' : id ? 'no' : '')
      setIsEmailFieldEnabled(
        notificationEmails?.length ? 'yes' : id ? 'no' : ''
      )
      setInputValues({
        subject: subject || '',
        message: message || '',
        chatLink: chatURL || '',
        priority: priority || '',
        requestType: requestType || '',
        status,
        notificationEmails: notificationEmails ?? [],
      })
      if(selectedTicket.fileURLs) {
        setUploadedFiles(selectedTicket.fileURLs)
      }
    } else {
      resetForm()
    }
  }, [selectedTicket, isOpen]);

  useEffect(() => {
    const isValid = inputValues.chatLink.startsWith(window.location.origin);
    setIsValidChatURL(isValid);
  }, [inputValues.chatLink]);

  return (
    <Modal
      isOpen={isOpen}
      toggle={closeModal}
      additionalClass={
        showConfirmation
          ? 'max-h-[450px] min-w-[450px] w-[450px]'
          : 'p-6 !max-h-[85%] min-w-[70%]'
      }
    >
      {showConfirmation == false && (
        <>
          <h1 className='text-2xl bold-text mb-5'>
            {t('support.submitTicket')}
          </h1>
          <div className='h-full overflow-y-auto flex flex-col'>
            <InputWithIcon
              label={t('support.subject')}
              placeholder=''
              name='subject'
              onChange={handleChangeInput}
              value={inputValues.subject}
              extraClass='!pt-2 pb-4'
            />
            <SelectInput
              label={t('support.ticketPriority')}
              placeholder={t('support.priorityPlaceholder')}
              value={inputValues.priority}
              extraClass={'w-full'}
              containerClass='w-[99%]'
              data={prioritySelectionOptions}
              onValueChange={value => handleUpdateValue('priority', value)}
            />
            <div className='mt-4'>
              <SelectInput
                label={t('support.ticketRequestType')}
                placeholder={t('support.requestTypePlaceholder')}
                value={inputValues.requestType}
                extraClass={'w-full'}
                containerClass='w-[99%]'
                data={ticketTypeSelectionOptions}
                onValueChange={value => handleUpdateValue('requestType', value)}
              />
            </div>

            {selectedTicket?.id && isAdminOrInternalUser && (
              <div className='mt-4'>
                <SelectInput
                  label={t('support.ticketStatus')}
                  placeholder={t('support.statusPlaceholder')}
                  value={inputValues.status}
                  extraClass={'w-full'}
                  containerClass='w-[99%]'
                  data={ticketStatusSelectionOptions}
                  onValueChange={value => handleUpdateValue('status', value)}
                />
              </div>
            )}

            <div className='pt-5'>
              <p className='bold-text'>
                {t('support.ticketRelatedToConversation')}
              </p>
              <ToggleRadioSelection
                name='conversation-related'
                selectedOption={isRelatedToConversation}
                data={relatedToConversationSelectionOption}
                handleOptionChange={handleQuerySelection}
              />
            </div>

            <div>
                {isRelatedToConversation === 'yes' && (
                  <>
                    <InputWithIcon
                      label={`${t('support.chatUrl')} / ${t('support.testScenarioUrl')}`}
                      extraClass='!pt-2'
                      placeholder={t('support.chatUrlPlaceholder')}
                      name='chatLink'
                      onChange={handleChangeInput}
                      value={inputValues.chatLink}
                    />
                    {!isValidChatURL && inputValues.chatLink !== '' && (
                      <p className='text-red-500 text-sm mt-1 ml-2'>
                        {`${t('support.validation.invalidChatURL')} "${window.location.origin}..."`}
                      </p>
                    )}
                  </>
                )}
              {isRelatedToConversation !== '' && (
                <>
                  <MessageInput
                    onChange={value => handleUpdateValue('message', value)}
                    label={t('support.ticketDetails')}
                    toolTipText={t('support.enterHTMLCodeForTemplate')}
                    rows={4}
                    value={inputValues.message}
                  />

                  <div className='pt-0'>
                    <p className='bold-text'>
                      {t('support.receiveEmailNotifications')}
                    </p>
                    <ToggleRadioSelection
                      name='email-enabled'
                      selectedOption={isEmailFieldEnabled}
                      data={enableSendingOfEmailOption}
                      handleOptionChange={handleEmailEnableSelection}
                    />
                  </div>

                  {isEmailFieldEnabled === 'yes' && (
                    <EmailInputBox
                      label={t('support.notificationEmails')}
                      containerClass='mt-2'
                      value={inputValues.notificationEmails}
                      onChange={tags =>
                        handleUpdateValue('notificationEmails', tags)
                      }
                      type='email'
                    />
                  )}
                </>
              )}
            </div>

            <div className='flex flex-1 items-end'>
              <Button
                disabled={!inputValues.subject || !isEmailFieldEnabled || (isRelatedToConversation === 'yes' && inputValues.chatLink !== '' && !isValidChatURL)}
                text={selectedTicket?.id ? t('button.update') : t('button.submit')}
                variant='contained'
                className='flex mx-auto mt-5'
                onClick={handleValidateResponse}
                loading={loading}
              />
            </div>
          </div>
          {!selectedTicket?.id && (
            <AttachFile
              fileInputRef={fileInputRef}
              files={uploadedFiles}
              handleFileUpload={handleFileUpload}
              removeFile={removeFile}
            />
          )}
        </>
      )}
      {showConfirmation === true && (
        <ConfirmationBody
          toggle={closeModal}
          title={t('support.deleteTicketConfirmation', {
            action: selectedTicket?.id ? t('button.update') : t('button.create'),
            subject: inputValues.subject
          })}
          confirm={handleSubmitTicket}
          buttonText={t('button.confirm')}
        />
      )}
    </Modal>
  )
}

export default CreateContactSupport
