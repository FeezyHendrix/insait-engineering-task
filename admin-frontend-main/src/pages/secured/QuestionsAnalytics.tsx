import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/elements/radix/tab'
import UnansweredQuestions from './UnansweredQuestions'
import PopularQuestions from './PopularQuestions'
import ClusterDetails from './ClusterDetails'

const QuestionsAnalytics = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  // Determine active tab based on current path
  const getActiveTab = () => {
    if (location.pathname.includes('/popular')) {
      return 'popular'
    }
    return 'unanswered'
  }

  // Handle tab change
  const handleTabChange = (value: string) => {
    if (value === 'popular') {
      navigate('/unanswered-questions/popular')
    } else {
      navigate('/unanswered-questions/unanswered')
    }
  }

  // Set initial route
  useEffect(() => {
    if (location.pathname === '/unanswered-questions') {
      navigate('/unanswered-questions/unanswered')
    }
  }, [navigate, location])

  return (
    <section className='flex flex-col h-full'>
      <Tabs value={getActiveTab()} className="w-full flex flex-col flex-1" onValueChange={handleTabChange}>
        <TabsList className="flex h-16 items-center justify-center rounded-xl bg-white p-2 mx-4 mb-2 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
          <TabsTrigger 
            value="unanswered" 
            className="flex-1 px-6 py-3 text-[18px] font-medium text-gray-500 rounded-lg transition-all relative
              data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-[0_3px_10px_rgba(0,0,0,0.1)] data-[state=active]:font-semibold data-[state=active]:scale-105
              hover:text-gray-900
              after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 after:transform after:scale-x-0 after:transition-transform
              data-[state=active]:after:scale-x-100"
          >
            {t('menu.unanswered-questions.unanswered')}
          </TabsTrigger>
          <TabsTrigger 
            value="popular"
            className="flex-1 px-6 py-3 text-[18px] font-medium text-gray-500 rounded-lg transition-all relative
              data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-[0_3px_10px_rgba(0,0,0,0.1)] data-[state=active]:font-semibold data-[state=active]:scale-105
              hover:text-gray-900
              after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 after:transform after:scale-x-0 after:transition-transform
              data-[state=active]:after:scale-x-100"
          >
            {t('menu.unanswered-questions.popular')}
          </TabsTrigger>
        </TabsList>
        <div className="flex-1 bg-white rounded-lg p-4 mx-4 mb-4 overflow-hidden">
          <Routes>
            <Route path="unanswered" element={<UnansweredQuestions />} />
            <Route path="popular" element={<PopularQuestions />} />
            <Route path="popular/:clusterId" element={<ClusterDetails />} />
          </Routes>
        </div>
      </Tabs>
    </section>
  )
}

export default QuestionsAnalytics 