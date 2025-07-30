import { AverageResponseTimeFromClientPropsType } from '@/types/dashboard'
import './styles/index.css'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

const AverageResponseTimeFromClient = ({
  averageResponseTimeFromClient,
}: AverageResponseTimeFromClientPropsType) => {
  const chartConfigData = useSelector((state: RootState) => state.companyConfig.charts)

  return (
    <>
    {chartConfigData.includes('averageResponseTimeFromClient') ?
    <div className='col-span-1 md:grid md:grid-cols-10 gap-4 w-full '>
      <div className='col-span-5 flex flex-col justify-center items-center bg-white rounded-2xl measure_container p-5  gap-5 mb-8 md:mb-0'>
        <p className='text-gray text-xl text-center'>
        Average Response Time<br />for User
        </p>
        <h2 className='text-3xl bolder-text'>
          {averageResponseTimeFromClient === undefined ? '-': averageResponseTimeFromClient} 
        </h2>
      </div>
    </div>:<></>}
    </>
  )
}

export default AverageResponseTimeFromClient
