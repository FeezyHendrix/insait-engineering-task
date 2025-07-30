import { RootState } from '@/redux/store'
import { timeButtonSelectionType } from '@/types/chart'
import { dayHours } from '@/utils/data'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import SelectInput from '../SelectInput'
import { updateGlobalFilters } from '@/redux/slices/analytics'

const DateButton = ({ timeFrameOptions }: { timeFrameOptions: timeButtonSelectionType[] }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch();
  const timeframeValues: { [key: string]: number | null | '' } = {
    'today': 0,
    'lastWeek': 7,
    'lastMonth': 30,
    'lastYear': 365,
    'allTime': null,
    'custom': null,
  };
  const selectedTimeButton = useSelector((state: RootState) => state.analytics.globalFilters.button);
  const selectData = timeFrameOptions.map(item => ({ 
    label: t(`dashboard.${item}`), 
    value: item === 'custom' ? '' : item || '' 
  }))

  const updateTimeParam = (timeFrame: string) => {
    const startDate = new Date();
    const timeFrameValue =  timeFrame && timeframeValues[timeFrame];
    if (timeFrameValue === null || timeFrameValue === '') {
      dispatch(updateGlobalFilters({ startDate: null, endDate: null, button: timeFrameValue === null ? 'allTime' : null }));
      return;
    };
    const updatedStartDate: Date = new Date(startDate.setDate(startDate.getDate() - timeFrameValue));
    updatedStartDate.setHours(dayHours.start[0], dayHours.start[1], dayHours.start[2], dayHours.start[3]);
    const updatedEndDate: Date = new Date();
    updatedEndDate.setHours(dayHours.end[0], dayHours.end[1], dayHours.end[2], dayHours.end[3]);
    dispatch(updateGlobalFilters({ startDate: updatedStartDate.toISOString(), endDate: updatedEndDate.toISOString(), button: timeFrame as timeButtonSelectionType }));
  };
  
  return (
    <SelectInput 
      placeholder={""}
      value={selectedTimeButton || ""}
      data={selectData}
      onValueChange={(value) => {
        updateTimeParam(value)
      }}
      extraClass={'px-4 py-1.5 min-w-[150px]'}
      textClass={'text-sm'}
    />
  )
}

export default DateButton
