import CustomTooltip from '@/components/elements/CustomTooltip'
import SelectInput from '@/components/elements/SelectInput'
import { useAppDispatch, useAppSelector } from '@/hook/useReduxHooks'
import {
  setBotLoadState,
  setBotUserId,
  setCurrentFlowId,
} from '@/redux/slices/agentBuilder'
import { FlowSelectorProps } from '@/types/agent-builder'
import { useTranslation } from 'react-i18next'
import { FaPlayCircle, FaStopCircle } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import ConfirmDialog from './ConfirmDialog'
import { GrDuplicate } from 'react-icons/gr'
import { RiSave3Line } from 'react-icons/ri'
import { useState } from 'react'
import { FiEdit2 } from 'react-icons/fi'
import constants from '@/utils/constants'
import { LuExternalLink } from 'react-icons/lu'
import InfoDisplay from './InfoDisplay'
import { BsExclamationLg } from 'react-icons/bs'
const { AGENT_INSAIT_BOT_URL } = constants

const FlowSelector = ({
  flows,
  currentFlowId,
  onFlowSelect,
  onNewFlow,
  onDelete,
  onEdit,
  handleDuplicateCurrentFlow,
  saveCurrentFlow,
}: FlowSelectorProps) => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { loading, botLoaded, currentFlowData, sanity, botUserId } =
    useAppSelector((state) => state.builder)
  const [showDelete, setShowDelete] = useState<boolean>(false)
  const [showSanityInfo, setShowSanityInfo] = useState<boolean>(false)

  const flowSelectionOptions = () => {
    return [
      { label: t('agentBuilder.newFlow'), value: 'new' },
      ...flows.map((option) => ({ label: option.name, value: option.id })),
    ]
  }

  const handleBotStateChange = (value: boolean) => {
    dispatch(setBotLoadState(value))
  }

  const handleSubmit = () => {
    setShowDelete(false)
    onDelete && onDelete(currentFlowId || '')
  }

  const showGraphInvalidReason = () => {
    setShowSanityInfo(true)
  }

  return (
    <div className='absolute top-5 right-5 z-0 p-0 rounded flex flex-col'>
      {loading ? (
        <div className='inline-app-loader dark' />
      ) : (
        <>
          <SelectInput
            label={'Flow'}
            placeholder={'Flow'}
            value={currentFlowId || 'new'}
            extraClass={
              'px-4 py-2 border rounded-md shadow-sm bg-white min-w-[200px] outline-none focus:none'
            }
            floatingLabel
            data={flowSelectionOptions()}
            onValueChange={(value) => {
              handleBotStateChange(false)
              if (value === 'new') {
                onNewFlow()
              } else {
                if (onFlowSelect) {
                  onFlowSelect(value)
                  return
                }
                dispatch(setCurrentFlowId(value))
              }
            }}
          />
          <div
            className={`flex gap-2 w-full ps-3 pe-6 mt-2 pt-2 pb-2 bg-white rounded-md items-center ${
              !currentFlowId ? 'justify-start' : 'justify-around'
            }`}
          >
            {currentFlowId && (
              <>
                <CustomTooltip noWrap title='Duplicate Flow'>
                  <button className='app-bg-blue p-2 rounded'>
                    <GrDuplicate
                      onClick={handleDuplicateCurrentFlow}
                      className='text-md text-white'
                    />
                  </button>
                </CustomTooltip>

                <CustomTooltip noWrap title='Delete Flow'>
                  <button className='app-bg-blue p-2 rounded'>
                    <MdDelete
                      onClick={() => setShowDelete(true)}
                      className='text-md text-white'
                    />
                  </button>
                </CustomTooltip>

                <CustomTooltip noWrap title='Edit Flow'>
                  <button
                    disabled={!onEdit}
                    onClick={onEdit}
                    className='app-bg-blue p-2 rounded disabled:bg-gray-400'
                  >
                    <FiEdit2
                      onClick={handleDuplicateCurrentFlow}
                      className='text-md text-white'
                    />
                  </button>
                </CustomTooltip>

                {currentFlowData?.nodes &&
                  currentFlowData?.nodes?.length > 0 && (
                    <>
                      <CustomTooltip
                        noWrap
                        title={botLoaded ? 'Stop Preview' : 'Play/Preview'}
                      >
                        <button
                          disabled={!sanity.success}
                          className='app-bg-blue p-2 rounded disabled:opacity-40 disabled:bg-[#10b3e8]'
                        >
                          {botLoaded ? (
                            <FaStopCircle
                              onClick={() => handleBotStateChange(false)}
                              className='text-md text-white'
                            />
                          ) : (
                            <FaPlayCircle
                              onClick={() => handleBotStateChange(true)}
                              className='text-md text-white'
                            />
                          )}
                        </button>
                      </CustomTooltip>

                      {currentFlowId && (
                        <CustomTooltip noWrap title='Open Chat'>
                          <a
                            href={`${AGENT_INSAIT_BOT_URL}?flowId=${currentFlowId}&userId=${botUserId}`}
                            target='_blank'
                            onClick={
                              sanity.success
                                ? undefined
                                : (e) => e.preventDefault()
                            }
                            className={`block app-bg-blue p-2 rounded ${
                              sanity.success
                                ? ''
                                : 'opacity-40 cursor-not-allowed'
                            } `}
                          >
                            <LuExternalLink className='text-md text-white' />
                          </a>
                        </CustomTooltip>
                      )}
                    </>
                  )}
              </>
            )}

            {!currentFlowId && (
              <CustomTooltip noWrap title='Save Current Flow'>
                <button className='app-bg-blue p-2 rounded'>
                  <RiSave3Line
                    onClick={saveCurrentFlow}
                    className='text-lg text-white'
                  />
                </button>
              </CustomTooltip>
            )}
          </div>
          <div className='py-1'>
            <input
              type='text'
              value={botUserId}
              onChange={(e) => dispatch(setBotUserId(e.target.value))}
              placeholder={'Enter User ID'}
              className='px-2 py-1 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full'
            />
          </div>
          {!sanity.success && (
            <div className='bg-white flex gap-1 items-center py-1 mx-auto'>
              <p className='text-xs text-red-500 font-medium'>
                Current Graph is not Valid.
              </p>
              <button
                onClick={showGraphInvalidReason}
                className='text-xs text-blue-500 border-b border-blue-500 hover:bg-blue-100'
              >
                See Why
              </button>
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        isOpen={showDelete}
        title={`Delete Flow`}
        description='Are you sure you want to delete this flow? This action cannot be undone.'
        onClose={() => setShowDelete(false)}
        onConfirm={handleSubmit}
      />
      <InfoDisplay
        isOpen={showSanityInfo}
        onClose={() => setShowSanityInfo(false)}
        title='Sanity Check'
      >
        <div className='flex flex-col gap-2'>
          {sanity.errors.map((error, index) => (
            <div
              key={index}
              className='text-red-500 text-sm flex items-start gap-2 p-2 bg-red-50 rounded'
            >
              <span className='text-red-500 mt-0.5'>
                <BsExclamationLg className='h-4 w-4' />
              </span>
              <span>{error}</span>
            </div>
          ))}
        </div>
      </InfoDisplay>
    </div>
  )
}

export default FlowSelector
