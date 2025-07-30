import {
    axisTick,
    barchartMargin,
    conversationalsStatisticsheatMapRangeColors,
  } from '@/config/chartOptions'
  import { APP_WHITE } from '@/config/colors'
  import { createGradient } from '@/config/gradients'
  import {
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ComposedChart,
    Rectangle,
  } from 'recharts'
  import ChartLoader from '../layout/ChartLoader'
  import { useAppDispatch } from '@/hook/useReduxHooks'
  import { toast } from 'react-toastify'
  import { useEffect, useState } from 'react'
  import { getAllProducts, getChartDataWithDates } from '@/redux/slices/analytics/request'
  import { getErrorMessage } from '@/utils'
  import { useTranslation } from 'react-i18next'
  import { useSelector } from 'react-redux'
  import { RootState } from '@/redux/store'
import { CustomToolTipType, NodeData } from '@/types/chart'
import { t } from 'i18next'
import { useIsInternalOrAdminUser } from '@/hook/useShowRegularInternalPage'
import SelectInput from '../elements/SelectInput'
import ChatTableModal from '../analytics/mini-elements/ChatTableModal'
import useModal from '@/hook/useModal'
import useFavoriteCharts from '@/hook/useFavoriteCharts'
import ChartFavoriteStar from '../elements/ChartFavoriteStar'
  

  const NodeTooltip = ({
    payload,
  }: CustomToolTipType) => {
    const data = payload?.[0]?.payload
    return (
      data ? (
      <div className="bg-white p-2 rounded border border-gray-300">
        <p>{t('chart.nodeName')}: {data.formattedNodeName}</p>
        <p>{t('chart.instances')}: {data.instances}</p>
        <p>{t('chart.wasLast')}: {data.wasLast} ({Math.round(data.wasLast / data.instances * 100)}%)</p>

      </div>
      ) : null
    )
  }

  const renderCustomBar = (props: any) => {
    const { x, y, width, height, payload } = props;
    const range = conversationalsStatisticsheatMapRangeColors.find(
      ({ from, to }) => payload.wasLastPercentage >= from && payload.wasLastPercentage <= to +1
    );
    const barColor = range ? range.color : 'url(#gradientBlue)';
  
    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={barColor}
        rx={1} 
      />
    );
  };
  

  const Nodes = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch()  
    const [data, setData] = useState<NodeData[]>([])
    const [loading, setLoading] = useState(false);
    const [maxNodeNameLength, setMaxNodeNameLength] = useState<number | null>(null);
    const [allProducts, setAllProducts] = useState<string[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
    const globalDate = useSelector((state: RootState) => state.analytics.globalFilters);
    const selectedFlow = useSelector((state: RootState) => state.analytics.globalFilters.flowId);
    const language = useSelector((state: RootState) => state.companyConfig.language);
    const { toggle, isOpen } = useModal()
    const [nodeValue, setNodeValue] = useState<string>('')
    const isAdminOrInternalUser = useIsInternalOrAdminUser()
    const chartType = 'nodes'
    const { isFavorite } = useFavoriteCharts(chartType);

    const productSelectionOptions = (options: string[]) => {
      return [{ label: t('general.all'), value: '' }, ...options.map(option => ({ label: option, value: option }))];
    }


    const fetchChartData = async () => {
      try {
        setLoading(true)
        const response = await dispatch(
          getChartDataWithDates({chartType, startDate: globalDate.startDate, endDate: globalDate.endDate, language, selectedProduct, flowId: selectedFlow})
        )
        const responsePayload = await response.payload
        if (Array.isArray(responsePayload)) {
          const dataWithPercentages = responsePayload.map((node: NodeData) => ({
            ...node,
            wasLastPercentage: node.instances > 0
            ? Math.round((node.wasLast / node.instances) * 100)
            : 0,
          }));
          const formattedData = dataWithPercentages.sort((a, b) => b.instances - a.instances).map((node) => ({
            ...node,
            formattedNodeName: node.nodeName.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
          }))
          setData(formattedData);
        } else {
        toast.error(t('feedback.errorWrong'))
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error)
        toast.error(errorMessage || t('feedback.errorWrong'))
      } finally {
        setLoading(false)
      }
    };

    const fetchAllProducts = async () => {
      try {
        const fetchedProducts = await getAllProducts()
        setAllProducts(fetchedProducts)
      } catch (error) {
        const errorMessage = getErrorMessage(error)
        toast.error(errorMessage || t('feedback.errorWrong'))
      }
    };

    const handleProductSelect = (value: string) => {
      setSelectedProduct(value)
    };

    const handleOpenModal = (label: string) => {
      if(!label) return;
      setNodeValue(label)
      toggle()
    }

    useEffect(() => {
      setMaxNodeNameLength(Math.max(...data.map(node => node.nodeName.length)));
    }, [data])
  
    useEffect(() => {
      fetchChartData()
    }, [globalDate, selectedProduct])

    useEffect(() => {
      fetchAllProducts()
    },[])

    return (
      isAdminOrInternalUser &&
      <div className='flex w-full mb-5 pr-3'>
        <div className='col-span-1 w-full bg-white px-3 rounded-xl h-[490px] md:h-[390px] pb-4 mb-8 md:mb-0'>
            <div className="flex items-center justify-between p-4">
            <h4 className='text-xl bolder-text'>{t('chart.nodes')}</h4>
            {allProducts.length > 1 && (
              <div className="flex items-center space-x-4">
              <h4 className="mb-0">{t('dashboard.product')}:</h4>
              <SelectInput 
                placeholder={t('dashboard.product')}
                value={selectedProduct || ''}
                extraClass={'w-40'}
                data={productSelectionOptions(allProducts)}
                onValueChange={handleProductSelect}
              />
              <ChartFavoriteStar isFavorite={isFavorite} chartType={chartType} />
              </div>
            )}
            </div>
            <ChartLoader
            type='dashboard'
            hasData={Array.isArray(data)}
            loading={loading}
            > 
            {data.length ? (
              <ResponsiveContainer width='100%' height='80%'>
              <ComposedChart
                width={500}
                height={300}
                data={data}
                margin={barchartMargin}
                layout='vertical'
              >
                {createGradient('gradientGreenLight', '#D4EDDA', '#A3E4D7')} 
                {createGradient('gradientGreen', '#76D76D', '#4CAF50')}      
                {createGradient('gradientYellowGreen', '#4CAF50', '#B5C61D')}
                {createGradient('gradientYellowLight', '#B5C61D', '#FFD700')}
                {createGradient('gradientYellow', '#FFD700', '#FFC107')}      
                {createGradient('gradientYellowOrange', '#FFC107', '#FFA500')} 
                {createGradient('gradientOrangeLight', '#FFA500', '#FF8C00')} 
                {createGradient('gradientOrange', '#FF8C00', '#FF5722')}     
                {createGradient('gradientRedOrange', '#FF5722', '#E53935')}  
                {createGradient('gradientRed', '#E53935', '#B8001F')}       
                {createGradient('gradientDarkRed', '#B8001F', '#8B0000')}    
                {createGradient('gradientDeepRed', '#8B0000', '#4B0000')} 
                <CartesianGrid
                  strokeDasharray='7 7'
                  fill={APP_WHITE}
                  opacity={0.6}
                  horizontal={false}
                  vertical={false}
                />
                <YAxis
                  type="category"
                  tickLine={false}
                  strokeOpacity={0.4}
                  tick={axisTick}
                  dataKey='formattedNodeName'
                  interval={0}
                  tickMargin={10}
                  width={maxNodeNameLength ? maxNodeNameLength + 160 : 200}
                  label={{
                    value: t('chart.conversationalStep'),
                    angle: -90, 
                    position: 'insideLeft',
                    textAnchor: 'middle',
                    dy: 50,
                    dx: -10
                  }}
                />
                <XAxis
                  type="number"
                  tickLine={false}
                  strokeOpacity={0.4}
                  label={{
                    value: t('chart.numberOfUsersVisited'),
                    position: 'bottom',
                    dy: -10, 
                    textAnchor: 'middle',
                  }}
                />
                <Tooltip content={<NodeTooltip />} />
                <Bar
                  dataKey="instances"
                  stackId="a"
                  barSize={30}
                  activeBar={(props:any) => {
                    const { x, y, width, height, payload } = props;
                    const range = conversationalsStatisticsheatMapRangeColors.find(
                      ({ from, to }) => payload.wasLastPercentage >= from && payload.wasLastPercentage <= to +1
                    );
                    const barColor = range ? range.color : 'url(#gradientBlue)';
                    return <Rectangle x={x} y={y} width={width} height={height} fill={barColor} stroke="blue" />;
                  }}
                  shape={renderCustomBar}
                  onClick={data => handleOpenModal(data.nodeName)}
                />
              </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div className='flex justify-center items-center h-full'>
              <p>{t('feedback.noData')}</p>
              </div>
            )}
            </ChartLoader>
        </div>
        <ChatTableModal 
          toggle={toggle}
          isOpen={isOpen}
          value={nodeValue}
          type={'node'}
        />
      </div>
    )
  }
  
  export default Nodes