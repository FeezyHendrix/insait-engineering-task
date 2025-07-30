import { InputWithIcon, TextareaWithIcon } from '@/components/elements/Input'
import Modal from '@/components/elements/Modal'
import NativeSelectInput from '@/components/elements/NativeSelectInput'
import SelectInput from '@/components/elements/SelectInput'
import { useAppSelector } from '@/hook/useReduxHooks'
import { NewFlowType, SaveFlowModalProps } from '@/types/agent-builder'
import {
  countrySelectionOptions,
  dateFormatSelectionOptions,
  timeFormatSelectionOptions,
} from '@/utils/botBuilder'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const initialValue: NewFlowType = {
  name: '',
  properties: {
    company: '',
    country: '',
    first_message: '',
    how_to_react_to_not_knowing: '',
    system_prompt: '',
    bot_nickname: '',
    time_format: '',
    date_format: '',
    use_knowledge_base: false,
    guidelines: undefined,
  },
}

const SaveFlowModal = ({
  isOpen,
  onClose,
  onSave,
  action,
}: SaveFlowModalProps) => {
  const { t } = useTranslation()
  const [flow, setFlow] = useState<NewFlowType>(initialValue)
  const { currentFlowId, flows } = useAppSelector(state => state.builder)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const value = flow.name.trim()
    if (value) {
      onSave(flow, action)
    }
  }

  const handleChange = (key: keyof typeof flow, value: string) => {
    setFlow(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  const handlePropertiesChange = (
    key: keyof typeof flow.properties,
    value: string | boolean
  ) => {
    setFlow(prev => ({
      ...prev,
      properties: {
        ...prev.properties,
        [key]: value,
      },
    }))
  }

  const handleClose = () => {
    setFlow(initialValue)
    onClose()
  }

  useEffect(() => {
    if (action === 'edit' && currentFlowId) {
      const currentFlow = flows.filter(f => f.id === currentFlowId)[0]
      if (currentFlow && currentFlow.properties) {
        const { name, properties } = currentFlow
        setFlow({ name, properties })
      }
    } else {
      setFlow(initialValue)
    }
  }, [action, currentFlowId])

  return (
    <Modal
      isOpen={isOpen}
      toggle={onClose}
      additionalClass={
        action === 'duplicate'
          ? 'max-h-[250px] min-w-[450px] w-[450px]'
          : `p-6 !max-h-[85%] min-w-[70%] overflow-y-auto`
      }
    >
      <form className='flex flex-col h-full' onSubmit={handleSubmit}>
        <h2 className='text-xl font-semibold mb-4 uppercase'>{action} Flow</h2>
        <div className='flex-1 overflow-y-auto'>
          <div>
            <InputWithIcon
              label={action === 'duplicate' ? t('botBuilder.newFlowName') : t('botBuilder.flowName')}
              placeholder={t('botBuilder.flowName')}
              name='name'
              onChange={e => handleChange('name', e.target.value)}
              value={flow.name}
              extraClass='!pt-0 pb-4'
            />
            {action !== 'duplicate' && (
              <>
                <InputWithIcon
                  label={t('botBuilder.companyName')}
                  placeholder={t('botBuilder.companyNamePlaceholder')}
                  name='company'
                  onChange={e =>
                    handlePropertiesChange('company', e.target.value)
                  }
                  value={flow?.properties.company}
                  extraClass='!pt-0 pb-4'
                />
                <SelectInput
                  label={'Country'}
                  placeholder='Enter country'
                  value={flow.properties.country}
                  extraClass={'w-full'}
                  containerClass='w-[99%]'
                  data={countrySelectionOptions}
                  onValueChange={value =>
                    handlePropertiesChange('country', value)
                  }
                />

                <InputWithIcon
                   label={t('botBuilder.botNickname')}
                   placeholder={t('botBuilder.botNicknamePlaceholder')}
                  value={flow?.properties.bot_nickname}
                  name='bot_nickname'
                  onChange={e =>
                    handlePropertiesChange('bot_nickname', e.target.value)
                  }
                  extraClass='!pt-4'
                />

                <TextareaWithIcon
                  label={t('botBuilder.firstMessage')}
                  placeholder={t('botBuilder.firstMessagePlaceholder')}
                  name='first_message'
                  onChange={e =>
                    handlePropertiesChange('first_message', e.target.value)
                  }
                  value={flow.properties.first_message}
                />
                <TextareaWithIcon
                 label={t('botBuilder.howToReact')}
                 placeholder={t('botBuilder.howToReactPlaceholder')}
                  name='how_to_react_to_not_knowing'
                  onChange={e =>
                    handlePropertiesChange(
                      'how_to_react_to_not_knowing',
                      e.target.value
                    )
                  }
                  value={flow.properties.how_to_react_to_not_knowing}
                />

                <TextareaWithIcon
                  label={t('botBuilder.systemPrompt')}
                  placeholder={t('botBuilder.systemPromptPlaceholder')}
                  name='system_prompt'
                  onChange={e =>
                    handlePropertiesChange('system_prompt', e.target.value)
                  }
                  value={flow.properties.system_prompt}
                />

                <NativeSelectInput
                  label={t('botBuilder.timeFormat')}
                  value={flow.properties.time_format}
                  containerClass='py-4'
                  data={timeFormatSelectionOptions}
                  onValueChange={value =>
                    handlePropertiesChange('time_format', value)
                  }
                />

                <NativeSelectInput
                  label={t('botBuilder.dateFormat')}
                  value={flow.properties.date_format}
                  data={dateFormatSelectionOptions}
                  onValueChange={value =>
                    handlePropertiesChange('date_format', value)
                  }
                />

                <div className='py-2 flex justify-start gap-3 pt-5'>
                  <p className='flex items-center'>{t('botBuilder.useKnowledgeBase')}</p>
                  <button
                    type='button'
                    onClick={e => {
                      e.preventDefault()
                      handlePropertiesChange(
                        'use_knowledge_base',
                        !flow.properties.use_knowledge_base
                      )
                    }}
                    className={`float-right cursor-pointer border-none rounded-md px-2.5 py-1 text-white ${
                      flow.properties.use_knowledge_base
                        ? 'bg-blue-500'
                        : 'bg-gray-300'
                    }`}
                  >
                    {flow.properties.use_knowledge_base ? 'On' : 'Off'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        <div className='flex justify-end gap-2 pt-10 pb-3'>
          <button
            type='button'
            onClick={handleClose}
            className='px-4 py-2 border rounded hover:bg-gray-100'
          >
            {t('button.cancel')}
          </button>
          <button
            type='submit'
            disabled={!flow.name.trim()}
            className='px-4 py-2 disabled:bg-blue-400 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {action === 'duplicate'
              ? t('button.duplicate')
              : action === 'edit'
              ? t('button.update')
              : t('button.save')}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default SaveFlowModal
