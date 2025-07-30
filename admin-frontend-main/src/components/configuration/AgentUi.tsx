import { useSelector } from 'react-redux'
import { MdOutlinePalette } from "react-icons/md";
import { BsBrush } from 'react-icons/bs';
import { FaRegMessage } from "react-icons/fa6";
import { IoPlayCircleOutline } from "react-icons/io5";
import { LuLetterText } from "react-icons/lu";
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Input } from '@mui/material';
import { RootState } from '@/redux/store';
import { useAppDispatch } from '@/hook/useReduxHooks';

import { updateAgentConfiguration, uploadAgentAvatar } from '@/redux/slices/settings/request';
import { SwitchInput, TextareaWithExpand } from '@/components/elements/Input'
import { toast } from 'react-toastify';
import SaveButton from './components/SaveButton';
import { AdminLanguage, BotLanguage, SkinNames } from '@/types/configurations';
import AvatarUploader from './components/AvatarUploader';
import AbTestingSlider from './components/ABTestingSlider';

interface AgentUiProps {
  generateToast: (status: string) => void
  onUnsavedChange: (hasUnsaved: boolean) => void
  resetSignal: number
}

const AgentUi = ({  
  generateToast,
  onUnsavedChange,
  resetSignal} : AgentUiProps) => {
  const [agentLogoUrl, setAgentLogoUrl] = useState<string | null>('')
  const [agentName, setAgentName] = useState<string | null>('')
  const [disclaimerText, setDisclaimerText] = useState<string | null>('')
  const [disclaimerEnabled, setDisclaimerEnabled] = useState<boolean>(false)
  const [color1, setColor1] = useState<string | null>('')
  const [color2, setColor2] = useState<string | null>('');
  const [skinName, setSkinName] = useState<SkinNames>('default');
  
  const [initialMessage, setInitialMessage] = useState<string | null>('')
  const [pageTitle, setPageTitle] = useState<string | null>('');
  const [buttonText, setButtonText] = useState<string | null>('');
  const [botLanguage, setBotLanguage] = useState<BotLanguage>('english')
  const [isAutoOpen, setIsAutoOpen] = useState<boolean>(true)
  const [streamingEnabled, setStreamingEnabled] = useState<boolean>(true)
  const [previewEnabled, setPreviewEnabled] = useState<boolean>(false)
  const [adminLanguage, setAdminLanguage] = useState<AdminLanguage>('en')
  const [abTestPercentage, setAbTestPercentage] = useState<number>(0);
  const [unsavedFields, setUnsavedFields] = useState<Record<string, boolean>>({
    visuals: false,
    texts: false,
    additional: false
  });

  const dispatch = useAppDispatch()
  const botConfig = useSelector(
    (state: RootState) => state.settings.editable.bot
  )  
  const adminConfig = useSelector(
    (state: RootState) => state.settings.editable.admin
  )  
  const { t } = useTranslation()

  useEffect(() => {
    setAgentName(botConfig.ui.bot_name || '')
    setAgentLogoUrl(botConfig.ui.bot_image || '')
    setDisclaimerText(botConfig.ui.disclaimer_text || '')
    setDisclaimerEnabled(botConfig.ui.disclaimer_enabled ?? false)
    setColor1(botConfig.ui.color1 || '')
    setColor2(botConfig.ui.color2 || '');
    setInitialMessage(botConfig.api.first_message || '') 
    setSkinName(botConfig.ui.skin_name || 'default');
    setPageTitle(botConfig.ui.page_title || '');
    setButtonText(botConfig.ui.button_text || '');
    setBotLanguage(botConfig.ui.language || 'english');
    setIsAutoOpen(botConfig.ui.default_open_enabled ?? true);
    setStreamingEnabled(botConfig.ui.streaming_enabled ?? false)
    setPreviewEnabled(botConfig.ui.preview_enabled)
    setAdminLanguage(adminConfig.ui.language || 'en');
    setAbTestPercentage(botConfig.ui.ab_test_percentage ?? 0);
  }, [botConfig, adminConfig])

  useEffect(() => {
    const any = Object.values(unsavedFields).some(Boolean)
    onUnsavedChange(any)
  }, [unsavedFields, onUnsavedChange])

  function handleChangeField<T>(
    setState: React.Dispatch<React.SetStateAction<T>>,
    value: T,
    field: string
  ) {
    setState(value);
    setUnsavedFields((prev) => ({ ...prev, [field]: true }));
  }

  const markFieldSaved = (field : string) => {
    setUnsavedFields(prev => ({
      ...prev,
      [field]: false
    }));
  };

  const resetVisuals = () => {
    setAgentName(botConfig.ui.bot_name);
    setAgentLogoUrl(botConfig.ui.bot_image);
    setColor1(botConfig.ui.color1);
    setColor2(botConfig.ui.color2)
    setSkinName(botConfig.ui.skin_name || 'default')
    setDisclaimerEnabled(botConfig.ui.disclaimer_enabled ?? false)
    setDisclaimerText(botConfig.ui.disclaimer_text || '')
    setPreviewEnabled(botConfig.ui.preview_enabled ?? false)
    markFieldSaved('visuals')
  };
  
  const resetTexts = () => {
    setPageTitle(botConfig.ui.page_title)
    setInitialMessage(botConfig.api.first_message)
    setBotLanguage(botConfig.ui.language || 'english')
    setButtonText(botConfig.ui.button_text)
    markFieldSaved('texts')
  };

  const resetAdditionalFeatures = () => {
    setIsAutoOpen(botConfig.ui.default_open_enabled)
    setStreamingEnabled(botConfig.ui.streaming_enabled)
    setAdminLanguage(adminConfig.ui.language || 'en')
    setAbTestPercentage(botConfig.ui.ab_test_percentage || 0)
    markFieldSaved('additional')
  };

  useEffect(() => {
    resetVisuals()
    resetTexts()
    resetAdditionalFeatures()
    setUnsavedFields({ visuals: false, texts: false, additional: false })
  }, [resetSignal])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const res = await uploadAgentAvatar(formData);
      const uploadedUrl = res.url;
  
      handleChangeField(setAgentLogoUrl, uploadedUrl, 'visuals')
      toast.success(t('feedback.avatarUploadSuccess'));
    } catch (err) {
      toast.error(t('feedback.avatarUploadFailed'));
    }
  };

  const updateAdditionalSettings = async () => {
    const data = {
      editable: {
        bot: {
          ui: {
            default_open_enabled: isAutoOpen,
            streaming_enabled: streamingEnabled,
            ab_test_percentage: abTestPercentage,
            disclaimer_text: disclaimerText,
            disclaimer_enabled: disclaimerEnabled,
            preview_enabled: previewEnabled
          },
          api: {
            streaming_enabled: streamingEnabled
          }
        },
        admin: {
          ui: {
            language: adminLanguage
          }
        }
      }
    };
  
    try {
      await dispatch(updateAgentConfiguration(data)).unwrap();
      markFieldSaved('additional');
      generateToast('success');
    } catch (err) {
      generateToast('failed');
      resetAdditionalFeatures();
    }
  };

  const updateVisuals = async () => {
    const data = {
      editable: {
        bot: {
          ui: {
            bot_name: agentName,
            bot_image: agentLogoUrl,
            color1: color1,
            color2: color2,
            skin_name: skinName
          }
        }
      }
    }
    try {
      await dispatch(updateAgentConfiguration(data)).unwrap();
      markFieldSaved('visuals')
      generateToast('success')
    } catch (err) {
      generateToast('failed')
      resetVisuals()
    }
  }

  const updateInteractionSettings = async () => {
    try {
      await dispatch(updateAgentConfiguration({
        editable: {
          bot: {
            ui: {
              page_title: pageTitle,
              button_text: buttonText,
              language: botLanguage
            },
            api: {
              first_message: initialMessage,
            }
          }
        }
      })).unwrap()
      markFieldSaved('texts')
      generateToast('success')
    } catch (err) {
      generateToast('failed')
      resetTexts()
    }
  }

  return (
    <div className="grid mt-5 max-h-[55vh] grid-cols-1 md:grid-cols-2 gap-6">
      <div className="premium-card relative">
        <div className="flex items-center gap-2 mb-4">
          <BsBrush className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">
          {t('configurations.ui.designSection')}
          </h2>
        </div>
        <AvatarUploader 
          url={agentLogoUrl} 
          imageUnsaved={agentLogoUrl !== botConfig.ui.bot_image && unsavedFields.visuals}
          handleFileUpload={handleFileUpload}
        />
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-5 mb-2">
              <div className='flex items-center gap-2'>
              <LuLetterText className="h-5 w-5 text-primary" />
              <h1 className="text-base font-medium">
                {t('configurations.ui.agentName')}
              </h1>
              </div>
              <Input
                type="text" 
                value={agentName} 
                onChange={(e) => handleChangeField<string | null>(setAgentName, e.target.value, 'visuals')}
                className="w-25 h-10 p-1"
              />
            </div>
          </div>
        </div>
        <div className="mt-7 space-y-4">
          <div className="flex justify-between gap-10">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <MdOutlinePalette className="h-5 w-5 text-primary" />
                  <h1 className="text-base font-medium">
                    {t('configurations.ui.chatColor1')}
                  </h1>
                </div>
                <div className="flex items-center gap-6">
                  <Input
                    type="color"
                    value={color1}
                    onChange={(e) => handleChangeField<string | null>(setColor1, e.target.value, 'visuals')}
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={color1}
                    onChange={(e) => handleChangeField<string | null>(setColor1, e.target.value, 'visuals')}
                    className="w-20 h-10 p-1"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <MdOutlinePalette className="h-5 w-5 text-primary" />
                  <h1 className="text-base font-medium">
                    {t('configurations.ui.chatColor2')}
                  </h1>
                </div>
                <div className="flex items-center gap-6">
                  <Input
                    type="color"
                    value={color2}
                    onChange={(e) => handleChangeField<string | null>(setColor2, e.target.value, 'visuals')}
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={color2}
                    onChange={(e) => handleChangeField<string | null>(setColor2, e.target.value, 'visuals')}
                    className="w-20 h-10 p-1"
                  />
                </div>
              </div>
            </div>

            <div className="w-48 self-start">
              <label className="text-sm font-medium">{t('configurations.ui.skinLabel')}</label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={skinName}
                onChange={(e) => handleChangeField(setSkinName, e.target.value as SkinNames, 'visuals')}
              >
                <option value="skin">Default</option>
                <option value="default2">Default 2</option>
                <option value="alternate">Alternate</option>
                <option value="minimalist">Minimalist</option>
              </select>
            </div>
          </div>

          <div>
            <SaveButton
              onClick={updateVisuals}
              hasUnsavedChanges={unsavedFields.visuals}
              disabled={!unsavedFields.visuals}
            />
          </div>
        </div>
      </div>
      <div className="premium-card relative">
        <div className="flex items-center gap-2 mb-4">
          <FaRegMessage className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-medium">{t('configurations.ui.interactionSettings')}</h2>
        </div>
        
        <div className="space-y-4">
          <div className="mb-4">
            <label className="text-sm font-medium">{t('configurations.ui.pageTitleLabel')}</label>
            <input
              type="text"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={pageTitle ?? ''} 
              onChange={(e) => handleChangeField<string | null>(setPageTitle, e.target.value, 'texts')}
            />
          </div>

          <div>
            <label htmlFor="initial-message" className="text-sm font-medium">
              {t('configurations.ui.welcomeMessage')}
            </label>
            <textarea
              id="initial-message" 
              className='
                "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
              placeholder={t('configurations.ui.welcomeMessagePlaceholder')}
              rows={6}
              value={initialMessage ?? ''}
              onChange={(e) => handleChangeField<string | null>(setInitialMessage, e.target.value, 'texts')} 
              />
            <p className="text-xs text-muted-foreground mt-2">
              {t('configurations.ui.welcomeMessageDesc')}
            </p>
          </div>

          <div className='flex justify-between gap-10'>
            <div>
              <label className="text-sm font-medium">{t('configurations.ui.buttonTextLabel')}</label>
              <input
                type="text"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={buttonText ?? ''}
                onChange={(e) => handleChangeField<string | null>(setButtonText, e.target.value, 'texts')}
                />
            </div>
            <div>
              <label className="text-sm font-medium">{t('configurations.ui.agentLanguageLabel')}</label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={botLanguage}
                onChange={(e) => handleChangeField<BotLanguage>(setBotLanguage, e.target.value as BotLanguage, 'texts')}
                >
                <option value="english">English</option>
                <option value="hebrew">Hebrew</option>
              </select>
            </div>
          </div>

          <SaveButton 
              onClick={updateInteractionSettings} 
              hasUnsavedChanges={unsavedFields.texts}
              disabled={!unsavedFields.texts}
            />
        </div>
      </div>

      <div className="premium-card relative col-span-full w-full">
        <div className="flex items-center gap-2 mb-4">
            <IoPlayCircleOutline className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-medium">{t('configurations.ui.additionalSettings')}</h2>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-10">
            <div className="flex flex-col gap-6 w-full md:w-1/2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium">{t('configurations.ui.autoOpen')}</h3>
                  <p className="text-sm text-muted-foreground">{t('configurations.ui.autoOpenDesc')}</p>
                </div>
                <SwitchInput
                  onChange={(e) => handleChangeField(setIsAutoOpen, e.target.checked, 'additional')}
                  showEnableDisableText={false}
                  checked={isAutoOpen}
                  name='autoOpen'
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium">{t('configurations.ui.streamingLabel')}</h3>
                  <p className="text-sm text-muted-foreground">{t('configurations.ui.streamingDesc')}</p>
                </div>
                <SwitchInput
                  onChange={(e) => handleChangeField(setStreamingEnabled, e.target.checked, 'additional')}
                  showEnableDisableText={false}
                  checked={streamingEnabled}
                  name="streamingEnabled"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium">{t('configurations.ui.previewEnabled')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('configurations.ui.previewEnabledDesc')}
                  </p>
                </div>
                <SwitchInput
                  onChange={e =>
                    handleChangeField(setPreviewEnabled, e.target.checked, 'additional')
                  }
                  showEnableDisableText={false}
                  checked={previewEnabled}
                  name="previewEnabled"
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium">
                      {t('configurations.ui.disclaimerEnabled')}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t('configurations.ui.disclaimerEnabledDesc')}
                    </p>
                  </div>
                  <SwitchInput
                    onChange={e =>
                      handleChangeField(setDisclaimerEnabled, e.target.checked, 'additional')
                    }
                    showEnableDisableText={false}
                    checked={disclaimerEnabled}
                    name="disclaimerEnabled"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <TextareaWithExpand
                    label={''}
                    rows={2}
                    name="Disclaimer Text"
                    value={disclaimerText ?? ''}
                    placeholder={t('configurations.ui.disclaimerTextLabel')}
                    onChange={e =>
                      handleChangeField<string | null>(setDisclaimerText, e.target.value, 'additional')
                    }
                    className="w-full rounded-md bg-background text-sm"
                  />
                </div>
                {!disclaimerEnabled && (
                  <p className="text-xs text-warning-foreground">
                    {t('configurations.ui.disclaimerDisabledWarning')}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex flex-col gap-6 w-full md:w-1/2">
              <AbTestingSlider 
                value={abTestPercentage}
                onChange={(val) => handleChangeField(setAbTestPercentage, val, 'additional')}
              />
                            <div>
                <h3 className="text-base font-medium">{t('configurations.ui.adminLanguageLabel')}</h3>
                <select
                  className="w-6/12 rounded-md border border-input bg-background px-3 py-2 text-sm mb-2"
                  value={adminLanguage}
                  onChange={(e) => handleChangeField(setAdminLanguage, e.target.value as AdminLanguage, 'additional')}
                  >
                  <option value="en">English</option>
                  <option value="he">Hebrew</option>
                </select>
                <p className="text-sm text-muted-foreground">{t('configurations.ui.adminLanguageDesc')}</p>
              </div>
            </div>
          </div>

          <SaveButton
            onClick={updateAdditionalSettings}
            hasUnsavedChanges={unsavedFields.additional}
            disabled={!unsavedFields.additional}
          />
        </div>
      </div>
    </div>
  )
}

export default AgentUi