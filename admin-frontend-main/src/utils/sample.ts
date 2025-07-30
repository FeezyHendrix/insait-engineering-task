import { InboxMessageType } from "@/types/chat";
import { MessagesType } from "@/types/dashboard";
import receiverImg from '@image/bot.svg'
import senderImg from '@image/sample.png'

export const messagesData: MessagesType = {
  id: "1",
  createdAt: 164533434,
  data: [
    {
      id: '1',
      text: `Hi`,
      pov: 'bot',
      image: receiverImg
    },
    {
      id: '2',
      text: `Hello! How can I assist you today?`,
      pov: 'user',
      image: senderImg
    },
    {
      id: '3',
      text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Gorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.`,
      pov: 'bot',
      image: ''
    },
    {
      id: "4",
      text: `Hello! How can I assist you today?`,
      pov: 'user',
      image: senderImg
    },
    {
      id: "5",
      text: `Hello! How can I assist you today?`,
      pov: 'user',
      image: senderImg
    },
    {
      id: "6",
      text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Gorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.`,
      pov: 'bot',
      image: ''
    },
    {
      id: "7",
      text: `Hi`,
      pov: 'bot',
      image: receiverImg
    },
    {
      id: "8",
      text: `Hello! How can I assist you today?`,
      pov: 'user',
      image: senderImg
    },
    {
      id: "9",
      text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Gorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.`,
      pov: 'bot',
      image: ''
    },
    {
      id: "10",
      text: `Hello! How can I assist you today?`,
      pov: 'user',
      image: senderImg
    },
    {
      id: "11",
      text: `Hello! How can I assist you today?`,
      pov: 'user',
      image: senderImg
    },
    {
      id: "12",
      text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Gorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.`,
      pov: 'bot',
      image: ''
    },
  ]
}

export const inboxData: InboxMessageType[] = [
  {
    id: 1,
    name: `Muhmmad Shiyad`,
    category: `Savings`,
    message: `I have an issue`,
    time: Date.now(),
  },
  {
    id: 2,
    name: `Savannah Nguyen`,
    category: `Loan`,
    message: `I have an issue`,
    time: 1701548078412,
  },
  {
    id: 3,
    name: `Kristin Watson`,
    category: `Withdrawal`,
    message: `I have an issue`,
    time: 1701548078412,
    count: 2,
  },
  {
    id: 4,
    name: `Savannah Nguyen`,
    category: `Savings`,
    message: `I have an issue`,
    time: 1701548078412,
  },
  {
    id: 5,
    name: `Muhmmad Shiyad`,
    category: `Savings`,
    message: `I have an issue`,
    time: 1701548078412,
  },
  {
    id: 6,
    name: `Savannah Nguyen`,
    category: `Loan`,
    message: `I have an issue`,
    time: 1701548078412,
  },
  {
    id: 7,
    name: `Kristin Watson`,
    category: `Withdrawal`,
    message: `I have an issue`,
    time: 1701548078412,
    count: 2,
  },
  {
    id: 8,
    name: `Savannah Nguyen`,
    category: `Savings`,
    message: `I have an issue`,
    time: 1701548078412,
  },
  {
    id: 9,
    name: `Muhmmad Shiyad`,
    category: `Savings`,
    message: `I have an issue`,
    time: 1701548078412,
  },
  {
    id: 10,
    name: `Savannah Nguyen`,
    category: `Loan`,
    message: `I have an issue`,
    time: 1701548078412 - 86400000,
  },
  {
    id: 11,
    name: `Kristin Watson`,
    category: `Withdrawal`,
    message: `I have an issue`,
    time: 1701548078412 - 172800000,
    count: 2,
  },
  {
    id: 12,
    name: `Savannah Nguyen`,
    category: `Savings`,
    message: `I have an issue`,
    time: 1701548078412 - 604800000,
  },
]


