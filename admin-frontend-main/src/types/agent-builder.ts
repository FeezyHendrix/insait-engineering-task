import { OnChange } from '@monaco-editor/react'
import { Node, Edge } from '@xyflow/react'
import { Dispatch, MouseEventHandler, ReactNode, SetStateAction } from 'react'
import { IconType } from 'react-icons/lib'
import { Descendant } from 'slate'

export interface NodeStyle {
  backgroundColor: string
}

export interface NodeDataConditionType {
  id: string
  variable: string
  value: string
}

export interface NodeDataVariant {
  id: string
  message: string
}

export interface NodeDataPathType {
  id: string
  value: string
  conditions: NodeDataConditionType[]
  type?: string
  match?: string
  code?: string
}

export interface VisibleCondition {
  variantId: string
  activeTab: string
}

export interface KeyValueProps {
  id: string
  key: string
  value: string
}
export interface ValueOnlyProps {
  id: string
  value: string
}

export interface CommentProp {
  id: string
  author: string
  content: string
  timestamp: string
}

export interface CaptureEntitiesProp {
  id: string
  value: string
  optional: boolean
}

export interface CarouselImageProp {
  image: string
  alt: string
}

export interface NodeDataProps {
  label: string
  isFirstNodeType?: boolean
  isFirstNode?: boolean
  message?: string
  style?: NodeStyle
  systemPrompt?: string
  entities?: Array<CaptureEntitiesProp>
  carouselImages?: CarouselImageProp[]
  variants?: NodeDataVariant[]
  variantConditions?: Record<string, Record<string, string>>
  conditions?: Array<NodeDataConditionType>
  visibleCondition?: VisibleCondition | null
  buttons?: Array<{ id: string; label: string }>
  paths?: NodeDataPathType[]
  conditionCount?: number
  headers?: KeyValueProps[]
  parameters?: KeyValueProps[]
  body?: KeyValueProps[]
  responses?: KeyValueProps[]
  rules?: ValueOnlyProps[]
  rulesToRemember?: ValueOnlyProps[]
  scenarios?: ValueOnlyProps[]
  comments?: CommentProp[]
  method?: string
  testStatus?: string
  url?: string
  [key: string]: any
}

export interface NodeComponentProps extends Node {
  id: string
  type: string
  position: PositionXYProp
  data: NodeDataProps
  onClick?: () => void
  updateNodeData: (id: string, data: Partial<NodeDataProps>) => void
}
export interface AgentNodeComponentProps extends Node {
  id: string
  type: NODE_CREATE_TYPE
  position: PositionXYProp
  data: NodePropertiesType
  onClick?: () => void
  updateNodeData?: (id: string, data: NodePropertiesType) => void
  created_at?: string
}

// Flow-related interfaces
export interface Flow {
  id: string
  name: string
  tenant_id: string
  created_at: string
  updated_at?: string
  properties?: FlowPropertiesType

  nodes?: NodeComponentProps[]
  edges?: Edge[]
  variableData?: VariableDataProps[]
  fieldData?: FieldPropertiesType[]
  functionData: FunctionDataProps[]
}

export interface FlowPropertiesType {
  company: string
  country: string
  first_message: string
  how_to_react_to_not_knowing: string
  system_prompt: string
  bot_nickname: string
  time_format: string
  date_format: string
  use_knowledge_base: boolean
  guidelines: FlowGuideline[] | undefined
}

export interface NodeExitsType {
  id: string
  flow_id: string
  node_id: string
  properties: NodeExitPropertiesType
  created_at: string
  updated_at: string
}

export interface CurrentFlowDataType {
  nodes: NodeDataType[]
  edges: EdgePropertiesType[]
  fields: FieldDataProps[]
  node_exits: NodeExitsType[]
  flow: Flow
}

export interface SanityValidation {
  errors: string[]
  success: boolean
}

export interface BuilderState {
  flows: Array<Flow>
  currentFlowId: string
  selectedNodeId: string
  currentFlowData: CurrentFlowDataType | null
  loading: boolean
  botLoaded?: boolean
  sanity: SanityValidation
  botUserId?: string
}

