import ABConversions from '@/components/dashboard/ABConversions'
import CompletionRate from '@/components/dashboard/CompletionRate'
import Measurements from '@/components/dashboard/Measurements'
import ThumbsUpAndDownCount from '@/components/dashboard/MessageReactionsChart'
import SecurityModuleCost from '@components/dashboard/SecurityModuleCost'
import AverageLengthOfUserAndBotMessages from "@components/dashboard/AverageLengthOfUserAndBotMessages"
import PolicyCounterWeekly from '@components/dashboard/PolicyCounterWeekly'
import { useAppDispatch, useAppSelector } from '@/hook/useReduxHooks'
import { dashboardSelector } from '@/redux/slices/analytics'
import { getAdminStatRequest } from '@/redux/slices/analytics/request'
import { useCallback, useEffect } from 'react'
import { toast } from 'react-toastify'
import { getErrorMessage } from '@/utils'
import { useTranslation } from 'react-i18next'

const Admin= () => {
  const { t } = useTranslation();
  const { data } = useAppSelector(dashboardSelector)
  const dispatch = useAppDispatch()

  useEffect(() => {
    getDashboardStats()
  }, [])
  
  const getDashboardStats = useCallback(() => {
    try {
      dispatch(getAdminStatRequest())
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage || t('feedback.errorWrong'))
    }
  }, [])

  return (
    <section style={{display: "flex"}} className='flex-1 flex-row flex-wrap'>
      <>
          <div className='flex w-1/2 mb-5 pr-3'>
            <ABConversions chartData={data?.ABConversionData} />
          </div>
      </>
      <>
          <div className='flex w-1/2 mb-5 pe-3'>
            <Measurements
              interactionDuration={data?.interactionDuration}
              userQueries={data?.userQueries}
            />
          </div>
      </>
      <>
        <div className='flex w-1/2 mb-5 pe-3'>
          <CompletionRate chartData={data?.completionRateData} />
        </div>
      </>

      <>
          <div className='flex w-1/2 mb-5 pe-3'>
            <SecurityModuleCost chartData={data?.securityModuleCost} />
          </div>
      </>

      <>
          <div className='flex w-1/2 mb-5 pe-3'>
            <AverageLengthOfUserAndBotMessages chartData={data?.averageLengthOfUserAndBotMessages} />
          </div>
      </>

      <>
          <div className='flex w-1/2 mb-5 pe-3'>
            <PolicyCounterWeekly/>
          </div> 

      </>


    </section>
  )
}

export default Admin

