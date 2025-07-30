import { AverageLengthOfMessagesPropsType } from '@/types/dashboard'
import './styles/index.css'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

const AverageLengthOfMessages = ({
  averageLengthOfClientMessages,
  averageLengthOfBotMessages,
  averageLengthOfClientMessagesActive,
  averageLengthOfBotMessagesActive,
}: AverageLengthOfMessagesPropsType) => {
  const companyCharts = useSelector((state: RootState) => state.companyConfig.charts)

  return (
    <div className='col-span-1 md:grid md:grid-cols-10 gap-4 w-full '>
      
        <>
        {
            averageLengthOfClientMessagesActive && companyCharts.includes("averageLengthOfClientMessages") ?
              <div className='col-span-5 flex flex-col justify-center items-center bg-white rounded-2xl measure_container p-5  gap-5 mb-8 md:mb-0'>
                <p className='text-gray text-xl text-center'>
                  Average Length of<br />Client Messages
                </p>
                <h2 className='text-3xl bolder-text'>
                  {averageLengthOfClientMessages === undefined ? '-': Number(averageLengthOfClientMessages).toFixed(2)} 
                </h2>
                <p className='text-gray text-xl text-center'>words</p>
              </div>
              : null
        }

        </>
        <>
          {
            averageLengthOfBotMessagesActive && companyCharts.includes("averageLengthOfBotMessages") ?
            <div className='col-span-5 flex flex-col justify-center items-center bg-white rounded-2xl measure_container p-5 gap-5 blue_measure_container mb-8 md:mb-0'>
              <p className='text-gray text-xl text-center'>Average Length of<br />Bot Messages</p>
              <h2 className='text-3xl bolder-text'>
                {averageLengthOfBotMessages === undefined ? '-': Number(averageLengthOfBotMessages).toFixed(2)} 
              </h2>
              <p className='text-gray text-xl text-center'>words</p>
            </div>
            : null
          }
        </>
    </div>
  )
}

export default AverageLengthOfMessages
