import { twilioClient } from '../controllers/batchController';
import constants from '../constants';
// import { SendSmtpEmail } from '@getbrevo/brevo';
// import { emailClient, emailApiInstance } from '../controllers/batchController';
import logger from '../libs/pino';

export const sendBatchSMS = async (message: string, numbers: string[], twilioFromPhone: string) => {
    const messagePromises : Promise<any>[] = [];

    numbers.forEach((number:string) => {
        // validate phone number 
        const phoneRegex = /^\+\d+$/;
        if(!phoneRegex.test(number)) {
            throw new Error(`SMS not sent to ${number} - invalid phone number`);
        };
        if (!twilioClient) {
            throw new Error('Twilio client is not initialized. Please check your environment variables.');
        }
        const messagePromise = twilioClient.messages.create({
            body: message,
            messagingServiceSid: constants.MESSAGE_SERVICES_ID,
            to: number,
            from: twilioFromPhone
        })
        messagePromises.push(messagePromise);
    });

    return Promise.all(messagePromises);
}

// export const sendBatchEmail = async (message: string, emails: string[], subject: string, sender: string) => {
//     const emailPromises : Promise<any>[] = [];
//     emails.forEach((email:string) => {
//         // validate email
//         const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//         if(!emailRegex.test(email)) {
//             throw new Error(`Email not sent to ${email} - invalid email`);
//         };
//         let sendSmtpEmail : SendSmtpEmail = new emailClient.SendSmtpEmail(); 
//         sendSmtpEmail.subject = subject;
//         sendSmtpEmail.htmlContent = message;
//         sendSmtpEmail.sender = {name:sender, "email": constants.BREVO_SENDER_EMAIL_ADDRESS};
//         sendSmtpEmail.to = [{"email":email}];

//         const messagePromise = emailApiInstance.sendTransacEmail(sendSmtpEmail)
//         emailPromises.push(messagePromise)
//     });
//     const response = await Promise.all(emailPromises)
//     return response
// }

export const sendBatchWhatsapp = async (message: string, numbers: string[], twilioFromPhone: string) => {
    // check for single number
    if(!Array.isArray(numbers)) numbers = [numbers];
    const messagePromises : Promise<any>[] = [];
    numbers.forEach((number:any) => {
        // validate phone number 
        const phoneRegex = /^\+\d+$/;
        if(!phoneRegex.test(number)) {
            logger.info(`Message not sent to ${number} - invalid number`);
            return
        };
        const messagePromise = twilioClient.messages.create({
            body: message,
            to: "whatsapp:"+ number,
            from: `whatsapp:${twilioFromPhone}`,
        })
        .then(
            (res:any)=>{return res}
        )
        messagePromises.push(messagePromise);
    });

    let result = await Promise.all(messagePromises);
    return result;
};

export const extractBatchParams = (type: string, messageData: { message: string | null, phone?: string, email?: string }, subject?: string, sender?: string, twilioFromPhone?: string) => {
    
    const batchSendParams: {
        [key: string]: {
            recipientType: string,
            requiredFields: any[],
            sendFunction: Function,
            sendFunctionParams: any[],
        }
    } = {
        "SMS": {
            "recipientType": messageData.phone as string,
            "requiredFields": [messageData, messageData.phone],
            "sendFunction": sendBatchSMS,
            "sendFunctionParams": [[messageData.phone], twilioFromPhone]
        },
        // "EMAIL": {
        //     "recipientType": messageData.email as string,
        //     "requiredFields": [messageData, messageData.email, subject, sender],
        //     "sendFunction": sendBatchEmail,
        //     "sendFunctionParams": [[messageData.email], subject, sender]
        // },
        "WHATSAPP": {
            "recipientType": messageData.phone as string,
            "requiredFields": [messageData, messageData.phone],
            "sendFunction": sendBatchWhatsapp,
            "sendFunctionParams": [[messageData.phone], twilioFromPhone]
        }
    }
    return batchSendParams[type];
};