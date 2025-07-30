// import { SendSmtpEmail } from "@getbrevo/brevo";
// import constants from '../constants';
// import logger from "../libs/pino";
// import { successResponse, serviceErrorHandler } from "./reportUtil";
// import { KnowledgeType } from "../interfaces";

// const emailClient = require('@getbrevo/brevo');
// const emailApiInstance = new emailClient.TransactionalEmailsApi();
// let apiKey = emailApiInstance.authentications['apiKey'];
// apiKey.apiKey = constants.BREVO_API_KEY;


// export const processEmailSending = async (
//   subject: string,
//   emailTemplate: string,
//   recipientEmail: string,
//   sender: string = 'admin'
// ) => {
//   try {
//     const sendSmtpEmail: SendSmtpEmail = new emailClient.SendSmtpEmail();

//     sendSmtpEmail.subject = subject;
//     sendSmtpEmail.sender = { name: sender, email: constants.BREVO_SENDER_EMAIL_ADDRESS };

//     sendSmtpEmail.htmlContent = emailTemplate;
//     sendSmtpEmail.to = [{ email: recipientEmail }];
//     const emailResult = await emailApiInstance.sendTransacEmail(sendSmtpEmail);
//     if (emailResult.response.statusCode !== 201) {
//       logger.error(`Email sending failed. ${emailResult.statusMessage}`);
//       return serviceErrorHandler("sendEmail", emailResult, 'Sending Email failed');
//     }
//     logger.info(`Email sent from ${sender} to ${recipientEmail}. Subject: ${subject}`);
//     return successResponse(emailResult);
//   } catch (error) {
//     return serviceErrorHandler("sendEmail", error, 'Sending Email failed');
//   }
// }

// export const formatKnowledgeEmailTemplate = (
//   data: KnowledgeType,
//   type: 'added' | 'deleted' | 'updated' | 'statusChanged'
// ) => {

//   const message = `The knowledge base information for ${data.id} has been ${type === 'statusChanged' ? data.active ? 'activated' : 'deactivated' : type}.`

//   const knowledgeEmailtemplate = `
//        <p style="margin-bottom: 8px;">${message}</p>
//        <p>
//        <strong>QUESTION:</strong> 
//        <span style="white-space: pre-wrap;">${data.question}</span>
//        </p>
//        <p>
//        <strong>ANSWER:</strong>
//        <span style="white-space: pre-wrap;">${data.answer}</span>
//        </p>
//        <p>
//        <strong>ACTIVE:</strong> ${data.active}
//        </p>
//        <p>
//        <strong>PRODUCT:</strong> ${data.product}
//        </p>
//       ${data.url ? `\n <a style="margin-top: 10px;display: block;" href="${data.url}"></a>` : ''}
//       `
//   return knowledgeEmailtemplate;
// }