import { KnowledgeListProps, KnowledgeType } from "@/types/knowledge"
import trashImg from '@image/icons/trash.svg'
import deactivate from '@image/icons/deactivate.svg'
import activate from '@image/icons/actvate.svg'
import pdfImg from '@image/icons/pdf.svg'
import { getKnowledgeDateTime } from '@/utils/dateHelper'
import { deleteKnowledgeRequest, toggleKnowledgeActivenessRequest } from "@/redux/slices/knowledgeHub/request"
import { useAppDispatch } from "@/hook/useReduxHooks"
import { toast } from 'react-toastify';
import { KnowledgeDeleteModal } from "./KnowledgeDeleteModal"
import useModal from '@hook/useModal'
import { useState } from "react"

const KnowledgeList = (props: KnowledgeListProps) => {
  const dispatch = useAppDispatch();
  const { toggle, isOpen } = useModal()
  const [ knowledgeToDelete, setKnowledgeToDelete ] = useState<KnowledgeType>();
  const openFile = async (knowledgeId: string) => {
    
  }

  const deleteKnowledge = async (data: KnowledgeType) => {

    const result = await dispatch(deleteKnowledgeRequest(data))
    if (result.payload.message) {
      toast.error('Something went wrong');
      return
    }
    toast.success(`"${data.question}" removed from knowledgebase`)
  }

  const toggleKnowledgeActiveness = async (data: KnowledgeType) => {
    const result = await dispatch(toggleKnowledgeActivenessRequest(data))
    if (result.payload.message) {
      toast.error('Something went wrong');
      return
    }
    toast.success(`"${data.question}" ${data.active ? "activated" : "deactivated"}`)
  }

  const onDeleteClick = async (e: React.MouseEvent<HTMLImageElement, MouseEvent>, knowledge: KnowledgeType) => {
    setKnowledgeToDelete(knowledge)
    toggle()
  }

  const onRemove = async () => {    
    if (!knowledgeToDelete) return
    props.setDisplayData(prevData => prevData.filter(item => item.id !== knowledgeToDelete.id));
    deleteKnowledge(knowledgeToDelete)
    toggle()
  }

  const onDeactivate = async (knowledge: KnowledgeType) => {
    const updatedKnowledge = { ...knowledge, active: false };
    const updatedData = props.displayData.map(item =>
      item.id === updatedKnowledge.id ? updatedKnowledge : item
    );
    props.setDisplayData(updatedData)
    toggleKnowledgeActiveness(updatedKnowledge)
  }

  const onActivate = async (knowledge: KnowledgeType) => {
    const updatedKnowledge = { ...knowledge, active: true }
    const updatedData = props.displayData.map(item =>
      item.id === updatedKnowledge.id ? updatedKnowledge : item
    );
    props.setDisplayData(updatedData)
    toggleKnowledgeActiveness(updatedKnowledge)
  }
  return (
    <>
      {props.knowledgeArrayData.map((knowledge) => (
        <div
          key={knowledge.id}
          className={`p-5 border rounded-lg mt-5 me-5 relative ${!knowledge.active ? 'bg-gray-200' : ''}`}
        >
          {knowledge.active ? (
            <img
              className='cursor-pointer absolute top-5 end-14'
              src={deactivate}
              alt='trash'
              onClick={() => onDeactivate(knowledge)}
            />
          ) : (
            <img
              className='cursor-pointer absolute top-5 end-14'
              src={activate}
              alt='trash'
              onClick={() => onActivate(knowledge)}
            />
          )}
          <img
            className='cursor-pointer absolute top-5 end-5'
            src={trashImg}
            alt='trash'
            onClick={(e) => onDeleteClick(e, knowledge)}
          />
          <p className='font-medium text-lg pe-8'>{knowledge.question}</p>
          <li className='font-medium text-lg text-gray'>
            {getKnowledgeDateTime(knowledge.createdAt)}
          </li>
          <hr className='my-4' />
          {knowledge.answer ? (
            <p className='text-gray font-medium text-lg'>{knowledge.answer}</p>
          ) : (
            <div className='flex items-center'>
              <span className='px-[9px] py-[7px] rounded-[7px] bg-primary me-2.5'>
                <img src={pdfImg} alt='pdf' />
              </span>
              <p
                className='font-medium text-lg text-gray'
                onClick={() => openFile(knowledge.id)}
              >
                {knowledge.question}
              </p>
            </div>
          )}
        </div>
      ))}
      <KnowledgeDeleteModal isOpen={isOpen} confirm={onRemove} toggle={toggle}/>
    </>
  );
  
}

export default KnowledgeList