export interface PositionXYProp {
  x: number
  y: number
}

// Flow selector interfaces
export interface FlowSelectorProps {
  flows: Flow[]
  currentFlowId: string | null
  onFlowSelect?: (id: string) => void
  onDelete: (value: string) => void
  handleDuplicateCurrentFlow: () => void
  saveCurrentFlow: () => void
  onNewFlow: () => void
  onEdit?: () => void
}

export interface SaveFlowModalProps {
  isOpen: boolean
  action: AddFlowModalActionProp
  onClose: () => void
  onSave: (value: NewFlowType, action: AddFlowModalActionProp) => void
}

export interface TitleProps {
  isEditing?: boolean
  label?: string
  onLabelChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onLabelClick?: MouseEventHandler<HTMLElement>
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  Icon?: React.ComponentType<{ className?: string }>
  iconClassName?: string
}

export interface ToolbarProps {
  data: MenuItemsDataProps
  addNode: (nodeType: string, position: PositionXYProp) => void
  showComment?: boolean
}

export interface MenuOption {
  id: number
  label: string
  value: string
  icon: IconType
}

export interface MenuItemsDataProps {
  talk?: {
    icon: IconType
    label: string
    options: MenuOption[]
  }
  listen: {
    icon: IconType
    label: string
    options: MenuOption[]
  }
}

export interface VariableDataValuesProp {
  id: string
  value: string
  synonyms: string
}

export interface ValidationProp {
  type: string
  value: string
}

export interface VariableDataProps {
  id: string
  value: string
  type: string
  values: string
  validation: ValidationProp
  color: string
}

export interface FieldDataProps {
  id: string
  flow_id: string
  properties: FieldPropertiesType
  is_complex_enum: boolean
  created_at: string
  updated_at: string
}

export interface FieldPropertiesType {
  name: string
  type: string
  description: string
  enum?: FieldValidValue[]
  is_complex_enum: boolean
  use_descriptions?: string
  values?: string
  output_field_name?: string
  transform_method?: TransformMethodEnum
  transform_prompt?: string
  list_name?: string
  list_items_type?: string
  list_complete_condition?: string
}

export interface FunctionDataProps {
  id: string
  name: string
  value: string
}

export interface NodePanelProps {
  selectedNode: NodeComponentProps
  updateNodeData: (id: string, data: Partial<NodeDataProps>) => void
  handlePlay?: () => void
  handleDelay?: () => void
  variableData?: Array<VariableDataProps>
  characters?: Array<string>
  fieldData?: Array<FieldPropertiesType>
  onClose?: () => void
  handleExtendWindow?: () => void
  isOpenModal?: boolean
}
export interface AgentNodePanelProps {
  selectedNode: AgentNodeComponentProps
  updateNodeData: (id: string, data: NodePropertiesType) => void
  onClose?: (enableLoad?: boolean) => void
  submitUpdate: (data: UpdateNodeRequestType) => Promise<void>
}

export interface ColorOption {
  color: string
  label: string
}

export interface CertificateFilesProp {
  cert: File | null
  key: File | null
}

export interface ToggleProps {
  checked: boolean
  onChange: (value: boolean) => void
}

export interface CommentInputProps {
  onSubmit: (content: string) => void
  placeholder: string
}

export interface JavaScriptEditorProp {
  code: string | undefined
  onChange?: OnChange | undefined
  onBlur: () => void
}

export interface ConditionBuilderProp {
  conditions: NodeDataConditionType[]
  variableData?: VariableDataProps[]
  onAddCondition: () => void
  onRemoveCondition: (id: string) => void
  onUpdatePath: (updatedPath: NodeDataPathType) => void
  handleSubmit: () => void
  selectedPath: NodeDataPathType
  onUpdateCondition: (id: string, newCondition: NodeDataConditionType) => void
}

export interface VariantPanelProps {
  variableData: VariableDataProps[]
  functionData: FunctionDataProps[]
  setVariableData: Dispatch<SetStateAction<VariableDataProps[]>>
}

