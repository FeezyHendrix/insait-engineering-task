-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'ABANDONED', 'ERROR');

-- CreateEnum
CREATE TYPE "StepType" AS ENUM ('MESSAGE', 'INPUT', 'CHOICE', 'API_CALL', 'VALIDATION', 'REDIRECT');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'IMAGE', 'FILE', 'BUTTON_CLICK', 'FORM_SUBMIT', 'ERROR');

-- CreateEnum
CREATE TYPE "MessageSender" AS ENUM ('USER', 'BOT', 'SYSTEM');

-- CreateTable
CREATE TABLE "ClientSession" (
    "sessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "totalSteps" INTEGER NOT NULL DEFAULT 0,
    "completedSteps" INTEGER NOT NULL DEFAULT 0,
    "dropOffStep" INTEGER,
    "sessionDuration" INTEGER,
    "status" "SessionStatus" NOT NULL DEFAULT 'ACTIVE',
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientSession_pkey" PRIMARY KEY ("sessionId")
);

-- CreateTable
CREATE TABLE "ConversationStep" (
    "stepId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "stepType" "StepType" NOT NULL DEFAULT 'MESSAGE',
    "stepName" TEXT NOT NULL,
    "entryTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "exitTime" TIMESTAMP(3),
    "duration" INTEGER,
    "userInput" TEXT,
    "botResponse" TEXT,
    "wasSuccessful" BOOLEAN NOT NULL DEFAULT false,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConversationStep_pkey" PRIMARY KEY ("stepId")
);

-- CreateTable
CREATE TABLE "MessageLog" (
    "messageId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "stepId" TEXT,
    "messageType" "MessageType" NOT NULL DEFAULT 'TEXT',
    "sender" "MessageSender" NOT NULL DEFAULT 'USER',
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "responseTime" INTEGER,
    "tokenCount" INTEGER,
    "sentiment" TEXT,
    "processed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MessageLog_pkey" PRIMARY KEY ("messageId")
);

-- CreateIndex
CREATE INDEX "ClientSession_userId_startTime_idx" ON "ClientSession"("userId", "startTime");

-- CreateIndex
CREATE INDEX "ConversationStep_sessionId_stepNumber_idx" ON "ConversationStep"("sessionId", "stepNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ConversationStep_sessionId_stepNumber_key" ON "ConversationStep"("sessionId", "stepNumber");

-- CreateIndex
CREATE INDEX "MessageLog_sessionId_timestamp_idx" ON "MessageLog"("sessionId", "timestamp");

-- CreateIndex
CREATE INDEX "MessageLog_sender_timestamp_idx" ON "MessageLog"("sender", "timestamp");

-- AddForeignKey
ALTER TABLE "ClientSession" ADD CONSTRAINT "ClientSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationStep" ADD CONSTRAINT "ConversationStep_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ClientSession"("sessionId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageLog" ADD CONSTRAINT "MessageLog_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ClientSession"("sessionId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageLog" ADD CONSTRAINT "MessageLog_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "ConversationStep"("stepId") ON DELETE CASCADE ON UPDATE CASCADE;