import { useAppDispatch } from "@/hook/useReduxHooks";
import { getChartDataWithDates } from "@/redux/slices/analytics/request";
import { RootState } from "@/redux/store";
import { isPrimitiveValue } from "@/utils";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import StatusCard from '../elements/StatusCard'
import { FiBarChart2, FiCheckCircle, FiClock, FiMessageSquare } from 'react-icons/fi';


const MainContainerChart = ({ chartName, chartText }: { chartName: string, chartText: string }) => {
    const [data, setData] = useState<string | number | null>(null);
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const globalDate = useSelector((state: RootState) => state.analytics.globalFilters);
    const selectedFlow = useSelector((state: RootState) => state.analytics.globalFilters.flowId);

    const fetchChartData = async () => {
        try {
        const response = await dispatch(getChartDataWithDates({chartType: chartName, startDate: globalDate.startDate, endDate: globalDate.endDate, flowId: selectedFlow }));
        const value = isPrimitiveValue(response.payload) ? response.payload : 0;
        setData(value);
        } catch (error: any) {
        toast.error(error?.message || 'Something went wrong')
        };
    };

    useEffect(() => {
        fetchChartData();
    }, [globalDate]);

  
  const getCardIcon = () => {
    switch (chartText) {
      case 'dashboard.totalMessageCount':
        return FiMessageSquare
      case 'dashboard.totalConversations':
        return FiBarChart2
      case 'value':
        return FiCheckCircle
      case 'dashboard.avgBotResponseTime':
        return FiClock
      default:
        return FiMessageSquare
    }
  }
  return (
    <StatusCard
      title={t(chartText)}
      value={data ?? t('feedback.loading')}
      icon={getCardIcon()}
    />
  )
}

export default MainContainerChart