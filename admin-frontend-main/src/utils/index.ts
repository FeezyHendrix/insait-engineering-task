import { ChatStatusType, NameValueType } from "@/types/chart";
import { OrderSortType } from "@/types/chat";
import { ChatDataTableBodyType, CompletionTableBodyType, ObjectType } from "@/types/dashboard";
import type { KnowledgeItem } from "@/lib/types";
import { UnansweredQsType } from "@/types/unansweredQs";
import { toast } from "react-toastify";

export const formatNestedError = (errors: object) => {
  return Object.values(errors).reduce((result, error) => result.concat(`\n ${error[0]}`), '');
};

export const formatValidationError = (jsonErrors: Record<string, any>): string => {
  let errorMessage = '';
  
  const processErrorObject = (obj: Record<string, any>, parentPath: string = ''): void => {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = parentPath ? `${parentPath}.${key}` : key;
      
      if (Array.isArray(value) && value.length > 0) {
        const errorText = value.join('; ');
        errorMessage += errorMessage ? '\n' : '';
        errorMessage += `${errorText} - ${currentPath}.`;
      } else if (value && typeof value === 'object') {
        processErrorObject(value, currentPath);
      } else if (value) {
        errorMessage += errorMessage ? '\n' : '';
        errorMessage += `${value} - ${currentPath}.`;
      }
    }
  };
  
  processErrorObject(jsonErrors);
  return errorMessage;
}

export const handleNetworkError = (e: any): string => {
  let message: string = e.response?.data?.message || e.response?.data?.error || 'Something went wrong';
  

  if (e.response?.data?.errors) {
    message = formatNestedError(e.response?.data?.errors);
  }

  if (e.response?.data?.detail?.json) {
    message = formatValidationError(e.response.data.detail.json);
  }

  return message;
}

export const toastError = (error: any) => {
  toast.error(error?.message || "Something went wrong")
}

export const sortData = (arr: [number, number][]) => {
  const result = arr
    .slice()
    .sort((a: [number, number], b: [number, number]) => a[0] - b[0])
  return result;
}

export const sortFunnelData = (arr: { value: number }[]) => {
  const result = arr
    .slice()
    .sort((a, b) => b.value - a.value)
  return result;
}

export const checkIfActiveArrray = (arr: any): boolean => {
  return Array.isArray(arr) && arr.length > 0
}

export const sliceDateData = (data: NameValueType[], month: string): NameValueType[] => {
  const monthsInAYear = 12;
  const givenMonth = parseInt(month.split('-')[0]);
  if (givenMonth < 0 || givenMonth >= monthsInAYear || data?.length < 48) {
    return data;
  }
  let startIndex;
  let endIndex

  if (endIndex && endIndex > data.length) {
    return data.slice(startIndex);
  }

  return data.slice(startIndex, endIndex);
}

export const sliceDateDataUserReturn = (data: NameValueType[], month: string): NameValueType[] => {
  const monthsInAYear = 12;
  const givenMonth = parseInt(month.split('-')[0]);
  const givenYear = parseInt(month.split('-')[1]);
  if (givenMonth < 0 || givenMonth >= monthsInAYear || data?.length < 48) {
    return data;
  }
  const earliestYear = data[0];
  let startIndex;
  let endIndex
  if (earliestYear.hasOwnProperty('year')) {
    const weeksPerMonth = 4;
    startIndex = data.findIndex(item => item.month === givenMonth && item.year === givenYear);
    endIndex = startIndex + weeksPerMonth * 3;
  }

  if (endIndex && endIndex > data.length) {
    return data.slice(startIndex);
  }

  return data.slice(startIndex, endIndex);
}

export const findLargestValue = (arr: number[] | undefined): number => {
  if (!Array.isArray(arr) || arr.length === 0) {
    return -1;
  }

  let maxSum = Math.max(...arr);
  return arr.findIndex(item => item === maxSum);
}


