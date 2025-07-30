import { LabelValueType } from "./chat"

export interface InputWithIconType {
    startIcon?: string
    label?: string
    placeholder?: string
    name: string
    onChange?: React.ChangeEventHandler<HTMLInputElement>
    value?: string
    className?: string
    limit?: number
    extraClass?: string
    disabled?: boolean
    type?: string
  }

  export interface SwitchInputType extends InputWithIconType {
    checked?: boolean
    showEnableDisableText?: boolean
    secondaryPlaceholder?: string
  }

export interface KnowledgeQuestionInputType extends InputWithIconType {
    handleDelete?: () => void
    handleActivation: (value: string) => void
    onBlur?: () => void
    isActive: boolean
}

export type ModalSize = 's' | 'm' | 'l'  

export interface TextareaWithIconType {
  className?: string
  startIcon?: string
  label: string
  placeholder: string
  name: string
  rows?: number
  value?: string
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>
  limit?: number
  onBlur?: () => void
  dir?: 'ltr' | 'rtl'
  modalSize? : ModalSize
}

  export interface ToggleRadioSelectionProp {
    selectedOption: string
    name: string
    data: Array<LabelValueType>
    handleOptionChange: (value: string) => void
  }

  export interface TextUploadProps {
    textData: string
    setTextData: React.Dispatch<React.SetStateAction<string>>
  }

export interface UploadFileInputProps {
  customIcon?: string
  label?: string
  customPlaceholder?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  className?: string
  acceptFileType: string
  disabled?: boolean
}