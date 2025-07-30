import { useEffect, useState } from 'react'
import { CiGlobe } from 'react-icons/ci'
import { IoBanOutline } from 'react-icons/io5'
import { FiSettings, FiInfo } from 'react-icons/fi'
import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '@/hook/useReduxHooks'
import { flattenNewlines, isValidUrl } from '@/utils/stringHelper'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { updateAgentConfiguration } from '@/redux/slices/settings/request'
import { R2RSearchModes, R2RSearchStrategy, UrlEntry } from '@/types/configurations'
import SaveButton from './components/SaveButton'
import UrlRow from './components/UrlRow'
import AddUrlButton from './components/AddUrlButton'
import { SwitchInput, TextareaWithExpand } from '../elements/Input'
import { Tooltip } from '@mui/material'
interface AgentSettingsProps {
  generateToast: (status: string) => void
  onUnsavedChange: (hasUnsaved: boolean) => void
  resetSignal: number
}

function AgentSettings({
  generateToast,
  onUnsavedChange,
  resetSignal,
}: AgentSettingsProps) {
  const [whitelist, setWhitelist] = useState<UrlEntry[]>([])
  const [blacklist, setBlacklist] = useState<UrlEntry[]>([])
  const [newWhitelistUrl, setNewWhitelistUrl] = useState<string>('')
  const [newBlacklistUrl, setNewBlacklistUrl] = useState<string>('')
  const [useNaiveHistory, setUseNaiveHistory] = useState<boolean>(false)
  const [useSecond, setUseSecond] = useState<boolean>(false)
  const [useParseQuestion, setUseParseQuestion] = useState<boolean>(false)
  const [firstPrompt, setFirstPrompt] = useState<string>('')
  const [secondPrompt, setSecondPrompt] = useState<string>('')
  const [numberOfChunks, setNumberOfChunks] = useState<number | null>(null)
  const [systemPrompt, setSystemPrompt] = useState<string>('')
  const [temperature, setTemperature] = useState<number | null>(null)
  const [topP, setTopP] = useState<number | null>(null)
  const [r2rModel, setR2RModel] = useState<string>('')
  const [useFulltextSearch, setUseFulltextSearch] = useState<boolean>(false)
  const [includeTitle, setIncludeTitle] = useState<boolean>(false)
  const [searchStrategy, setSearchStrategy] = useState<R2RSearchStrategy> ('vanilla')
  const [searchMode, setSearchMode] = useState<R2RSearchModes>('basic')
  const [unsavedFields, setUnsavedFields] = useState<Record<string, boolean>>({
    r2r: false,
  })

  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const agentSettings = useSelector(
    (state: RootState) => state.settings.editable.bot.api
  )

  const loadAgentSettings = (settings: typeof agentSettings) => {
    setWhitelist(settings.whitelisted_urls)
    setBlacklist(settings.blacklisted_urls)
    setFirstPrompt(settings.first_prompt || '')
    setSecondPrompt(settings.second_prompt || '')
    setUseParseQuestion(settings.use_parse_question ?? false)
    setUseNaiveHistory(settings.use_naive_history ?? false)
    setUseSecond(settings.use_second ?? false)
    setNumberOfChunks(settings.r2r_query_params?.number_of_chunks || null)
    setSystemPrompt(settings.r2r_wrapper_params?.system_prompt || '')
    setTemperature(settings.r2r_query_params?.temperature || null)
    setTopP(settings.r2r_query_params?.top_p || null)
    setR2RModel(settings.r2r_query_params?.model || '')
    setSearchStrategy(settings.r2r_query_params?.search_strategy || 'vanilla')
    setSearchMode(settings.r2r_query_params?.search_mode || 'basic')
    setIncludeTitle(settings.r2r_query_params?.include_title_if_available || false)
    setUseFulltextSearch(settings.r2r_query_params?.use_fulltext_search || false)
  }

  useEffect(() => {
    loadAgentSettings(agentSettings)
  }, [agentSettings])

  useEffect(() => {
    const any = Object.values(unsavedFields).some(Boolean)
    onUnsavedChange(any)
  }, [unsavedFields, onUnsavedChange])

  function handleChangeField<T>(
    setState: React.Dispatch<React.SetStateAction<T>>,
    value: T,
    field: string
  ) {
    setState(value)
    setUnsavedFields((prev) => ({ ...prev, [field]: true }))
  }

  const markFieldSaved = (field: string) => {
    setUnsavedFields((prev) => ({
      ...prev,
      [field]: false,
    }))
  }

  const resetR2Rfields = () => {
    loadAgentSettings(agentSettings)
    markFieldSaved('r2r')
  }

  useEffect(() => {
    resetR2Rfields()
    markFieldSaved('r2r')
  }, [resetSignal])

  const handleAddUrl = async (
    type: 'whitelist' | 'blacklist',
    urlList: UrlEntry[],
    setUrlList: (urls: UrlEntry[]) => void,
    newUrl: string,
    resetUrlInput: () => void
  ) => {
    const trimmedUrl = newUrl.trim()

    if (!isValidUrl(trimmedUrl)) {
      toast.error(t('feedback.invalidUrl'))
      return
    }

    if (urlList.some((entry) => entry.url === trimmedUrl)) {
      toast.info(t('feedback.urlAlreadyInList'))
      return
    }

    const originalList = [...urlList]
    const newEntry: UrlEntry = { url: trimmedUrl, variant: 'default' }
    const updatedList = [...originalList, newEntry]
    setUrlList(updatedList)
    resetUrlInput()

    const field = type === 'whitelist' ? 'whitelisted_urls' : 'blacklisted_urls'

    try {
      await dispatch(
        updateAgentConfiguration({
          editable: {
            bot: {
              api: {
                [field]: updatedList,
              },
            },
          },
        })
      ).unwrap()

      generateToast('success')
    } catch (error) {
      setUrlList(originalList)
      generateToast('failed')
    }
  }

  const handleAddWhitelist = async () => {
    handleAddUrl('whitelist', whitelist, setWhitelist, newWhitelistUrl, () =>
      setNewWhitelistUrl('')
    )
  }

  const handleAddBlacklist = async () => {
    handleAddUrl('blacklist', blacklist, setBlacklist, newBlacklistUrl, () =>
      setNewBlacklistUrl('')
    )
  }

  const handleRemoveUrl = async (
    type: 'whitelist' | 'blacklist',
    urlList: UrlEntry[],
    setUrlList: (urls: UrlEntry[]) => void,
    urlToRemove: string
  ) => {
    const originalList = [...urlList]
    const updatedList = originalList.filter((item) => item.url !== urlToRemove)
    setUrlList(updatedList)

    const field = type === 'whitelist' ? 'whitelisted_urls' : 'blacklisted_urls'

    try {
      await dispatch(
        updateAgentConfiguration({
          editable: {
            bot: {
              api: {
                [field]: updatedList,
              },
            },
          },
        })
      ).unwrap()
      generateToast('success')
    } catch (error) {
      setUrlList(originalList)
      generateToast('failed')
    }
  }

  const handleSavePromptAndR2RParams = async () => {
    try {
      await dispatch(
        updateAgentConfiguration({
          editable: {
            bot: {
              api: {
                first_prompt: flattenNewlines(firstPrompt),
                second_prompt: flattenNewlines(secondPrompt),
                use_second: useSecond,
                use_parse_question: useParseQuestion,
                use_naive_history: useNaiveHistory,
                r2r_wrapper_params: {
                  number_of_chunks: numberOfChunks,
                  system_prompt: flattenNewlines(systemPrompt),
                },
                r2r_query_params: {
                  temperature: temperature,
                  top_p: topP,
                  model: r2rModel,
                  use_fulltext_search: useFulltextSearch,
                  search_strategy: searchStrategy,
                  number_of_chunks: numberOfChunks,
                  search_mode: searchMode,
                  include_title_if_available: includeTitle 
                },
              },
            },
          },
        })
      ).unwrap()
      markFieldSaved('r2r')
      generateToast('success')
    } catch (error) {
      generateToast('failed')
    }
  }

  const isTempValid =
  temperature === null || (temperature >= 0 && temperature <= 1)

  const isTopPValid =
  topP === null || (topP >= 0 && topP <= 1)

  return (
    <div className='grid mt-5 max-h-[55vh] grid-cols-1 md:grid-cols-2 gap-6'>
      <div className='premium-card'>
        <div className='flex items-center gap-2 mb-4'>
          <CiGlobe className='h-5 w-5 text-primary' />
          <h2 className='text-lg font-medium'>
            {t('configurations.settings.whitelist')}
          </h2>
        </div>

        <div className='space-y-4'>
          <div className='flex gap-2'>
            <input
              type='text'
              placeholder='Enter URL to whitelist'
              className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'
              value={newWhitelistUrl}
              onChange={(e) => setNewWhitelistUrl(e.target.value)}
            />
            <AddUrlButton onAddToList={handleAddWhitelist} />
          </div>

          <div className='space-y-2 max-h-60 overflow-y-auto'>
            {whitelist.map((item, index) => (
              <UrlRow
                key={index}
                url={item.url}
                onRemove={() =>
                  handleRemoveUrl(
                    'whitelist',
                    whitelist,
                    setWhitelist,
                    item.url
                  )
                }
              />
            ))}
          </div>

          <p className='text-xs text-muted-foreground'>
            {t('configurations.settings.whitelistDesc')}
          </p>
        </div>
      </div>

      <div className='premium-card'>
        <div className='flex items-center gap-2 mb-4'>
          <IoBanOutline className='h-5 w-5 text-destructive' color='red' />
          <h2 className='text-lg font-medium'>
            {t('configurations.settings.blacklist')}
          </h2>
        </div>

        <div className='space-y-4'>
          <div className='flex gap-2'>
            <input
              type='text'
              className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'
              placeholder='Enter URL to blacklist'
              value={newBlacklistUrl}
              onChange={(e) => setNewBlacklistUrl(e.target.value)}
            />
            <AddUrlButton onAddToList={handleAddBlacklist} />
          </div>

          <div className='space-y-2 max-h-60 overflow-y-auto'>
            {blacklist.map((item, index) => (
              <UrlRow
                key={index}
                url={item.url}
                onRemove={() =>
                  handleRemoveUrl(
                    'blacklist',
                    blacklist,
                    setBlacklist,
                    item.url
                  )
                }
              />
            ))}
          </div>

          <p className='text-xs text-muted-foreground'>
            {t('configurations.settings.blacklistDesc')}
          </p>
        </div>
      </div>

      <div className='premium-card md:col-span-2 relative'>
        <div className='flex items-center gap-2 mb-4'>
          <FiSettings className='h-5 w-5 text-primary' />
          <h2 className='text-lg font-medium'>
            {t('configurations.settings.RAGSettings')}
          </h2>
        </div>

        <div className='space-y-4'>
            <TextareaWithExpand
              label={t('configurations.settings.firstPrompt')}
              placeholder={t('configurations.settings.firstPromptDesc')}
              name='how_to_ask'
              rows={6}
              dir='ltr'
              onChange={(e) =>
                handleChangeField(setFirstPrompt, e.target.value, 'r2r')
              }
              className={'!pt-2'}
              value={firstPrompt}
              modalSize='l'
            />
            <TextareaWithExpand
              label={t('configurations.settings.secondPrompt')}
              placeholder={t('configurations.settings.secondPromptDesc')}
              name='how_to_ask'
              rows={6}
              dir='ltr'
              onChange={(e) =>
                handleChangeField(setSecondPrompt, e.target.value, 'r2r')
              }
              className={'!pt-2'}
              value={secondPrompt}
              modalSize='l'
            />
            <TextareaWithExpand
              label={t('configurations.settings.systemPrompt')}
              placeholder={t('configurations.settings.systemPromptDesc')}
              name='how_to_ask'
              rows={6}
              dir='ltr'
              onChange={(e) =>
                handleChangeField(setSystemPrompt, e.target.value, 'r2r')
              }
              className={'!pt-2'}
              value={systemPrompt}
              modalSize='l'
            />

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className="space-y-2 w-[80%]">
              <h3 className="flex items-center text-base font-medium">
                {t('configurations.settings.tempLabel')}
                <Tooltip title={t('configurations.settings.tempDesc')} arrow>
                  <span className="ml-1">
                    <FiInfo />
                  </span>
                </Tooltip>
              </h3>

            <input
              type="number"
              min={0}
              max={1}
              step={0.01}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={temperature ?? ''}
              onChange={e => {
                const raw = e.target.value
                if (raw === '') {
                  setTemperature(null)
                } else {
                  handleChangeField<number | null>(
                    setTemperature,
                    Number(raw),
                    'r2r'
                  )
                }
              }}
            />

            {!isTempValid && (
              <p className="mt-1 text-xs text-red-600">
                {t('configurations.settings.tempError')}
              </p>
            )}
            </div>

            <div className="space-y-2 w-[80%]">
              <h3 className="flex items-center text-base font-medium">
                {t('configurations.settings.topPLabel')}
                <Tooltip title={t('configurations.settings.topPDesc')} arrow>
                  <span className="ml-1">
                    <FiInfo />
                  </span>
                </Tooltip>
              </h3>

            <input
              type="number"
              min={0}
              max={1}
              step={0.01}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={topP ?? ''}
              onChange={e => {
                const raw = e.target.value
                if (raw === '') {
                  setTopP(null)
                } else {
                  handleChangeField<number | null>(
                    setTopP,
                    Number(raw),
                    'r2r'
                  )
                }
              }}
            />

            {!isTopPValid && (
              <p className="mt-1 text-xs text-red-600">
                {t('configurations.settings.topPError')}
              </p>
            )}
            </div>

            <div className='space-y-2 w-[80%]'>
            <h3 className="flex items-center text-base font-medium">
                {t('configurations.settings.numOfChunksLabel')}
                <Tooltip title={t('configurations.settings.numOfChunksDesc')} arrow>
                  <span className="ml-1">
                    <FiInfo />
                  </span>
                </Tooltip>
              </h3>
              <input
                type='number'
                min={1}
                className='w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                value={numberOfChunks ?? ''}
                onChange={(e) =>
                  handleChangeField<number | null>(
                    setNumberOfChunks,
                    Number(e.target.value),
                    'r2r'
                  )
                }
                placeholder={t('configurations.settings.numOfChunksPlaceholder')}
              />
            </div>
            <div className='space-y-2 w-[80%]'>
            <h3 className="flex items-center text-base font-medium">
                {t('configurations.settings.modelLabel')}
                <Tooltip title={t('configurations.settings.modelDesc')} arrow>
                  <span className="ml-1">
                    <FiInfo />
                  </span>
                </Tooltip>
              </h3>
              <input
                type="text"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={r2rModel ?? ''}
                onChange={(e) => handleChangeField(setR2RModel, e.target.value, 'r2r')}
                />
            </div>
            <div className='space-y-2 w-[80%]'>
              <h3 className="flex items-center text-base font-medium">
                {t('configurations.settings.searchStrategyLabel')}
              <Tooltip title={t('configurations.settings.searchStrategyDesc')} arrow>
                  <span className="ml-1">
                    <FiInfo />
                  </span>
                </Tooltip>
              </h3>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={searchStrategy}
                onChange={(e) =>
                  handleChangeField(
                    setSearchStrategy,
                    e.target.value as R2RSearchStrategy,
                    'r2r'
                  )
                }
              >
                <option value="vanilla">Vanilla</option>
                <option value="query_fusion">Query Fusion</option>
                <option value="hyde">Hyde</option>
              </select>
            </div>

            <div className='space-y-2 w-[80%]'>
              <h3 className="flex items-center text-base font-medium">
                {t('configurations.settings.searchModeLabel')}
              <Tooltip title={t('configurations.settings.searchModeDesc')} arrow>
                  <span className="ml-1">
                    <FiInfo />
                  </span>
                </Tooltip>
              </h3>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={searchMode}
                onChange={(e) =>
                  handleChangeField(
                    setSearchMode,
                    e.target.value as R2RSearchModes,
                    'r2r'
                  )
                }              >
                <option value="custom">Custom</option>
                <option value="basic">Basic</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-base font-medium'>
                  {t('configurations.settings.useNaiveHistoryLabel')}
                </h3>
                <p className='text-sm text-muted-foreground'>
                  {t('configurations.settings.useNaiveHistoryDesc')}
                </p>
              </div>
              <SwitchInput
                onChange={(e) =>
                  handleChangeField(setUseNaiveHistory, e.target.checked, 'r2r')
                }
                checked={useNaiveHistory}
                name='useNaiveHistory'
                showEnableDisableText={false}
              />
            </div>

            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-base font-medium'>
                  {t('configurations.settings.useSecondLabel')}
                </h3>
                <p className='text-sm text-muted-foreground'>
                  {t('configurations.settings.useSecondDesc')}
                </p>
              </div>
              <SwitchInput
                onChange={(e) =>
                  handleChangeField(setUseSecond, e.target.checked, 'r2r')
                }
                checked={useSecond}
                name='useSecond'
                showEnableDisableText={false}
              />
            </div>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-base font-medium'>
                  {t('configurations.settings.useParseQuestionLabel')}
                </h3>
                <p className='text-sm text-muted-foreground'>
                  {t('configurations.settings.useParseQuestionDesc')}
                </p>
              </div>
              <SwitchInput
                onChange={(e) =>
                  handleChangeField(
                    setUseParseQuestion,
                    e.target.checked,
                    'r2r'
                  )
                }
                checked={useParseQuestion}
                name='useParseQuestion'
                showEnableDisableText={false}
              />
            </div>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-base font-medium'>
                  {t('configurations.settings.useFullTextSearchLabel')}
                </h3>
                <p className='text-sm text-muted-foreground'>
                  {t('configurations.settings.useFullTextSearchDesc')}
                </p>
              </div>
              <SwitchInput
                onChange={(e) =>
                  handleChangeField(
                    setUseFulltextSearch,
                    e.target.checked,
                    'r2r'
                  )
                }
                checked={useFulltextSearch}
                name='useFulltextSearch'
                showEnableDisableText={false}
              />
            </div>

            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-base font-medium'>
                  {t('configurations.settings.includeTitleIfAvailableLabel')}
                </h3>
                <p className='text-sm text-muted-foreground'>
                  {t('configurations.settings.includeTitleIfAvailableDesc')}
                </p>
              </div>
              <SwitchInput
                onChange={(e) =>
                  handleChangeField(
                    setIncludeTitle,
                    e.target.checked,
                    'r2r'
                  )
                }
                checked={includeTitle}
                name='includeTitle'
                showEnableDisableText={false}
              />
            </div>
          </div>

          <SaveButton
            onClick={handleSavePromptAndR2RParams}
            hasUnsavedChanges={unsavedFields.r2r}
            disabled={!unsavedFields.r2r || !isTempValid || !isTopPValid}
          />
        </div>
      </div>
    </div>
  )
}

export default AgentSettings