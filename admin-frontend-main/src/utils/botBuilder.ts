import {
  AgentFieldType,
  AgentNodeComponentProps,
  BuilderFieldListItem,
  CleanedConditionType,
  ConditionItemType,
  ConditionType,
  FieldDataProps,
  MenuItemsDataProps,
  NODE_CREATE_TYPE,
  NodeComponentProps,
  NodeDataProps,
  NodePropertiesType,
  PositionXYProp,
  TransformMethodType,
} from '@/types/agent-builder'
import { MarkerType } from '@xyflow/react'
import axios, { AxiosRequestConfig } from 'axios'
import { Descendant } from 'slate'
import {
  FiMessageCircle,
  FiSmile,
  FiMessageSquare,
  FiGitBranch,
  FiToggleRight,
  FiCode,
  FiImage,
  FiFile,
  FiUpload,
} from 'react-icons/fi'
import { AiFillApi } from 'react-icons/ai'
import { RiColorFilterAiLine, RiSpeakLine } from 'react-icons/ri'
import { FaRegCommentDots } from 'react-icons/fa'
import { BiSolidCarousel } from 'react-icons/bi'
import { GiChoice } from 'react-icons/gi'
import { CiStopSign1 } from 'react-icons/ci'

export const generateNewNode = (
  nodeType: 'Message' | 'Collection' | string,
  count: number,
  position: PositionXYProp,
  nodesLength: number = 0,
  label: string = `${nodeType} ${count}`,
  message: string = ''
): NodeComponentProps => {
  return {
    id: Date.now().toString(),
    type: nodeType,
    position,
    updateNodeData: () => {
      /* empty */
    },
    data: {
      label,
      message,
      isFirstNodeType: count === 1,
      isFirstNode: nodesLength === 0,
    },
  }
}
export const generateAgentNewNode = (
  nodeType: NODE_CREATE_TYPE | string,
  count: number,
  position: PositionXYProp,
  label: string = `${nodeType} ${count}`
): AgentNodeComponentProps => {
  const data: NodePropertiesType = {}
  if (
    nodeType === 'COLLECTION' ||
    nodeType === 'DECISION' ||
    nodeType === 'BUTTON_DECISION' ||
    nodeType === 'CONDITION'
  ) {
    data.name = label
    data.general_instructions = ''
    data.how_to_ask = ''
    data.is_root_node = false
    data.rules_to_remember = []
  }
  if (nodeType === 'DECISION' || nodeType === 'BUTTON_DECISION') {
    data.question_for_user = ''
  }
  if (nodeType === 'SPEAK' || nodeType === 'ENDING') {
    data.name = label
  }

  return {
    id: Date.now().toString(),
    type: nodeType as NODE_CREATE_TYPE,
    position,
    updateNodeData: () => {
      /* empty */
    },
    data,
  }
}

export const generateInitialFlowNode = () => {
  return [
    generateNewNode(
      'Message',
      1,
      { x: 20, y: 20 },
      0,
      `Starting Message`,
      `This is the beginning of the conversation`
    ),
  ]
}

export const edgeConfig = {
  type: 'smoothstep',
  markerEnd: {
    type: MarkerType.Arrow,
    markerUnits: 'userSpaceOnUse',
    width: 20,
    height: 20,
  },
}

export const defaultAgentBotViewPort = {
  x: 100,
  y: 100,
  zoom: 0.8,
}

export const agentBuilderColorSelectionOption = [
  { color: '#a1c972', label: '1' },
  { color: '#f3dcf0', label: '2' },
  { color: '#ffd4de', label: '3' },
  { color: '#caead5', label: '4' },
]

export const generalAgentVariableType = [
  { id: '1', value: 'date', label: 'Date' },
  { id: '2', value: 'number', label: 'Number' },
  { id: '3', value: 'category', label: 'Category' },
  { id: '4', value: 'string', label: 'String' },
  { id: '5', value: 'url', label: 'URL' },
  { id: '6', value: 'currency', label: 'Currency' },
  { id: '7', value: 'list', label: 'List' },
]

