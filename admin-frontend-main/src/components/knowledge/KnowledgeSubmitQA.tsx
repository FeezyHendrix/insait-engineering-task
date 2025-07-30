import { useState } from 'react'
import { KnowledgeQuestionInput, TextareaWithIcon } from '../elements/Input'
import messageImg from '@image/icons/message.svg'
import { KnowledgeSubmitQAProp, KnowledgeType } from '@/types/knowledge'
import { knowledgeTextLimits } from '@/utils/data'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { uuid } from '@/utils/clientDataHelper'
import { useAppDispatch, useAppSelector } from '@/hook/useReduxHooks'
import { postNewKnowledgeRequest } from '@/redux/slices/knowledgeHub/request'

const KnowledgeSubmitQA = ({
  editKnowledge,
  handleDelete,
  fetchQAKnowledgeData,
  handleActivation,
}: KnowledgeSubmitQAProp) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const company = useAppSelector(state => state.companyConfig.company)
  const [question, setQuestion] = useState<string>(
    editKnowledge?.question || ''
  )
  const [isEditing, setIsEditing] = useState(false)
  const [answer, setAnswer] = useState<string>(editKnowledge?.answer || '')

  const submitKnowledge = async (data: KnowledgeType) => {
    const isUpdate = editKnowledge?.id ? true : false
    const result = await dispatch(postNewKnowledgeRequest({ data, isUpdate }))
    if (!result.payload.msg || !result.payload.msg.id) {
      toast.error(result?.payload?.msg?.meta?.cause || t('feedback.errorWrong'))
    } else {
      fetchQAKnowledgeData()
      toast.success(
        isUpdate
          ? t('knowledge.updatedSuccess', { title: question })
          : t('knowledge.addedSuccess', { title: question })
      )
    }
  }

  const handleSave = () => {
    if (!question || !answer) {
      return toast.error(t('feedback.requiredFields'))
    }
    if (question.length > knowledgeTextLimits.question) {
      toast.error(
        t('knowledge.textLimitsQuestion', {
          limit: knowledgeTextLimits.question,
        })
      )
      return
    }
    if (answer.length > knowledgeTextLimits.answer) {
      toast.error(
        t('knowledge.textLimitsAnswer', { limit: knowledgeTextLimits.answer })
      )
      return
    }
    setIsEditing(false)
    const knowledgeData = {
      id: editKnowledge?.id || uuid(),
      question,
      answer,
      createdAt: `${new Date().toISOString()}`,
      product: company,
      active: true,
    }
    submitKnowledge(knowledgeData)
  }

  return (
    <div
      className={`pb-4 border  px-4 mb-4 rounded bg-gray-50`}
    >
      <KnowledgeQuestionInput
        className='pt-0'
        label={t('knowledge.question')}
        startIcon={messageImg}
        name={'title'}
        placeholder={t('input.egHello')}
        value={question}
        limit={knowledgeTextLimits.question}
        handleDelete={handleDelete}
        onChange={(e: any) => {
          setIsEditing(true)
          setQuestion(e.target.value)
        }}
        isActive={editKnowledge?.active || false}
        handleActivation={(value: string) =>
          handleActivation(value, editKnowledge?.id)
        }
      />

      <TextareaWithIcon
        label={t('knowledge.answer')}
        startIcon={messageImg}
        name={'text'}
        className='pt-2'
        placeholder={t('input.egHello')}
        value={answer}
        onChange={e => {
          setIsEditing(true)
          setAnswer(e.target.value)
        }}
        limit={knowledgeTextLimits.answer}
      />
      <button
        onClick={handleSave}
        disabled={!isEditing}
        className={`${
          isEditing ? 'app-bg-blue' : 'bg-gray-400'
        } text-white px-2 py-0.5 rounded-md flex justify-self-end`}
      >
        Save
      </button>
    </div>
  )
}

export default KnowledgeSubmitQA
