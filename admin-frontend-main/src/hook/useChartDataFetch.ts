import { useState, useEffect } from 'react';
import { useAppDispatch } from '@/hook/useReduxHooks';
import { getGenericDataRequest } from '@/redux/slices/analytics/request';
import { sliceDateDataUserReturn, toastError } from '@/utils';
import { unwrapResult } from '@reduxjs/toolkit';
import { getChartDataOrPlaceholder } from '@/config/chartOptions';
import { DataKeyType, PageType, PlaceholderDataType } from '@/types/chart';

const getPathKey = (type: DataKeyType): string => {
  switch (type) {
    case 'productPopularityData':
      return 'productPopularityMonth'
    case "errorAnalysisData":
      return 'errorAnalysisMonth'
    case "dropoffQuestionsData":
      return 'dropoffQuestionsMonth'
    case "userReturnData":
      return 'userReturnRateMonth'
    case "conversationDepthBarData":
      return 'conversationDepthMonth'
    case "earliestInteractionTimestamp":
      return 'earliestInteractionTimestamp'
    case "thumbsUpAndDownCountMonthly":
      return 'thumbsUpAndDownCountMonth'  
    case "securityModuleCost":
      return 'securityModuleCostMonth'    
    case "averageLengthOfUserAndBotMessages":
      return 'averageLengthOfUserAndBotMessagesMonth'   
    case "responseTimeFromAClient":
      return 'responseTimeFromAClient'    
    default:
      return ''
  }
}

const useChartDataFetch = (
  initialData: any,
  placeholder: PlaceholderDataType,
  page: PageType,
  type: DataKeyType) => {

  const dispatch = useAppDispatch();

  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const [selectedMonth, setSelectedMonth] = useState(`${currentMonth}-${currentYear}`);
  const [chartData, setChartData] = useState(initialData);

  const formatData = (value: any) => {
    let data = getChartDataOrPlaceholder(value, placeholder);
    if (type === "userReturnData" || placeholder === 'weekly' || placeholder === "multichart") {
      data = sliceDateDataUserReturn(data, selectedMonth);      
    } 

    setChartData(data);
  }

  const handleUpdateData = async () => {
    try {
      const path = page === 'analytics' ? 'advancedAnalytics' : page;
      const url = `analytics/${path}?${getPathKey(type)}=${selectedMonth}`;
      const payload = { url, type };
      const response = unwrapResult(await dispatch(getGenericDataRequest(payload)));
      formatData(response);
    } catch (error) {
      toastError(error);
    }
  };
 
  useEffect(() => {
    if (selectedMonth) {
      handleUpdateData();
    }
  }, [selectedMonth]);


  useEffect(() => {
    formatData(initialData);
  }, [initialData, placeholder]);

  return { selectedMonth, setSelectedMonth, chartData };
};

export default useChartDataFetch;