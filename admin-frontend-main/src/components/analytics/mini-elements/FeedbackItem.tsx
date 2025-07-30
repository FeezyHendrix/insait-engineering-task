import { FeedbackItemPropsType } from '@/types/analytics'
import { Fragment } from 'react'
import { Rating } from 'react-simple-star-rating'

const FeedbackItem = ({
  image,
  username,
  rating,
  text,
  isNotLast
}: FeedbackItemPropsType) => {
  return (
    <Fragment>
      <div className='flex flex-row gap-3 items-start'>
        <img
          src={image}
          alt={username}
          width={42}
          height={42}
          className='mt-1'
        />
        <div>
          <p className='text-gray bold-text'>{text}</p>
          <p className='bolder-text my-2 capitalize'>{username}</p>
          <Rating
            readonly
            initialValue={rating}
            allowFraction
            size={24}
            className='flex items-center '
          />
        </div>
      </div>
      {isNotLast && <hr className='my-4' />}
    </Fragment>
  )
}

export default FeedbackItem
