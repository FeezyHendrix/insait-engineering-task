import React, { useEffect, ReactNode } from 'react'
import i18n from 'i18next'
import { initReactI18next, I18nextProvider } from 'react-i18next'
import enTranslations from '@locales/en.json'
import heTranslations from '@locales/he.json'
import { useAppSelector } from '@/hook/useReduxHooks'

interface I18nProviderProps {
  children: ReactNode
}

const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const defaultLang = useAppSelector(state => state.companyConfig.language)
  
  useEffect(() => {
    i18n.use(initReactI18next).init({
      resources: {
        en: { translation: enTranslations },
        he: { translation: heTranslations },
      },
      lng: defaultLang,
      fallbackLng: defaultLang,
      interpolation: {
        escapeValue: false,
      },
      nsSeparator: false,
      appendNamespaceToCIMode: false,
      appendNamespaceToMissingKey: false
    })
  }, [defaultLang])

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}

export default I18nProvider
