export interface DateEntry {
  name: string;
  label: string;
  value?: number;
  total?: number;
}

export interface ResponseData {
  [key: string]: DateEntry[];
}

export interface AnsweredUnansweredData {
  [key: string]: Array<{
    name: string;
    "Answered Questions": number;
    "Unanswered Questions": number;
  }>;
}

type RatingCount = { [rating: string]: number };
export type UserRatingData = { [monthYear: string]: RatingCount };

export interface MessageReactionsChartData {
  [key: string]: Array<{
    name: string;
    Likes: number;
    Dislikes: number;
  }>;
}

export type GroupingType = 'daily' | 'weekly' | 'monthly'