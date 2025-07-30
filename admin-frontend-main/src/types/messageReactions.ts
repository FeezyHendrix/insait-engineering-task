export interface MessageReaction {
    id: string;
    pov: string;
    file: any;
    text: string;
    time: string;
    rating: 'positive' | 'negative' | null;
    responseTime: number | null;
    user_comment: string | null;
}

export interface MessageReactionInfoType {
    thumbsUpMessages: MessageReaction[];
    thumbsDownMessages: MessageReaction[];
}

export interface MessageReactionInfoType {
    thumbsUpMessages: MessageReaction[];
    thumbsDownMessages: MessageReaction[];
}

export interface MessageReactionInfoModalType {
    chatId: string
    toggle: () => void
    isOpen: boolean
}