export const handleValue = (key: string, value: string, setValue: React.Dispatch<React.SetStateAction<any>>) => {
  return setValue((prev: ObjectType) => ({
    ...prev,
    [key]: value
  }))
}


export const getChatStatus = (chartVal: string): ChatStatusType | null => {
  const value = chartVal?.toLowerCase();

  if (value && value.includes('drop')) {
    return "dropOff";
  }
  if (value && value.includes('customer')) {
    return "customerService";
  }
  if (value && value.includes('completion')) {
    return "completion";
  }
  return null;


}

export const getHeaderTitle = (value: string): string => {
  if (value.startsWith('/unanswered-questions')) {
    if (value.includes('/popular')) {
      return 'menu.unanswered-questions.popular'
    }
    if (value.includes('/unanswered')) {
      return 'menu.unanswered-questions.unanswered'
    }
    return 'menu.questions-analytics'
  }

  switch (value) {
    case "/":
      return 'menu.dashboard'
    case "/analytics":
      return 'menu.advancedAnalytics'
    case "/agent-builder":
      return 'menu.agentBuilder'
    case "/live-chat":
      return 'menu.liveConversation'
    case "/message-rating":
      return 'menu.messageRating'
    case "/knowledge-base":
      return 'menu.knowledge'
    case "/security-violation-messages":
      return 'menu.securityViolationMessages'
    case "/ab-testing":
      return 'menu.abTesting'
    case "/completed-sessions":
      return "menu.completedSessions"
    case "/settings":
      return "menu.settings"
    case "/support/":
      return "menu.contactSupport"
    case "/feedback":
      return "menu.chatFeedback"
    case "/batch":
      return "menu.batchSend"
    case "/security-violation-messages":
      return "menu.securityViolation"
    case "/bot-builder":
      return "menu.agentBuilder"
    case "/login-preferences":
      return "menu.loginPreferences"
    case "/knowledge-hub":
      return "menu.knowledgeHub"
    default:
      return `menu.${value.replace(/\//g, '')}`
  }
}

export const stableSort = <T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
): T[] => {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) {
      return order
    }
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}

export const handleSortByType = (aValue: number | string, bValue: number | string, order: OrderSortType) => {
  
  if (typeof aValue === 'number' && typeof bValue === 'number') {
    return order === 'asc' ? aValue - bValue : bValue - aValue
  }
  
  const aDate = new Date(aValue).getTime()
  const bDate = new Date(bValue).getTime()

  const isADateValid = !isNaN(aDate)
  const isBDateValid = !isNaN(bDate)

  if (isADateValid && isBDateValid) {
    return order === 'asc' ? aDate - bDate : bDate - aDate
  }

  if (order === 'asc') {
    return String(aValue).localeCompare(String(bValue)) || 0
  } else {
    return String(bValue).localeCompare(String(aValue)) || 0
  }
}

export const handleSearchChatTable = (
  data: CompletionTableBodyType[],
  searchQuery: string
) => {
  if (searchQuery.length === 0) return data
    return data.filter((item) => {
      const userMatch = item.user.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
      const endStatusMatch = (item.endStatus)
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
      const chatIdMatch = (item.chatId)
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
      const productMatch = item.product.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
      const messagesMatch = item?.messages?.some((message) =>
        message.text.toLowerCase().includes(searchQuery.toLowerCase())
      )
      return (
        userMatch ||
        endStatusMatch ||
        productMatch ||
        chatIdMatch ||
        messagesMatch
      )
    })
}

export const handleSearchChatDataTable = (
  data: ChatDataTableBodyType[],
  searchQuery: string
) => {
      if (searchQuery.length === 0) return data
      const lowerCaseQuery = searchQuery.toLowerCase()
      return data.filter((item) => {
      const dataObjectMatch = JSON.stringify(item.dataObject)
        .toLowerCase()
        .includes(lowerCaseQuery)
      const chatIdMatch = item.chatId
        .toLowerCase()
        .includes(lowerCaseQuery)
      const userIdMatch = item.userId
        .toLowerCase()
        .includes(lowerCaseQuery)
      return (
        dataObjectMatch ||
        chatIdMatch ||
        userIdMatch
      )
    })
}

