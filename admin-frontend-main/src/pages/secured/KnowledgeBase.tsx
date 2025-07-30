import AddKnowledgeHub from '@/components/knowledge/AddKnowledgeHub'
import { useTranslation } from 'react-i18next'

const KnowledgeBase = () => {
  const { t } = useTranslation()

  return (
    <section className='flex-1 px-2 md:px-5 pt-4 pb-5 bg-white rounded-2xl flex flex-col overflow-y-auto max-h-[90vh] h-auto m-5 border'>
      <div className='flex items-center gap-2'>
        <h1 className='text-2xl bold-text mb-2'>
          {t('knowledge.knowledgeBase')}
        </h1>
      </div>
      <AddKnowledgeHub />
    </section>
  )
}

export default KnowledgeBase
