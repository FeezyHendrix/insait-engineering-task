import { useState } from 'react'
import { toast } from 'react-toastify'
import Modal from '../../elements/Modal'
import Button from '@/components/elements/Button'
import { InputWithIcon, TextareaWithIcon } from '../../elements/Input'
import messageImg from '@image/icons/message.svg'
import profileImg from '@image/icons/profile.svg'
import { AddTemplateModalType } from '@/types/addTemplateModal'
import { BaseMessageTemplate } from '@/types/baseMessageTemplate'

const AddTemplateModal = ({
  isOpen,
  toggle,
  onSubmit,
}: AddTemplateModalType) => {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')

  const handleAdd = () => {
    if (title && message) {
      const data: BaseMessageTemplate = { title, text: message }
      onSubmit( data )
      toggle()
    } else {
      toast.error('Please fill in all fields')
    }
  }

  return (
    <Modal size='md' isOpen={isOpen} toggle={toggle}>
      <div className='flex flex-col justify-between h-full'>
        <div>
          <h2 className='text-xl text-center bolder-text pt-3 pb-4'>
            Add Template
          </h2>
          <InputWithIcon
            className='pt-0'
            label='Template Title'
            startIcon={profileImg}
            name={'title'}
            placeholder='Enter Titles'
            onChange={(e) => {
              setTitle(e.target.value)
            }}
          />
          <TextareaWithIcon
            label='Message'
            startIcon={messageImg}
            name={'text'}
            placeholder='Enter Message'
            onChange={(e) => {
              setMessage(e.target.value)
            }}
          />
        </div>
        <div className='text-center'>
          <Button text='Create' onClick={handleAdd} />
        </div>
      </div>
    </Modal>
  )
}

export default AddTemplateModal
