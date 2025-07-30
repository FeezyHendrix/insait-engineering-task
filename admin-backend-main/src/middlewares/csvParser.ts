import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import fs from 'fs';
import csv from 'csv-parser';
import constants from '../constants';
import tryCatch from '../utils/tryCatch';

const ContactType = constants.ContactType


const getContactEntries: RequestHandler = tryCatch(async (req, res, next) => {
    if (req.file && req.body.type) {
      let type = req.body.type;
      const filePath = req.file.path;
      if(type ==  ContactType.EMAIL){
        const emails: string[] = [];
        fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          const email = row.email;
          emails.push(email);
        })
        .on('end', () => {
          fs.unlinkSync(filePath);
          req.body.emails = emails;
          next();
        })
        .on('error', (err) => {
          return res.status(500).send('Error processing the CSV file.');
        });
      }
  
      if(type == ContactType.SMS || type == ContactType.WHATSAPP){
        const numbers: string[] = [];
        fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          const number = row.phone;
          numbers.push(number);
        })
        .on('end', () => {
          fs.unlinkSync(filePath);
          req.body.numbers = numbers;
          next();
        })

      }
    }
    else 
      next();
})
export default getContactEntries;
