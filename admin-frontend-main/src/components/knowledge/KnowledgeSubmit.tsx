import { useState } from 'react'
import { toast } from 'react-toastify'
import { InputWithIcon, TextareaWithIcon } from '../elements/Input'
import Button from '../elements/Button'
import messageImg from '@image/icons/message.svg'
import { uuid } from '@/utils/clientDataHelper'
import {  KnowledgeSubmitProp, KnowledgeType } from '@/types/knowledge'
import { postNewKnowledgeRequest } from '@/redux/slices/knowledgeHub/request'
import { useAppDispatch } from '@/hook/useReduxHooks'
import { knowledgeTextLimits } from '@/utils/data'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useTranslation } from 'react-i18next'

const KnowledgeSubmit = ({ addKnowledge, editKnowledge }: KnowledgeSubmitProp) => {
  const { t } = useTranslation()
  const [title, setTitle] = useState<string>(editKnowledge?.question || '')
  const [text, setText] = useState<string>(editKnowledge?.answer ||'')
  const [pdf, setPdf] = useState<File>()
  const dispatch = useAppDispatch();
  const company = useSelector((state: RootState) => state.companyConfig.company)

  const resetForm = () => {
    setTitle('')
    setText('')
    setPdf(undefined)
  }

  const submitKnowledge = async (data: KnowledgeType) => {
    const isUpdate = editKnowledge?.id ? true : false;
    const result = await dispatch(postNewKnowledgeRequest({data, isUpdate }))    
    if (!result.payload.msg || !result.payload.msg.id) {
      toast.error(result?.payload?.msg?.meta?.cause || t('feedback.errorWrong'));
    } else {
    toast.success(isUpdate ? t('knowledge.updatedSuccess', { title }) : t('knowledge.addedSuccess', { title }));
      resetForm()
      addKnowledge && addKnowledge(data);
    }
  }

  const handleSubmit = async () => {
    if (text !== '' && (!pdf && !title)) {
      toast.error(t('feedback.requiredFields'))
    } else if (text) {
      const knowledgeData = {
        id: editKnowledge?.id ?? uuid(),
        question: title,
        answer: text,
        createdAt: `${new Date().toISOString()}`,     
        product: company,   
        active: true
      }
      if (title.length > knowledgeTextLimits.question) {
        toast.error(t('knowledge.textLimitsQuestion', { limit: knowledgeTextLimits.question }));
        return
      };
      if (text.length > knowledgeTextLimits.answer) {
        toast.error(t('knowledge.textLimitsAnswer', { limit: knowledgeTextLimits.answer }));
        return
      };
      submitKnowledge(knowledgeData)
    }  else {
      toast.error(t('feedback.requiredFields'))
    }
  }

  return (
    <div className='px-5 mb-10 md:mb-0'>
      <h4>{t('knowledge.pageInfo')}</h4>
      <InputWithIcon
        className='pt-0'
        label={t('knowledge.question')}
        startIcon={messageImg}
        name={'title'}
        placeholder={t('input.egHello')}
        value={title}
        limit={knowledgeTextLimits.question}
        onChange={(e) => {
          setTitle(e.target.value)
        }}
      />
      
      <TextareaWithIcon
        label={t('knowledge.answer')}
        startIcon={messageImg}
        name={'text'}
        placeholder={t('input.egHello')}
        value={text}
        onChange={(e) => {
          setText(e.target.value)
        }}
        limit={knowledgeTextLimits.answer}
      />
      <div className='mt-8 text-center'>
        <Button text={t('button.submit')} onClick={handleSubmit} />
      </div>
    </div>
  )
}

export default KnowledgeSubmit