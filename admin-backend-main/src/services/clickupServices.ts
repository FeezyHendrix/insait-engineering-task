import { ClickupCustomItemsResponse, MulterFile, TaskData, TicketPriority, TicketRequestType, TicketTypeResponse } from "../types/interfaces";
import constants from '../constants';
import axios from "axios";
import logger from "../libs/pino";
import FormData from 'form-data';

export class ClickupServices {
    private headers: Record<string, string>;
    private clickupBaseUrl = `https://api.clickup.com`;
    private CLICKUP_BOARD_ID = 9018132889

    constructor( ){
        this.headers = {
            'Content-Type': 'application/json',
            'Authorization': constants.CLICKUP_API_KEY as string,
        };
    }

    public fetchClickupTicketTypes = async():Promise<ClickupCustomItemsResponse> =>{
        try {
            const response = await axios.get(
              `${this.clickupBaseUrl}/api/v2/team/${this.CLICKUP_BOARD_ID}/custom_item`,
              {
                headers: this.headers,
              }
            );                        
            return response.data;
        }catch(error){
            logger.error('Error fetching ClickUp Ticket Type:', error);
            throw error;
        }
    } ;

    public async attachFilesToTask(taskId: string, files: MulterFile[]): Promise<void> {
        for (const file of files) {
          try {
            const formData = new FormData();
            formData.append('attachment', file.buffer, {
              filename: file.originalname,
              contentType: 'application/octet-stream',
            });
      
            await axios.post(
              `${this.clickupBaseUrl}/api/v2/task/${taskId}/attachment`,
              formData,
              {
                headers: {
                  Authorization: constants.CLICKUP_API_KEY,
                  ...formData.getHeaders(),
                },
              }
            );
      
            logger.info(`Successfully attached ${file.originalname} to ClickUp task ${taskId}`);
          } catch (error) {
            logger.error(`Failed to attach file "${file.originalname}" to ClickUp task:`, error);
          }
        }
      }
      
}

export class Ticket {

    constructor(){
    }

    public async getTicketType(ticketTypeName: TicketRequestType| undefined, clickupService: ClickupServices):Promise<TicketTypeResponse | null>{
        try{
            if (!ticketTypeName) {
                logger.error("Ticket type name is undefined");
                return null;            } 
            const customItemsResponse = await clickupService.fetchClickupTicketTypes();
            const ticketTypesArray = customItemsResponse?.custom_items;
            
            if (!ticketTypesArray || !Array.isArray(ticketTypesArray)) {
                logger.error("Invalid custom items response from ClickUp", { itemsArray: ticketTypesArray });
                return null;
            }
            const ticketType = ticketTypesArray.find((item: { name: string }) =>
                item.name.toLowerCase() === ticketTypeName.toLowerCase()
              );              
            return ticketType || null;
        }catch(error){
            logger.error("Error in getTicketType:", error);
            throw error;
        }
    }

    public getPriorityTicketLevel(value: string | undefined): number {
        switch (value?.toLowerCase()) {
            case 'low':
                return 4;
            case 'normal':
                return 3;
            case 'high':
                return 2;
            case 'urgent':
                return 1;
            default:
                return 4; 
        }
    }
    public createTaskData(
        id: number | undefined, 
        subject: string, 
        message: string, 
        chatURL: string | undefined, 
        userIds: string[], 
        priority: TicketPriority | undefined, 
        sender: string | undefined, 
        requestType: TicketRequestType | undefined, 
        customerId: string, 
        customerOrderIndex: number| undefined, 
        requesterId: string, 
        customerRequesterFieldId: string | undefined, 
        ticketTypeId: string | null,
        status: string,
    ): TaskData {
        return {
            name: `${id ? `#${id}` : ''} ${subject}`,
            description: `${message} \n ${chatURL || ''}`,
            assignees: [...userIds],
            status: status,
            priority: this.getPriorityTicketLevel(priority),
            tags: [sender, requestType],
            custom_fields: [
                {
                    id: customerId,
                    value: customerOrderIndex,
                },
                {
                    id: requesterId,
                    value: customerRequesterFieldId,
                },
            ],
            custom_item_id: ticketTypeId,
        };
    }

}