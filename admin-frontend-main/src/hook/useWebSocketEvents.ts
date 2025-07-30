import { TransferredConversation } from '@/types/chat';
import { useEffect } from 'react';
import { socketUrl } from '@/utils/network';
import { socket } from '@/main';


export interface IEvent {
    name: string;
    handler : (...args: any[]) => void;
}


export const useWebSocketEvents = (events : IEvent[], selectedInbox  :TransferredConversation | null) => {
    useEffect(() => {
        for (const event of events){
            socket?.on(event.name, event.handler);
        }


        return () => {
            for (const event of events){
                socket?.off(event.name, event.handler);
            }
        }
    }, [selectedInbox]);
}