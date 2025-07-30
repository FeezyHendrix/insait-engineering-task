import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hook/useReduxHooks';
import { getChartDataWithMonth } from '@/redux/slices/analytics/request';
import { sliceDateDataUserReturn, toastError } from '@/utils';
import { unwrapResult } from '@reduxjs/toolkit';
import { getChartDataOrPlaceholder } from '@/config/chartOptions';
import { DataKeyType, PageType, PlaceholderDataType } from '@/types/chart';

const useChartsFetch = (
  initialData: any,
  placeholder: PlaceholderDataType,
  page: PageType,
  chartType: DataKeyType,
  ) => {

  const dispatch = useAppDispatch();

  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const [selectedMonth, setSelectedMonth] = useState(`${currentMonth}-${currentYear}`);
  const [chartData, setChartData] = useState(initialData);
  const { language } = useAppSelector((state) => state.companyConfig);

  const formatData = (value: any) => {
    let data = getChartDataOrPlaceholder(value, placeholder);
    if (chartType === "userReturnData" || placeholder === 'weekly' || placeholder === "multichart") {
      data = sliceDateDataUserReturn(data, selectedMonth);      
    } 

    setChartData(data);
  }

 
  const handleUpdateData = async () => {
    try {
      const month = selectedMonth;
      const payload = { month , chartType, language };
      const response = unwrapResult(await dispatch(getChartDataWithMonth(payload)));
      formatData(response);//
      setChartData(response)
    } catch (error) {
      toastError(error);
    }
  };

  useEffect(() => {
    if (selectedMonth) {
      handleUpdateData()
    }
  }, [selectedMonth]);

  useEffect(() => {
    formatData(initialData);
  }, [initialData])

  return { selectedMonth, setSelectedMonth, chartData };
};

export default useChartsFetch