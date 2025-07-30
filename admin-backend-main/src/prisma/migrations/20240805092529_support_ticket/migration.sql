-- CreateEnum
CREATE TYPE "TicketPriority" AS ENUM ('urgent', 'high', 'normal', 'low');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('toDo', 'onHold', 'inProgress', 'completed');

-- CreateTable
CREATE TABLE "Support" (
    "id" SERIAL NOT NULL,
    "subject" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "chatURL" TEXT,
    "ticketURL" TEXT,
    "priority" "TicketPriority" NOT NULL DEFAULT 'normal',
    "status" "TicketStatus" NOT NULL DEFAULT 'toDo',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Support_pkey" PRIMARY KEY ("id")
);
