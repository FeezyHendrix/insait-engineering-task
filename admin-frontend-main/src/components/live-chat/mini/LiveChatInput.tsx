import sendImg from '@image/icons/send.svg'
import { AudioRecorder } from 'react-audio-voice-recorder'
import attachImg from '@image/icons/file-attach.svg'
import galleryImg from '@image/icons/gallery.svg'

import { useEffect, useState } from 'react'
import { socket } from '@/main'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import IconComponent from '@/components/icons'
import { LiveChatInputType } from '@/types/liveChatInput'

const LiveChatInput = ( { 
  conversationId, openTemplate, setOpenTemplate, templateData, setTemplateData} : LiveChatInputType) => {

  const [text , setText] = useState('')
  const currentUser = useSelector((state: RootState) => state.auth.currentUser)
  const message_id = Math.floor(Math.random() * 1000000000).toString();
  const handleOnSend = () => {
    if(!text.trim()) return
    const data = {
      conversation_id: conversationId,
      text: text,
      pov : 'agent',
      id: message_id
    }
    socket?.emit('send_live_message', data)
    setText('')
    setTemplateData('')
  }

  const handleOnInputChange = (e: any) => {
    setText(e.target.value)
  }

  const addAudioElement = (blob: Blob) => {
    const url = URL.createObjectURL(blob)
    const audio = document.createElement('audio')
    audio.src = url
    audio.controls = true
    document.body.appendChild(audio)
  }

  const handleFileSelection = (files: FileList | null) => {
  }

  useEffect(() => {
    if (templateData.length > 0) {
        setText(templateData);
    }
}, [templateData]);

  return (
    <div className='px-5 flex flex-row gap-3 pt-2'>
      <div className=' bg-gray-100 flex-1 flex flex-row rounded-lg px-2 py-1'>
        <AudioRecorder
          onRecordingComplete={addAudioElement}
          audioTrackConstraints={{
            noiseSuppression: true,
            echoCancellation: true,
          }}
          downloadOnSavePress={true}
          downloadFileExtension='webm'
        />
        <input
          className='flex-1 bg-transparent outline-none text-sm'
          placeholder='Type Message'
          value={text}
          onChange={handleOnInputChange}
          onKeyUp={e => {
            if (e.key === 'Enter') {
              if(!text.trim()) return
              handleOnSend()
            }
           }}
        />
        <div className='flex flex-row gap-2'>
          <button
            className={`p-1.5 rounded-md ${openTemplate ? 'bg-primary' : ''}`}
            onClick={() => setOpenTemplate(!openTemplate)}
          >
            <IconComponent name='clipboard' active={openTemplate} />
          </button>
          <input
            type='file'
            accept='image/*'
            className='hidden'
            onChange={e => handleFileSelection(e.target.files)}
            id='imageInput'
            multiple
          />
          <input
            type='file'
            accept='image/*, application/pdf, .doc, .docx'
            className='hidden'
            onChange={e => handleFileSelection(e.target.files)}
            id='fileInput'
            multiple
          />
          <label
            htmlFor='imageInput'
            className='cursor-pointer flex justify-center items-center'
          >
            <img src={galleryImg} alt='file attach' width={24} height={24} />
          </label>
          <button>
            <img src={attachImg} alt='file attach' width={24} height={24} />
          </button>
        </div>
      </div>
      <button
        disabled={text.trim() === ''}
        key='send-button'
        onClick={handleOnSend}
        className='app-bg-blue py-2 px-2 rounded-xl my-1'
      >
        <img src={sendImg} alt='send' width={30} />
      </button>
    </div>
  )
}

export default LiveChatInput
