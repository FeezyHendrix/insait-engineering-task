import SelectInput from './SelectInput'
import { useAppDispatch, useAppSelector } from '@/hook/useReduxHooks'
import { dashboardSelector } from '@/redux/slices/analytics'
import { useCallback, useEffect } from 'react'
import { getDashboardStatRequest } from '@/redux/slices/analytics/request'
import { getErrorMessage } from '@/utils'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'


interface MonthSelectWithTitleType {
  title: string
  value: any
  onValueChange: (value: any) => any,
  includeLast7Days?: boolean
}

const MonthSelectWithTitle = ({
  title,
  value,
  onValueChange,
  includeLast7Days = false
}: MonthSelectWithTitleType) => {
  const { t } = useTranslation();

  const { data } = useAppSelector(dashboardSelector)
  const defaultLang = useAppSelector(state => state.companyConfig.language)
  const dispatch = useAppDispatch()
  useEffect(() => {
    getDashboardStats()
  }, [])

  const getDashboardStats = useCallback(() => {
    try {
      dispatch(getDashboardStatRequest())
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage || t('feedback.errorWrong'))
    }
  }, [])

  const today = new Date();
  const defaultValue = today.toLocaleString('default', { month: 'short', year: 'numeric' });

  const monthYears = [];
  let todayPointer = new Date(data?.earliestInteractionTimestamp);

  while (todayPointer <= today) {
    const label = `${todayPointer.toLocaleString(defaultLang, { month: 'short' })}-${todayPointer.getFullYear()}`;
    const month = todayPointer.getMonth();
    const year = todayPointer.getFullYear();
    const value = `${month}-${year}`

    monthYears.push({ label,value  });

    todayPointer.setMonth(todayPointer.getMonth() + 1);
    todayPointer.setDate(1)
  }

  if (includeLast7Days) {
    monthYears.push({ label: t('chart.last7Days'), value: 'last7Days' });
  }

  return (
    <div className='flex flex-row justify-between items-start py-4 px-2 pb-2 w-full '>
      <h4 className='text-md font-medium'>{title}</h4>
      <SelectInput
        data={monthYears}
        placeholder='Month-Year'
        value={value ? value : defaultValue}
        onValueChange={onValueChange}
      />
    </div>
  )
}

export default MonthSelectWithTitle
