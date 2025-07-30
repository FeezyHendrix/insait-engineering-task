import { Rating } from 'react-simple-star-rating'
import FeedbackItem from './mini-elements/FeedbackItem'
import { FeedbackItemPropsType, UserFeedbackPropsType } from '@/types/analytics'
import ChartLoader from '../layout/ChartLoader'
import sampleImg from '@image/user.jpeg'
import { checkIfActiveArrray } from '@/utils'
import { useTranslation } from 'react-i18next'

const UserFeedback = ({ averageRating, data }: UserFeedbackPropsType) => {
  const { t } = useTranslation()

  return (
    <div className='col-span-1 md:h-[400px] p-4 w-full rounded-xl bg-white '>
      {/* Header */}
      <div className='flex flex-row justify-between'>
        <h4 className='text-xl bolder-text'>{t('chart.userFeedback')}</h4>
        <div className='flex flex-row justify-center gap-2'>
          <Rating
            readonly
            initialValue={averageRating}
            allowFraction
            size={22}
            className='flex items-center '
          />
          <h4 className='text-md bolder-text pt-1'>{`(${
            averageRating || 0
          }/5)`}</h4>
        </div>
      </div>

      {/* List */}
      <ChartLoader type='analytics' hasData={Array.isArray(data)}>
        <div className='mt-5 md:overflow-y-scroll h-full md:h-4/5 md:pr-6'>
          {checkIfActiveArrray(data) ? (
            data!.map((review: FeedbackItemPropsType, index: number) => (
              <FeedbackItem
                id={review.id}
                key={review.id}
                image={review.image || sampleImg}
                username={review.username}
                text={review.text}
                rating={review.rating}
                isNotLast={data!.length - 1 !== index}
              />
            ))
          ) : (
            <p className='w-full h-3/4 flex justify-center items-center capitalize'>
              {t('feedback.noFeedbackSubmitted')}
            </p>
          )}
        </div>
      </ChartLoader>
    </div>
  )
}

export default UserFeedback
