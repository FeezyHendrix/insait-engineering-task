import { checkIfActiveArrray } from '@/utils'
import ChartLoader from '../layout/ChartLoader'
import QuestionRender from './mini-elements/QuestionRender'
import {
  QuestionRenderPropsType,
  TopQuestionsPropsType,
} from '@/types/analytics'
import { useTranslation } from 'react-i18next'

const TopQuestions = ({
  data,
  title,
  description,
  loading,
  displayAsLink,
}: TopQuestionsPropsType) => {
  const { t } = useTranslation()

  return (
    <div className='col-span-1 md:h-[325px] p-4 w-full rounded-xl bg-white '>
      {/* Header */}
      <h4 className='text-xl bolder-text'>
        {title ?? t('chart.topQuestionsAsked')}
      </h4>

      {/* List */}
      <ChartLoader
        loading={loading}
        type='analytics'
        hasData={Array.isArray(data)}
      >
        <div className='mt-5 md:overflow-y-scroll h-full md:h-4/5 md:pr-6'>
          {checkIfActiveArrray(data) ? (
            data!
              .sort((a: any, b: any) => b.count - a.count)
              .map((question: QuestionRenderPropsType) => (
                <QuestionRender
                  key={question.id}
                  count={question?.count || 1}
                  text={question.text}
                  displayAsLink={displayAsLink}
                />
              ))
          ) : (
            <p className='w-full h-3/4 flex justify-center items-center capitalize'>
              {t('feedback.noQuestionsAsked')}
            </p>
          )}
          {data!.length > 0 && description && (
            <p className='pb-2 text-sm font-semibold'>{description}</p>
          )}
        </div>
      </ChartLoader>
    </div>
  )
}

export default TopQuestions
