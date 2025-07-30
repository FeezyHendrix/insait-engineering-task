import ChartLoader from '../layout/ChartLoader'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ABConversionsProps } from '@/types/dashboard';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useTranslation } from 'react-i18next';

const ABConversions = ({ chartData }: ABConversionsProps) => {
    const { t } = useTranslation()
    const data = chartData
    const chartConfigData = useSelector((state: RootState) => state.companyConfig.charts)

    return (
      <>
      { chartConfigData.includes('ABConversions') ?

      <div className='col-span-1 flex-1 w-full bg-white px-3 rounded-xl h-[390px] pb-4 mb-8 md:mb-0'>
        <div className='col-span-1 flex-1 w-full bg-white px-3 rounded-xl h-[325px] pb-4 mb-8 md:mb-0'>
          <h4 className='text-xl p-4 bolder-text'>{t('chart.successfulConversions')}</h4>
        <p className='pb-4 ps-4'>{t('chart.countOfSuccessfulConversions')}</p>
          {/* Chart */}
          <ChartLoader type='dashboard' hasData={Array.isArray(chartData)}>
            <ResponsiveContainer width='90%' height='90%'>
            <LineChart
                width={500}
                height={300}
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis
                  label={{
                    value: t('chart.conversations'),
                    angle: -90,
                    position: 'insideLeft',
                    style: { textAnchor: 'middle' },
                  }}
                />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey={t('chart.sawChatbot')} stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey={t('chart.noChatbot')} stroke="#82ca9d" />
            </LineChart>
            </ResponsiveContainer>
          </ChartLoader>
        </div>
      </div>  
      : <></>}</>
    )
}

export default ABConversions