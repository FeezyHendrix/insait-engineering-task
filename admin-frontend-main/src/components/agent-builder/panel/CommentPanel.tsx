import {
  CommentInputProps,
  CommentProp,
  NodePanelProps,
} from '@/types/agent-builder'
import { useEffect, useState } from 'react'

const CommentInput = ({ onSubmit, placeholder }: CommentInputProps) => {
  const [comment, setComment] = useState('')

  const handleSubmit = () => {
    if (comment.trim()) {
      onSubmit(comment)
      setComment('')
    }
  }

  return (
    <div className='flex gap-2 items-start bg-white'>
      <div className='w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center'>
        U
      </div>
      <div className='flex-1'>
        <div className='bg-gray-50 rounded-lg p-2'>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder={placeholder}
            className='w-full bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 min-h-[100px]'
          ></textarea>
        </div>
        {comment.trim() && (
          <div className='flex justify-end mt-2'>
            <button
              onClick={handleSubmit}
              className='px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600'
            >
              Post
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const Comment = ({ comment }: { comment: CommentProp }) => {
  const timeAgo = (date: string): string => {
    const minutes = Math.floor(
      (new Date().getTime() - new Date(date).getTime()) / 60000
    )
    if (minutes < 60) return `${minutes} minutes ago`
    if (minutes < 1440) return `${Math.floor(minutes / 60)} hours ago`
    return `${Math.floor(minutes / 1440)} days ago`
  }

  return (
    <div className='flex gap-2 items-start mb-4'>
      <div className='w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center'>
        {comment.author[0]}
      </div>
      <div className='flex-1'>
        <div>
          <span className='font-medium'>{comment.author}</span>
          <span className='text-gray-400 text-sm ml-2'>
            {timeAgo(comment.timestamp)}
          </span>
        </div>
        <p className='text-gray-700 mt-1'>{comment.content}</p>
      </div>
    </div>
  )
}

const CommentPanel = ({ selectedNode, updateNodeData }: NodePanelProps) => {
  const [nodeData, setNodeData] = useState(selectedNode?.data)

  const addComment = (content: string) => {
    const existingComments = nodeData?.comments || []

    const newComment = {
      id: `${existingComments.length + 1}`,
      author: 'User Insait',
      content,
      timestamp: new Date().toISOString(),
    }

    const newComments = [...existingComments, newComment]
    handleUpdateNodeDate('comments', newComments)
  }

  const handleUpdateNodeDate = (key: string, value: any) => {
    const newNode = {
      ...nodeData,
      [key]: value,
    }
    updateNodeData(selectedNode.id, newNode)
  }

  useEffect(() => {
    if (selectedNode?.data) {
      setNodeData(selectedNode.data)
    }
  }, [selectedNode])

  return (
    <div className='w-[400px] bg-white p-6 border-l border-gray-200 h-full overflow-y-auto'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-xl font-semibold text-gray-800'>
          {nodeData?.label}
        </h2>
      </div>

      <div className='space-y-6'>
        {nodeData?.comments &&
          nodeData?.comments?.length > 0 &&
          nodeData?.comments.map(comment => (
            <Comment key={comment.id} comment={comment} />
          ))}

        <CommentInput onSubmit={addComment} placeholder='Comment or @mention' />
      </div>
    </div>
  )
}

export default CommentPanel
