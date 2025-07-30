import axios from "axios";
import constants, {companyData, defaultClickupTicketAssignees, insaitTeamIdClickup, priorityMapping, statusMapping } from '../constants';
import { ClickupMember, ClickupTeam, CreateReportEmailType, ReportEmailResponseType, TicketPriority, TicketRequestType, TicketStatus } from "../types/interfaces";
import logger from '../libs/pino';
import { ClickupServices, Ticket } from "../services/clickupServices";
// import { processEmailSending } from "./email";

const clickUpService = new ClickupServices();
const ticket = new Ticket();

export const createClickUpTicket = async ({ id, subject, message, chatURL, companyName, sender, priority, requestType, assigneeOverride }: CreateReportEmailType): Promise<string | null> => {
  try {
    if (!constants.CLICKUP_LIST_ID || !constants.CLICKUP_API_KEY) return null;

    const { clickupFields } = await fetchClickupFields();

    const getFieldKey = (targetKey: string) => 
      Object.keys(clickupFields).find(key => key.trim().toLowerCase() === targetKey.toLowerCase()) ?? null;

    const customerKey = getFieldKey('Customer');
    const requesterKey = getFieldKey('Requester');

    if (!customerKey || !requesterKey) {
      logger.error('Missing required fields in ClickUp configuration:', { customerKey, requesterKey });
      return null;
    }

    const customerRequesterFieldId = clickupFields[requesterKey]?.options?.find(option => option.name === 'Customer')?.id;
    const clickupCompanyName = companyData[companyName?.toLowerCase() || '']?.clickupName ?? companyName;
    const rawIndex = clickupFields[customerKey]?.options?.find(
      option => option.name?.toLowerCase() === clickupCompanyName?.toLowerCase()
    )?.orderindex;
    const customerOrderIndex = rawIndex !== undefined && rawIndex !== null ? parseInt(rawIndex.toString(), 10) : 0;
    const customerId = clickupFields[customerKey]?.id;    
    const requesterId = clickupFields[requesterKey]?.id;

    if (!customerId) return null;

    const userIds: string[] = [];
    const assignees: string[] = assigneeOverride ?? getAssigneesByCompany(companyName);
    const fetchIds = async (names: string[]): Promise<string[]> => {
      const ids = await Promise.all(names.map(name => fetchClickupUserId(name.trim())));
      return ids.filter((id) => id !== null);
    };
    const assigneeIds = await fetchIds(assignees);

    userIds.push(...assigneeIds);

    const ticketType = await ticket.getTicketType(requestType, clickUpService);
    const ticketTypeId = ticketType?.id || null;

    const data = ticket.createTaskData(
      id,
      subject,
      message,
      chatURL,
      userIds,
      priority,
      sender,
      requestType,
      customerId,
      customerOrderIndex,
      requesterId,
      customerRequesterFieldId,
      ticketTypeId,
      statusMapping[TicketStatus.toDo]
    );
    const clickUpResponse = await axios.post(
      `https://api.clickup.com/api/v2/list/${constants.CLICKUP_LIST_ID}/task`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: constants.CLICKUP_API_KEY
        }
      }
    );

    const ticketUrl = clickUpResponse?.data?.url;
    logger.info(`Clickup ticket created: ${ticketUrl}`);
    return ticketUrl;
  } catch (error) {
    logger.error(`Error creating clickup ticket: ${error}`);
    return null;
  }
};


export const getAssigneesByCompany = (companyName: string): string[] => {
  const company = companyData[companyName.toLowerCase()];  
  return company?.assignees.length ? company.assignees : defaultClickupTicketAssignees;
};

export const fetchClickupFields = async (): Promise<{
  clickupFields: {
    [key: string] :{
      id: string;
      type: string;
      options?: { id: string; name: string; orderindex: string}[];
    };
  };
}> => {
  try {
    const response = await axios.get(`https://api.clickup.com/api/v2/list/${constants.CLICKUP_LIST_ID}/field`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': constants.CLICKUP_API_KEY
      },
    });
    const fields = response.data.fields || [];      
    const normalize = (str: string) => str.trim().toLowerCase();


    const clickupFields = fields.reduce((acc: {
      [key: string]: {
        id: string;
        type: string;
        options?: { id: string; name: string; orderindex: string }[];
      };
    }, field: {
      id: string;
      name: string;
      type: string;
      type_config: {
        options?: { id: string; name: string; orderindex: string }[];
      };
    }) => {
      if (!field.name) return acc;

      const normalizedName = normalize(field.name);
      const existing = acc[normalizedName];

      const isDropDownOrFirstField = !existing || (field.type === 'drop_down' && existing.type !== 'drop_down');

      if (isDropDownOrFirstField) {
        acc[normalizedName] = {
          id: field.id,
          type: field.type,
          options: field.type_config?.options || [],
        };
      }

      return acc;
      },{});
      return {clickupFields};
  } catch (error) {
    logger.error(`Error fetching ClickUp company IDs: ${error}`);
    throw error;
  }
};

export const fetchClickupUserId = async (usernameToFind: string): Promise<string| null> => {
  try {
    const response = await axios.get('https://api.clickup.com/api/v2/team', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': constants.CLICKUP_API_KEY,
      },
    });    

    const teams: ClickupTeam[] = response.data.teams || [];
    const insaitTeam = teams.find((team: ClickupTeam)=> team.id === insaitTeamIdClickup);

    if(!insaitTeam){
      logger.error('Insait teammate is not found!')
      return null;
    }
    const matchingMember = insaitTeam.members.find((member: ClickupMember) => {
      const username = member.user?.username;
      return username?.toLowerCase() === usernameToFind.toLowerCase();
    });

    if (matchingMember && matchingMember.user) {      
      return matchingMember.user.id.toString();
    }
    return null;
  } catch (error) {
    console.error('Error fetching ClickUp user ID:', error);
    throw error;
  }
};