// export const liveMessagesData: LiveMessagesDataType[] = [
//   {
//     id: 1,
//     pov: 'bot',
//     message: "Hey, how's it going? Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ut lacus ligula. Sed vitae commodo nisi. Donec et faucibus odio, at placerat lorem. Mauris auctor sagittis est, at bibendum felis bibendum id. Vivamus vel nunc quis ex congue fringilla eget a massa. Nullam malesuada neque vel justo hendrerit ultricies.",
//     date: new Date('2023-12-02T08:15:00').getTime(),
//   },
//   {
//     id: 2,
//     pov: 'user',
//     message: "Hi there! I'm doing well, thanks. How about you? Maecenas ut turpis libero. Phasellus convallis metus id leo suscipit, in tempor arcu bibendum. Sed hendrerit libero nec risus mattis, nec cursus orci tincidunt. Proin luctus sem nec enim viverra, sit amet bibendum quam congue. Nam posuere justo nec tincidunt auctor.",
//     date: new Date('2023-12-02T08:20:00').getTime(),
//   },
//   {
//     id: 3,
//     pov: 'bot',
//     message: "I'm good too, just catching up on some work. Aliquam sit amet metus magna. Etiam congue turpis eget nulla tempor, eu egestas arcu blandit. Nulla facilisi. Vestibulum at leo ac ante aliquam ultrices a et nulla. Vestibulum volutpat nisi eu velit efficitur tempor.",
//     date: new Date('2023-12-02T09:30:00').getTime(),
//   },
//   {
//     id: 4,
//     pov: 'user',
//     message: "Nice! Anything exciting happening? Duis a enim eget turpis suscipit cursus a a urna. Fusce quis nulla in nunc fermentum hendrerit eu at elit. Nulla facilisi. Integer congue luctus purus, sit amet convallis erat ultricies eget.",
//     date: new Date('2023-12-02T09:45:00').getTime(),
//   },
//   {
//     id: 5,
//     pov: 'bot',
//     message: "Not really, just the usual. Cras id lacus enim. Curabitur maximus eros nec odio venenatis, quis eleifend ipsum fringilla. Etiam elementum leo in justo auctor, nec faucibus ligula auctor. Sed id odio quis odio viverra luctus.",
//     date: new Date('2023-12-02T10:00:00').getTime(),
//   },
//   {
//     id: 6,
//     pov: 'user',
//     message: "I see. Have you seen the latest movie? Morbi vulputate arcu et tempus eleifend. Sed commodo ligula id felis blandit rhoncus. Duis vitae quam et nulla pulvinar efficitur vel non odio.",
//     date: new Date('2023-12-02T11:20:00').getTime(),
//   },
//   {
//     id: 7,
//     pov: 'bot',
//     message: "Not yet, planning to watch it this weekend. Nulla facilisi. Proin gravida sapien nec urna iaculis, sed lobortis nunc fringilla. Fusce ullamcorper ultrices purus, at fermentum quam finibus at.",
//     date: new Date('2023-12-02T11:40:00').getTime(),
//   },
//   {
//     id: 8,
//     pov: 'user',
//     message: "That sounds great! Phasellus et nulla ac augue vehicula mollis. Sed tincidunt metus vel turpis lobortis, sit amet suscipit justo tincidunt.",
//     date: new Date('2023-12-02T12:00:00').getTime(),
//   },
//   {
//     id: 9,
//     pov: 'bot',
//     message: "Indeed. How about you? Quisque luctus, nunc eu tempor tincidunt, odio magna pharetra dui, ac pharetra dui sapien sit amet felis. Nulla facilisi.",
//     date: new Date('2023-12-03T09:15:00').getTime(), 
//   },
//   {
//     id: 10,
//     pov: 'user',
//     message: "I'm just relaxing at home. Integer at nibh risus. Suspendisse potenti. Donec fringilla, leo non tristique egestas, mauris est vulputate felis, vitae consequat ante purus vel nunc.",
//     date: new Date('2023-12-03T09:30:00').getTime(), 
//   },
//   {
//     id: 11,
//     pov: 'bot',
//     message: "Sounds peaceful. Curabitur eleifend risus at nisi auctor, vitae sollicitudin ante dapibus. Vivamus tristique purus non purus tincidunt suscipit.",
//     date: new Date('2023-12-03T09:45:00').getTime(), 
//   },
//   {
//     id: 12,
//     pov: 'user',
//     message: "Yes, it is. Donec sit amet sagittis nisi. Sed ullamcorper, elit id posuere fermentum, neque quam lacinia nulla, vitae ultrices orci nulla non diam.",
//     date: new Date('2023-12-03T10:00:00').getTime(), 
//   },
//   {
//     id: 13,
//     pov: 'bot',
//     message: "I have some errands to run later. Morbi vel magna eget justo tristique eleifend. Sed accumsan lectus et ex eleifend, a gravida justo gravida. Aenean at dictum lorem.",
//     date: new Date('2023-12-03T11:20:00').getTime(), 
//   },
//   {
//     id: 14,
//     pov: 'user',
//     message: "Make sure to take care of them! Duis at odio malesuada, molestie dolor eu, tempor libero.",
//     date: new Date('2023-12-03T11:40:00').getTime(), 
//   },
//   {
//     id: 15,
//     pov: 'bot',
//     message: "Will do. Integer maximus mi et odio malesuada, nec congue velit accumsan. Fusce gravida, odio eget hendrerit egestas, velit libero dapibus tellus, non fermentum lectus ante eget mi. Donec id dapibus orci.",
//     date: new Date('2023-12-03T12:00:00').getTime(), 
//   },
//   {
//     id: 16,
//     pov: 'user',
//     message: "Got any plans for the evening? Etiam dignissim ante ut mauris sollicitudin, non consequat ipsum vehicula. Aliquam tincidunt metus sed mi scelerisque faucibus.",
//     date: new Date('2023-12-03T13:30:00').getTime(), 
//   },
//   {
//     id: 17,
//     pov: 'bot',
//     message: "Not yet, just taking it easy. Fusce id enim dapibus, vestibulum purus eget, molestie purus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
//     date: new Date('2023-12-03T14:00:00').getTime(), 
//   },
//   {
//     id: 18,
//     pov: 'user',
//     message: "That's nice! Maecenas fermentum, libero quis facilisis fermentum, turpis urna auctor enim, quis mollis nulla lacus vitae sapien.",
//     date: new Date('2023-12-03T14:30:00').getTime(), 
//   },
//   {
//     id: 19,
//     pov: 'bot',
//     message: "Indeed. Vestibulum euismod libero non sem placerat, eget tristique odio tempus. Sed finibus nisl eget interdum aliquet.",
//     date: new Date('2023-12-03T15:00:00').getTime(), 
//   },
//   {
//     id: 20,
//     pov: 'user',
//     message: "Well, have a great day!",
//     date: new Date('2023-12-03T15:30:00').getTime(), 
//   },
// ];



// export const liveMessagesDataShort: LiveMessagesDataType[] = [
//   {
//     id: 18,
//     pov: 'user',
//     message: "That's nice!",
//     date: new Date('2023-12-03T14:30:00').getTime(), 
//   },
//   {
//     id: 19,
//     pov: 'bot',
//     message: "Indeed.",
//     date: new Date('2023-12-03T15:00:00').getTime(),
//   },
//   {
//     id: 20,
//     pov: 'user',
//     message: "Well, have a great day!",
//     date: new Date('2023-12-03T15:30:00').getTime(), 
//   },
// ];