export const agentFieldType: AgentFieldType[] = [
  { id: '0', value: '', label: 'Select type' },
  { id: '1', value: 'int', label: 'Number' },
  { id: '2', value: 'str', label: 'String' },
  { id: '3', value: 'email', label: 'Email' },
  { id: '4', value: 'bool', label: 'Boolean' },
  { id: '5', value: 'date', label: 'Date' },
  { id: '6', value: 'pdf', label: 'PDF' },
  { id: '7', value: 'picture', label: 'Picture' },
  { id: '8', value: 'list', label: 'List' },
]

export const agentAPIMethods = [
  { id: '0', value: '', label: 'Method' },
  { id: '1', value: 'GET', label: 'GET' },
  { id: '2', value: 'POST', label: 'POST' },
  { id: '3', value: 'PUT', label: 'PUT' },
  { id: '4', value: 'DELETE', label: 'DELETE' },
]

export const rgbToHex = (rgb: string): string => {
  const result = rgb.match(/\d+/g)
  if (!result || result.length !== 3) return ''
  const r = parseInt(result[0]).toString(16).padStart(2, '0')
  const g = parseInt(result[1]).toString(16).padStart(2, '0')
  const b = parseInt(result[2]).toString(16).padStart(2, '0')
  return `#${r}${g}${b}`
}

export const testRequest = async (nodeData: NodeDataProps) => {
  try {
    const config: AxiosRequestConfig = {
      method: nodeData?.method || 'GET',
      url: nodeData?.url,
      headers: Object.fromEntries(
        nodeData?.headers?.map((h) => [h.key, h.value]) || []
      ),
      params: Object.fromEntries(
        nodeData?.parameters?.map((p) => [p.key, p.value]) || []
      ),
    }

    if (nodeData?.method !== 'GET' && nodeData?.bodyType) {
      if (nodeData.bodyType === 'raw') {
        try {
          config.data = JSON.parse(nodeData.jsonResponse || '{}')
        } catch (e) {
          return { status: false, message: 'Invalid JSON in request body' }
        }
      } else {
        config.data = Object.fromEntries(
          nodeData?.body?.map((b: any) => [b.key, b.value]) || []
        )
      }
    }

    const response = await axios(config)
    return { status: true, message: 'API test successful', data: response.data }
  } catch (error: any) {
    return {
      status: false,
      message:
        error.response?.data?.message || error.message || 'API test failed',
    }
  }
}

export const generateSwaggerSpec = (nodeData: NodeDataProps) => {
  const spec = {
    openapi: '3.0.0',
    info: {
      title: nodeData?.label || 'API Specification',
      version: '1.0.0',
    },
    paths: {
      [nodeData?.url || '/']: {
        [nodeData?.method?.toLowerCase() || 'get']: {
          summary: nodeData?.label,
          parameters: [
            ...(nodeData?.parameters?.map((param) => ({
              name: param.key,
              in: 'query',
              required: true,
              schema: { type: 'string' },
            })) || []),
            ...(nodeData?.headers?.map((header) => ({
              name: header.key,
              in: 'header',
              required: true,
              schema: { type: 'string' },
            })) || []),
          ],
          ...(nodeData?.bodyType && {
            requestBody: {
              content: {
                [nodeData.bodyType === 'raw'
                  ? 'application/json'
                  : nodeData.bodyType === 'formData'
                  ? 'multipart/form-data'
                  : 'application/x-www-form-urlencoded']: {
                  schema: {
                    type: 'object',
                    properties: Object.fromEntries(
                      (nodeData?.body || []).map((field) => [
                        field.key,
                        { type: 'string' },
                      ])
                    ),
                  },
                },
              },
            },
          }),
          responses: {
            200: {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: Object.fromEntries(
                      (nodeData?.responses || []).map((resp) => [
                        resp.key,
                        { type: 'string' },
                      ])
                    ),
                  },
                },
              },
            },
          },
        },
      },
    },
  }
  return spec
}