export const updateClickupTicket = async (subject: string, message: string, clickupUrl: string, status:TicketStatus, priority:TicketPriority, requestType:TicketRequestType, chatURL: string | undefined): Promise<void> =>{
  try { 
    const ticketType = await ticket.getTicketType(requestType, clickUpService);
    const ticketTypeId = ticketType?.id || null;      //This is null because the ClickUp type task is the default, and to access it, we need to explicitly send null.  
    const ticketId = clickupUrl.split('/').pop();
    const priorityNumber = priorityMapping[priority];  
    const clickupStatus = statusMapping[status];
    const payload = {
      name: subject,
      description: `${message} \n ${chatURL || ''}`,
      priority: priorityNumber,
      status: clickupStatus,
      custom_item_id: ticketTypeId,
    }    
    
    const response = await axios.put(`https://api.clickup.com/api/v2/task/${ticketId}`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'accept': "application/json",
          'Authorization': constants.CLICKUP_API_KEY,
        },
      }
    );    
    const ticketUrl = response.data.url;
    logger.info(`Clickup ticket is been updated: ${ticketUrl}`);
  }catch(error){
    logger.error(`Error updating clickup ticket ${error}`);
  }
}

// export const sendTicketEmail = async ({ id, subject, companyName, ticketURL, sender, userRecipientEmail, changedValues, newComment, message, priority, comments, startDate, chatURL, requestType, clickupUrl}: CreateReportEmailType): Promise<ReportEmailResponseType> => {
//   try {
//     if (!userRecipientEmail) {
//       logger.error("No email address")
//       return failedResponse("No email address");
//     }
//     const idText = id ? `#${id}` : ''  
//     if (changedValues) {
//       const changeTags = Object.entries(changedValues).map(([key, value]) => `<p><strong>${key}:</strong> ${value.old} ➡️  ${value.new}</p>`).join('\n');
//       const emailTemplate = `
//       <div style="white-space: pre-wrap;"><strong>Ticket #:</strong>${id}</div>
//       <div style="white-space: pre-wrap;"><strong>Ticket Subject:</strong> ${subject}</div>
//       <div style="white-space: pre-wrap;"><strong>Updated by:</strong> ${sender}</div>
//       <br>
//       <div style="white-space: pre-wrap;"><strong>What was updated:</strong></div>
//       ${changeTags}
//       `;
//       const formattedSubject = `${idText} ${companyName} Ticket Updated: ${subject}`;
//       return processEmailSending(formattedSubject, emailTemplate, userRecipientEmail, sender)
//     }

//     if (newComment) {
//       const emailTemplate = `
//       <div style="white-space: pre-wrap;"><strong>Ticket #:</strong>${id}</div>
//       <div style="white-space: pre-wrap;"><strong>Ticket Subject:</strong> ${subject}</div>
//       <div style="white-space: pre-wrap;"><strong>New Comment by:</strong> ${sender}</div>
//       <div style="white-space: pre-wrap;"><strong>Comment:</strong> "${newComment}"</div>
//       ${ticketURL ? `\n <a style="margin-top: 10px;display: block;" href="${ticketURL}">Click here to view the conversation</a>` : ''}
//       `;
//       const formattedSubject = `${idText} New ${companyName} Ticket Comment: ${subject}`;
//       return processEmailSending(formattedSubject, emailTemplate, userRecipientEmail, sender)
//     }
//     const emailTemplate = `
//       <p><strong>Opened by:</strong> ${sender}</p>
//       <p><strong>Subject:</strong> ${subject}</p>
//       ${id ? `<p><strong>Ticket ID:</strong> ${id}</p>` : ''}
//       <p><strong>Message:</strong> ${message}</p>
//       <p><strong>Company:</strong> ${companyName}</p>
//       <p><strong>Admin ticket Link:</strong>${ticketURL}</p>
//       <p><strong>Clickup Link:</strong>${clickupUrl}</p>
//       <p><strong>Date:</strong> ${new Date(startDate).toLocaleString()} </p>
//       ${chatURL ? `\n <a style="margin-top: 10px;display: block;" href="${chatURL}">Click here to view chat conversation</a>` : ''}
//       ${priority ? `<p><strong>Priority:</strong> ${priority} </p>` : ''}
//       ${requestType ? `<p><strong>Request Type:</strong> ${requestType} </p>` : ''}
//       ${comments ? `<div style="white-space: pre-wrap;margin-top: 10px;"><strong>Comments</strong>\n${comments}</div>` : ''}
//       `    
//     const formattedSubject = `${idText} ${companyName.toUpperCase()} - ${subject}`;
//     return processEmailSending(formattedSubject, emailTemplate, userRecipientEmail, sender)

//   } catch (error) {
//     return serviceErrorHandler("sendTicketEmail", error, 'Sending Report failed');
//   }
// }

export const successResponse = async (data: any, message?: string) => {
  return { status: true, message: message || 'Success', data, statusCode: 200 }
}

export const failedResponse = async (message: string = 'Something went wrong', data?: any) => {
  return { status: false, message: message, statusCode: 400, data: data || null }
}

export const serviceErrorHandler = (componentName: string, error: unknown, message: string) => {

  logger.error(`${componentName} : ${error}`)

  const errorMessage = extractErrorMessage(error, message);
  return { status: false, message: errorMessage, statusCode: 500, data: null };
}

export const extractErrorMessage = (error: unknown, message: string): string => {

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (typeof error === 'object' && error !== null) {
    return (error as any)?.body?.message || message;
  }

  return message;
};