export interface FunctionPanelProps {
  functionData: FunctionDataProps[]
  setFunctionData: Dispatch<SetStateAction<FunctionDataProps[]>>
}

export interface AddVariableProps {
  showVariableModal: boolean
  setShowVariableModal: Dispatch<SetStateAction<boolean>>
  variableData: VariableDataProps[]
  functionData: FunctionDataProps[]
  setVariableData: Dispatch<SetStateAction<VariableDataProps[]>>
  selectedVariable: VariableDataProps | null
}

export interface CreateFieldProps {
  showModal: boolean
  setShowModal: Dispatch<SetStateAction<boolean>>
  selectedField: FieldDataProps | null
}

export interface ConfirmDialogProps {
  title?: string
  description?: string
  isOpen: boolean
  loading?: boolean
  isDelete?: boolean
  onClose: () => void
  onConfirm: () => void
}

export type BaseSlateElement = {
  type: string
  children: CustomSlateText[]
}

type CustomElement = BaseSlateElement | ParagraphElement | MentionElement

type CustomSlateText = {
  bold?: boolean
  italic?: boolean
  code?: boolean
  text: string
}

declare module 'slate' {
  interface CustomTypes {
    Element: CustomElement
    Text: CustomSlateText
  }
}

export type MentionElement = {
  type: 'mention'
  character: string
  children: CustomSlateText[]
}

type ParagraphElement = {
  type: 'paragraph'
  children: (CustomSlateText | MentionElement)[]
}

export interface EditorInputProps {
  // value: string
  value: Descendant[] | string
  placeholder?: string
  characters?: string[]
  onChange?: (value: string) => void
  readOnly?: boolean | undefined
  onBlur?: () => void
  className?: string
  checkMention?: boolean
}

export interface AgentChatProps {
  userId: string
  url: string
}

export interface NewFlowType {
  name: string
  properties: FlowPropertiesType
}

export interface UpdateFlowRequest {
  data: NewFlowType
  flowId: string
}
export interface DuplicateFlowRequest {
  data: { name: string }
  flowId: string
}

export interface BaseRequest {
  flowId: string
}

export interface EntityRequest extends BaseRequest {
  id: string
}

export type DIALOG_TYPE = 'delete' | 'create' | 'update' | 'none'

export type NODE_CREATE_TYPE =
  | 'COLLECTION'
  | 'LIST_COLLECTION'
  | 'DECISION'
  | 'FOLLOW_UP_QUESTION'
  | 'BUTTON_DECISION'
  | 'API'
  | 'CONDITION'
  | 'SPEAK'
  | 'ENDING'

export enum BodyTypeEnum {
  FORM_DATA = 'FORM-DATA',
  URL_ENCODED = 'URL-ENCODED',
  RAW = 'RAW',
}
export interface CreateEntityRequest<T> extends BaseRequest {
  data: {
    properties: T
  }
}
export interface CreateEdgeRequest<T> extends BaseRequest {
  data: T
}
export interface CreateNodeExitRequest {
  flowId: string
  nodeId: string
  showToast?: boolean
  data: {
    node_type?: NODE_CREATE_TYPE
    properties: NodeExitPropertiesType
  }
}

export interface UpdateNodeExitRequest extends CreateNodeExitRequest {
  nodeExitId: string
}

export interface NodeExitPropertiesType {
  name: string
  value: string
  description?: string
  condition?: ConditionType
}

export interface DeleteNodeExitRequest {
  flowId: string
  nodeId: string
  nodeExitId: string
}

export interface AgentBuilderPropertiesType {
  position: PositionXYProp
}
export interface CreateNodeRequest extends BaseRequest {
  data: {
    properties: NodePropertiesType
    type: NODE_CREATE_TYPE
    agent_builder_properties: AgentBuilderPropertiesType
  }
}
export interface CreateEndingNodeRequest {
  flowId: string
  position: PositionXYProp
}

export interface UpdateNodeRequestType {
  flowId: string
  nodeId: string
  data: {
    properties: NodePropertiesType
    type: NODE_CREATE_TYPE
    agent_builder_properties: AgentBuilderPropertiesType
  }
  showToast?: boolean
}
export interface UpdateFieldRequestType {
  flowId: string
  fieldId: string
  data: {
    properties: Partial<FieldPropertiesType>
  }
}