export const downloadSpec = (spec: any, fileName: string) => {
  const blob = new Blob([JSON.stringify(spec, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export const generateInitialSlateMessage = (text: string = '') => {
  const message: Descendant[] = [
    {
      type: 'paragraph',
      children: [{ text }],
    },
  ]
  return message
}

const isDescendantArray = (value: unknown): value is Descendant[] => {
  return (
    Array.isArray(value) &&
    value.every(
      (node: unknown) =>
        typeof node === 'object' &&
        node !== null &&
        'type' in node &&
        typeof (node as any).type === 'string'
    )
  )
}

export const parseEditorValue = (
  value: string | Descendant[] | undefined
): Descendant[] => {
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return isDescendantArray(parsed) ? parsed : generateInitialSlateMessage()
    } catch (error) {
      return generateInitialSlateMessage(value)
    }
  }

  return isDescendantArray(value) ? value : generateInitialSlateMessage()
}

export const isEmptySlateValue = (value: unknown): boolean => {
  try {
    if (!value) return true
    const parsed = typeof value === 'string' ? JSON.parse(value) : value

    return (
      Array.isArray(parsed) &&
      parsed.length === 1 &&
      parsed[0].type === 'paragraph' &&
      Array.isArray(parsed[0].children) &&
      parsed[0].children.length === 1 &&
      parsed[0].children[0].text.trim() === ''
    )
  } catch {
    return false
  }
}

export const validateName = (
  input: string,
  existingNames: string[],
  currentName?: string
): { isValid: boolean; error?: string } => {
  if (!input.trim()) {
    return { isValid: false, error: 'Name cannot be empty' }
  }

  const isNameChanged = currentName && currentName !== input
  const isUnique = isNameChanged ? !existingNames.includes(input) : true
  const startsWithLetter = /^[a-zA-Z]/.test(input)
  const noSpaces = !/\s/.test(input)
  const isSnakeCase = /^[a-zA-Z][a-zA-Z0-9_]*$/.test(input)

  if (!startsWithLetter) {
    return { isValid: false, error: 'Name must start with a letter.' }
  }

  if (!noSpaces) {
    return { isValid: false, error: 'Name must not contain spaces.' }
  }

  if (!isSnakeCase) {
    return {
      isValid: false,
      error: 'Name must use underscores and alphanumeric characters only.',
    }
  }

  if (!isUnique) {
    return { isValid: false, error: 'Name must be unique.' }
  }

  return { isValid: true }
}

export const demoMenu: MenuItemsDataProps = {
  talk: {
    icon: FiMessageCircle,
    label: 'Talk',
    options: [
      {
        id: 1,
        label: 'Message node',
        value: 'Message',
        icon: FiMessageSquare,
      },
      {
        id: 2,
        label: 'Transition node',
        value: 'Transition',
        icon: RiColorFilterAiLine,
      },
      { id: 4, label: 'API', value: 'API', icon: AiFillApi },
      { id: 7, label: 'Javascript', value: 'Javascript', icon: FiCode },
      { id: 8, label: 'Image Node', value: 'Image', icon: FiImage },
      { id: 9, label: 'File Node', value: 'File', icon: FiFile },
      { id: 16, label: 'Condition', value: 'Condition', icon: FiGitBranch },
      { id: 17, label: 'Carousel', value: 'Carousel', icon: BiSolidCarousel },
    ],
  },
  listen: {
    icon: FiSmile,
    label: 'Listen',
    options: [
      {
        id: 3,
        label: 'Collection Node',
        value: 'Collection',
        icon: FaRegCommentDots,
      },
      { id: 5, label: 'Buttons', value: 'Buttons', icon: FiToggleRight },
      {
        id: 10,
        label: 'Client Upload Node',
        value: 'ClientUpload',
        icon: FiUpload,
      },
    ],
  },
}

export const agentBuilderMenuOptions: MenuItemsDataProps = {
  talk: {
    icon: FiMessageCircle,
    label: 'Talk',
    options: [
      { id: 1, label: 'Condition', value: 'CONDITION', icon: FiGitBranch },
      { id: 2, label: 'API', value: 'API', icon: AiFillApi },
      {
        id: 3,
        label: 'Speak',
        value: 'SPEAK',
        icon: RiSpeakLine,
      },
    ],
  },
  listen: {
    icon: FiSmile,
    label: 'Listen',
    options: [
      {
        id: 1,
        label: 'Collection',
        value: 'COLLECTION',
        icon: FaRegCommentDots,
      },
      { id: 2, label: 'Decision', value: 'DECISION', icon: GiChoice },
      {
        id: 3,
        label: 'Buttons',
        value: 'BUTTON_DECISION',
        icon: FiToggleRight,
      },
      {
        id: 5,
        label: 'End',
        value: 'ENDING',
        icon: CiStopSign1,
      },
    ],
  },
}

export const getNodePosition = (index: number, position?: PositionXYProp) => {
  const defaultPosition = {
    x: 250 * (index + 1) - 50,
    y: 100 * (index + 1),
  }

  return position ?? defaultPosition
}

export const countrySelectionOptions = [
  { label: 'ISRAEL', value: 'ISRAEL' },
  { label: 'USA', value: 'USA' },
  { label: 'AUSTRALIA', value: 'AUSTRALIA' },
]

export const dateFormatSelectionOptions = [
  { label: 'Select Option', value: '' },
  { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
  { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
  { label: 'YYYY/MM/DD', value: 'YYYY/MM/DD' },
  { label: 'DD-MM-YYYY', value: 'DD-MM-YYYY' },
  { label: 'MM-DD-YYYY', value: 'MM-DD-YYYY' },
  { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
  { label: 'Month DD, YYYY', value: 'Month DD, YYYY' },
  { label: 'DD Month, YYYY', value: 'DD Month, YYYY' },
]

export const timeFormatSelectionOptions = [
  { label: 'Select Option', value: '' },
  { label: '12 hr', value: '12 hr' },
  { label: '24 hr', value: '24 hr' },
]

export const OPERATORS = {
  EQUALS: '==',
  NOT_EQUALS: '!=',
  GREATER_THAN: '>',
  LESS_THAN: '<',
  GREATER_THAN_EQUAL: '>=',
  LESS_THAN_EQUAL: '<=',
  IN: 'in',
  NOT_IN: 'not in',
}

export const LOGIC_OPERATORS = {
  AND: 'AND',
  OR: 'OR',
}

export const createEmptyCondition = (): ConditionType => ({
  conditions: [
    {
      field: null,
      operator: null,
      values: [],
    },
  ],
})

export const generateConditionText = (
  condition?: ConditionItemType | ConditionType | null
): string => {
  if (!condition) return 'Empty Condition'

  let result = ''

  if ('field' in condition) {
    if (!condition.field) return 'Empty Condition'
    if (!condition.operator) return 'Invalid Condition (Missing Operator)'

    const values = condition.values?.join(', ') || ''
    result = `${condition.field} ${condition.operator} ${values}`
  }

  // Handle nested conditions (both types)
  if (condition.conditions && condition.conditions.length > 0) {
    const nestedTexts = condition.conditions.map((c) =>
      generateConditionText(c)
    )

    if (result) {
      return `(${result} ${condition.logic || 'AND'} ${nestedTexts.join(
        ` ${condition.logic || 'AND'} `
      )})`
    } else {
      return `(${nestedTexts.join(` ${condition.logic || 'AND'} `)})`
    }
  }

  return result || 'Empty Condition'
}

export const getOperatorsForFieldType = (fieldType: string) => {
  const allOperators = [
    { value: OPERATORS.EQUALS, label: 'equals' },
    { value: OPERATORS.NOT_EQUALS, label: 'not equals' },
  ]

  if (fieldType === 'int') {
    return [
      ...allOperators,
      { value: OPERATORS.GREATER_THAN, label: 'greater than' },
      { value: OPERATORS.LESS_THAN, label: 'less than' },
      { value: OPERATORS.GREATER_THAN_EQUAL, label: 'greater than or equal' },
      { value: OPERATORS.LESS_THAN_EQUAL, label: 'less than or equal' },
    ]
  } else {
    return [
      ...allOperators,
      { value: OPERATORS.IN, label: 'in' },
      { value: OPERATORS.NOT_IN, label: 'not in' },
    ]
  }
}

export const cleanCondition = (condition: ConditionType) => {
  const { id, ...cleanedCondition } = condition

  if (cleanedCondition.conditions) {
    cleanedCondition.conditions = cleanedCondition.conditions.map((item) => {
      const { fieldType, ...cleanedItem } = item
      return cleanedItem
    })

    if (cleanedCondition.conditions.length === 1) {
      const singleCondition = cleanedCondition.conditions[0]
      delete cleanedCondition.conditions
      delete cleanedCondition.logic

      Object.assign(cleanedCondition, singleCondition)
    }
  }

  return cleanedCondition
}

export const restoreCondition = (
  cleanedCondition: CleanedConditionType,
  fields?: FieldDataProps[]
): ConditionType => {
  if (cleanedCondition.field && cleanedCondition.operator) {
    return {
      conditions: [
        {
          field: cleanedCondition.field,
          operator: cleanedCondition.operator,
          values: cleanedCondition.values || [],
          fieldType: getFieldType(cleanedCondition.field, fields),
        },
        ...(cleanedCondition?.conditions ? cleanedCondition.conditions : []),
      ],
    }
  }

  if (cleanedCondition.conditions && fields) {
    return {
      ...cleanedCondition,
      conditions: cleanedCondition.conditions.map((condition) => ({
        ...condition,
        fieldType: getFieldType(condition?.field || '', fields),
      })),
    }
  }

  return cleanedCondition
}

const getFieldType = (fieldName: string, fields?: FieldDataProps[]): string => {
  if (!fields) return ''
  const field = fields.find((f) => f.properties.name === fieldName)
  return field ? field.properties.type : ''
}

export const extractMentionValue = (parsedContent: any[]): string | null => {
  for (const node of parsedContent) {
    if (!node.children) continue

    for (const child of node.children) {
      if (child.type === 'mention' && child.character) {
        return child.character
      }
    }
  }
  return null
}

export const extractPlainText = (parsedContent: any[]): string => {
  return parsedContent
    .map(
      (node: any) =>
        node.children?.map((child: any) => child.text || '').join('') || ''
    )
    .join('')
}

export const transformToEditorFormat = (
  field_name?: string,
  value?: string
): Descendant[] => {
  if (field_name) {
    return [
      {
        type: 'paragraph',
        children: [
          { text: '' },
          {
            type: 'mention',
            character: field_name,
            children: [{ text: '' }],
          },
          { text: '' },
        ],
      },
    ]
  }

  if (value) {
    return [
      {
        type: 'paragraph',
        children: [{ text: value }],
      },
    ]
  }

  return [
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ]
}

export const transformMethods: TransformMethodType[] = [
  { id: '0', value: '', label: 'Select Method' },
  { id: '1', value: 'llm', label: 'LLM' },
  { id: '2', value: 'mapping', label: 'Mapping' },
]

export const builderListItemsType: {
  id: string
  value: BuilderFieldListItem
  label: string
}[] = [
  { id: '0', value: 'str', label: 'Select type' },
  { id: '1', value: 'int', label: 'Number' },
  { id: '2', value: 'float', label: 'Float' },
  { id: '3', value: 'file', label: 'File' },
  { id: '4', value: 'picture', label: 'Picture' },
]
