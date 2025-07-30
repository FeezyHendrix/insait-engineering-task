import { BaseMessageTemplate } from '@/types/baseMessageTemplate'

export interface InteractiveMessageTemplate extends BaseMessageTemplate {
    onInput: (message: string) => void
    onRemove: (templateId: string) => void
}