export interface FieldsToCollectGroup {
  name: string
  required: 'none' | 'all' | 'any'
  fields_to_collect: string[]
}

export interface NodePropertiesType {
  name?: string
  rules_to_remember?: string[]
  fields_to_collect_groups?: FieldsToCollectGroup[]
  how_to_ask?: string
  general_instructions?: string
  question_for_user?: string
  is_root_node?: boolean
  use_mock?: string
  mock_response?: string
  what_to_say?: string
  how_to_say_it?: string
  use_descriptions?: boolean
  [key: string]: any
}

export interface ConditionItemType {
  field: string | null
  operator: string | null
  values: (string | number | boolean | null)[]
  logic?: string
  conditions?: ConditionItemType[]
  fieldType?: string
}
export interface ConditionType {
  id?: string
  logic?: string
  conditions?: ConditionItemType[]
}

export interface CleanedConditionType {
  // For condition groups
  logic?: string
  conditions?: ConditionItemType[]
  // For single conditions (when conditions array has exactly one item)
  field?: string | null
  operator?: string
  values?: (string | number)[]
}

export interface CreateEdgePropertiesType {
  node_exit_id: string
  child_node_id: string
}

export interface EdgePropertiesType extends CreateEdgePropertiesType {
  id: string
  created_at: string
  flow_id: string
}

export interface NodeDataType {
  id: string
  created_at: string
  properties: NodePropertiesType
  agent_builder_properties: AgentBuilderPropertiesType
  type: NODE_CREATE_TYPE
  flow_id: string
}

export interface AgentDialogType {
  open: boolean
  type: 'node' | 'edge' | 'unsaved' | ''
  action: 'delete' | 'expand' | 'close' | ''
  id: string
}

export interface PositionChange {
  type: 'position'
  dragging: boolean
  position: PositionXYProp
}

export type AddFlowModalActionProp = 'duplicate' | 'edit' | 'add' | 'none'

export interface AddFlowModalProp {
  status: boolean
  action: AddFlowModalActionProp
}

export interface BodyDataItem {
  key: string
  value: string
}

export interface CaptureResponseItem {
  key: string
  field_name: string
}

export type SectionType =
  | 'headers'
  | 'url_params'
  | 'body_data'
  | 'capture_response'

export interface BaseNodeProps extends AgentNodeComponentProps {
  Icon: IconType
  bgColor?: string
  borderColor?: string
  titleLabel?: string
  defaultMessage?: string
  targetHandlePosition?: {
    top?: string
    left?: string
  }
  children?: ReactNode
  showDefaultContent?: boolean
  handleSourcePosition?: {
    top?: string
    right?: string
  }
}

export interface InfoDisplayProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children?: ReactNode
}

export type agentFieldTypeEnum =
  | ''
  | 'int'
  | 'str'
  | 'email'
  | 'bool'
  | 'date'
  | 'pdf'
  | 'picture'
  | 'list'

export interface AgentFieldType {
  id: string
  value: agentFieldTypeEnum
  label: string
}

export type TransformMethodEnum = '' | 'llm' | 'mapping'

export interface TransformMethodType {
  id: string
  value: TransformMethodEnum
  label: string
}

export interface FieldValidValue {
  value: string
  transformed_value: string
}

export interface FieldValidValueCSVRow {
  values: string
  transformed_values: string
}

export type FlowGuidelineReactionType = 'Go to Node X' | 'Say X'

export interface FlowGuideline {
  name: string
  description: string
  reaction_type: FlowGuidelineReactionType
  all_nodes: boolean
  nodes_list?: string[]
  what_to_say?: string
  destination_node_id?: string
}

export interface CreateGuidelineProps {
  showModal: boolean
  setShowModal: Dispatch<SetStateAction<boolean>>
  selectedGuideline: FlowGuideline | null
}

export type BuilderFieldListItem = 'str' | 'int' | 'float' | 'file' | 'picture'
