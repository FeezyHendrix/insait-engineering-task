import { useEffect, useState } from 'react'

const translations: Record<string, string> = {
  en: 'Loading Page. Please Wait.',
  he: 'טוען עמוד. אנא המתן.',
}

const SuspenseLoading = () => {
  const [language, setLanguage] = useState('en')

  useEffect(() => {
    const htmlLang = document.documentElement.lang || 'en'
    setLanguage(htmlLang in translations ? htmlLang : 'en')
  }, [])

  return (
    <div className='flex-1 flex justify-center align-center'>
      <h4 className='text-2xl flex items-center justify-center'>
        {translations?.[language] || translations.en}
      </h4>
    </div>
  )
}

export default SuspenseLoading
