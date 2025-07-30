import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import SourceList from '@/components/knowledge/sources/SourceList'
import AgentSettings from '@/components/configuration/AgentSettings'
import { useAppDispatch } from '@/hook/useReduxHooks'
import { fetchAgentConfiguration } from '@/redux/slices/settings/request'
import AgentUi from '@/components/configuration/AgentUi'
import { ConfigurationsTab } from '@/types/configurations'
import ResetButton from '@/components/configuration/components/ResetButton'

const Configuration: React.FC = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation()
  const tabs : ConfigurationsTab[] = [
    {
      "id": 1,
      "label": `${t('configurations.tabs.appearance')}`,
      "value": "agentUi"
  },
  {
      "id": 2,
      "label": `${t('configurations.tabs.settings')}`,
      "value": "agentSettings"
  }
  ]

  const [selectedSource, setSelectedSource] = useState<ConfigurationsTab>(tabs[0])
  const [unsaved, setUnsaved] = useState(false)
  const [resetSignal, setResetSignal] = useState(0)
  
  useEffect(() => {
    getAgentConfiguration()
  }, [])

  const getAgentConfiguration = useCallback(() => {
    try {
     dispatch(fetchAgentConfiguration());
    } catch (error) {
      toast.error(t('feedback.errorWrong'))
    }
  }, [])

  const generateToast = (status : string) => {
    if (status === 'success') {
      return toast.success(t('feedback.configurationUpdatedSuccessfully'))
    } else if (status === 'failed') {
      return toast.error(t('feedback.configurationUpdateFailed'))
    } else return
  }

  const generateUI = (value: string) => {
    switch (value) {
      case 'agentUi':
        return <AgentUi generateToast={generateToast} onUnsavedChange={setUnsaved} resetSignal={resetSignal}/>
      case 'agentSettings':
        return <AgentSettings generateToast={generateToast} onUnsavedChange={setUnsaved} resetSignal={resetSignal}/>
      default:
        return null
    }
  }

  return (
    <section className='flex-1 px-2 md:px-5 pt-4 pb-5 bg-white rounded-2xl flex flex-col overflow-y-auto  h-auto m-5 border'>
    <div className="flex justify-between items-center mb-4 px-2">
      <h1 className="text-2xl font-bold">
        {t('menu.configuration')}
      </h1>
      <ResetButton
        onClick={() => setResetSignal(s => s + 1)}
        disabled={!unsaved}
      />
    </div>
      <SourceList 
        data={tabs}
        handleSelectSource={value => setSelectedSource(value as ConfigurationsTab)}
        selectedSource={selectedSource}
      />
      <section className='h-full border-t-2 overflow-y-auto'>
        {generateUI(selectedSource.value)}
      </section>
    </section>
  )
}

export default Configuration