export const handleCopyText = async (text: string) => {
  if (navigator?.clipboard) {
    await navigator.clipboard.writeText(text)
  } else {
    // Fallback method when navigator.clipboard is not available
    const textField = document.createElement('textarea')
    textField.innerText = text
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()
  }
}

export const calculatePercentagePortion = (total: number, unit: number): number => {
  return Number(total === 0 ? 0 : ((unit / total) * 100).toFixed(0));
}
export const formatUnansweredQuestionData = (data: UnansweredQsType[]) => {
  return data
    .sort((a, b) => {
      if (a.archive && !b.archive) {
        return 1
      } else if (!a.archive && b.archive) {
        return -1
      } else {
        return 0
      }
    })
}

export const getEllipsisForLongText = (text: string) => {
  return text.length > 10 ? `${text.slice(0, 10)}...` : text
}


export const getErrorMessage = (error: unknown): string | null => {
  if (typeof error === 'object' && error !== null && 'message' in error && typeof (error).message === 'string') {
    return (error as any).message;
  }
  return null;
};

export const getFileType = (url: string): string => {

  const knownExtensions = {
    image: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
    video: ['mp4', 'webm', 'ogg', 'quicktime', 'mov', 'mpeg', 'avi'],
    pdf: ['pdf'],
  }

  const fileExtension = url.split('.').pop()?.split('?')[0]?.toLowerCase();

  if (!fileExtension) {
    return 'unknown'
  }

  for (const [type, extensions] of Object.entries(knownExtensions)) {
    if (extensions.includes(fileExtension)) {
      return type;
    }
  }

  return 'unknown';
}

export const base64ToFile = (
  base64Data: string,
  fileName: string,
  type = 'application/pdf'
) => {
  const byteString = atob(base64Data.split(',')[1])
  const byteArray = new Uint8Array(byteString.length)

  for (let i = 0; i < byteString.length; i++) {
    byteArray[i] = byteString.charCodeAt(i)
  }
  const blob = new Blob([byteArray], { type })
  const file = new File([blob], fileName, { type })
  return file
}

export const isPrimitiveValue = (val: unknown): val is string | number =>
  typeof val === 'string' || typeof val === 'number';

export const addCountryCode = (phone: string, countryCode: string): string => {
  if (!phone) return phone;
  if (!countryCode) return phone;
  return `+${countryCode}${phone.replace(/^0+/, '')}`;
};

export const normalizeMenuLink = (path: string) => {
  return path === '/' ? '/' : path.replace('/*', '').replace(/\/$/, '');
};

export const getKnowledgeValueBasedOnType = (value: string) => {
  return value === 'crawling' ? 'URL' : value
}

export const getSourceTypeValue = (
  item: KnowledgeItem | "document" | "qa" | "all" | "link"
): string => {
  if (typeof item === "string") return item;
  if ("question" in item && item.question) return item.question;
  if ("name" in item && item.name) return item.name;
  if ("url" in item && typeof item.url === "string") return item.url;
  return "unknown";
};

export const fixFileNameEncoding = (originalname: string) => {
  try {
    const isEncoded = originalname.includes('×') || /%[0-9A-F]{2}/i.test(originalname)
    if (isEncoded) {
      const decodedName = decodeURIComponent(escape(originalname))
      return decodedName
    }
    return originalname
  } catch (error) {
    return originalname
  }
}

const isDashboardRoute = (path: string) => {
  return path === '/' || path === '/dashboard';
};

export const isLinkActive = (link: string, pathname: string): boolean => {
  if (isDashboardRoute(link) && isDashboardRoute(pathname)) {
    return true;
  }
  return pathname === link;
};

export const getDirFromLang = (lang: string) => {
  return lang=== 'he' ? 'rtl' : 'ltr'
}

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};