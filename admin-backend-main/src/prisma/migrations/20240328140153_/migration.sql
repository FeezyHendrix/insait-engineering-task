/*
  Warnings:

  - The primary key for the `Interaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `customerId` on the `Interaction` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Interaction` table. All the data in the column will be lost.
  - You are about to drop the `Customer` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `conversationId` to the `Interaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Interaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Agreements" DROP CONSTRAINT "Agreements_interactionId_fkey";

-- DropForeignKey
ALTER TABLE "AnomalyQuestions" DROP CONSTRAINT "AnomalyQuestions_interactionId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerSatisfaction" DROP CONSTRAINT "CustomerSatisfaction_customerId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerSatisfaction" DROP CONSTRAINT "CustomerSatisfaction_interactionId_fkey";

-- DropForeignKey
ALTER TABLE "DropoffQuestions" DROP CONSTRAINT "DropoffQuestions_interactionId_fkey";

-- DropForeignKey
ALTER TABLE "Errors" DROP CONSTRAINT "Errors_interactionId_fkey";

-- DropForeignKey
ALTER TABLE "Interaction" DROP CONSTRAINT "Interaction_customerId_fkey";

-- DropForeignKey
ALTER TABLE "StoppedInteractions" DROP CONSTRAINT "StoppedInteractions_interactionId_fkey";

-- DropIndex
DROP INDEX "customerId";

-- DropIndex
DROP INDEX "productId";

-- AlterTable
ALTER TABLE "Agreements" ADD COLUMN     "interactionConversationId" TEXT;

-- AlterTable
ALTER TABLE "AnomalyQuestions" ADD COLUMN     "interactionConversationId" TEXT;

-- AlterTable
ALTER TABLE "CustomerSatisfaction" ADD COLUMN     "interactionConversationId" TEXT,
ADD COLUMN     "userUserId" TEXT;

-- AlterTable
ALTER TABLE "DropoffQuestions" ADD COLUMN     "interactionConversationId" TEXT;

-- AlterTable
ALTER TABLE "Errors" ADD COLUMN     "interactionConversationId" TEXT;

-- AlterTable
ALTER TABLE "Interaction" DROP CONSTRAINT "Interaction_pkey",
DROP COLUMN "customerId",
DROP COLUMN "id",
ADD COLUMN     "chatProduct" TEXT,
ADD COLUMN     "conversationId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD COLUMN     "userUserId" TEXT,
ADD CONSTRAINT "Interaction_pkey" PRIMARY KEY ("conversationId");

-- AlterTable
ALTER TABLE "StoppedInteractions" ADD COLUMN     "interactionConversationId" TEXT;

-- DropTable
DROP TABLE "Customer";

-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "personaClassification" TEXT,
    "chatbotVisible" BOOLEAN
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userId_key" ON "User"("userId");

-- CreateIndex
CREATE INDEX "userId" ON "Interaction"("userId");

-- AddForeignKey
ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_userUserId_fkey" FOREIGN KEY ("userUserId") REFERENCES "User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerSatisfaction" ADD CONSTRAINT "CustomerSatisfaction_interactionConversationId_fkey" FOREIGN KEY ("interactionConversationId") REFERENCES "Interaction"("conversationId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerSatisfaction" ADD CONSTRAINT "CustomerSatisfaction_userUserId_fkey" FOREIGN KEY ("userUserId") REFERENCES "User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoppedInteractions" ADD CONSTRAINT "StoppedInteractions_interactionConversationId_fkey" FOREIGN KEY ("interactionConversationId") REFERENCES "Interaction"("conversationId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnomalyQuestions" ADD CONSTRAINT "AnomalyQuestions_interactionConversationId_fkey" FOREIGN KEY ("interactionConversationId") REFERENCES "Interaction"("conversationId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agreements" ADD CONSTRAINT "Agreements_interactionConversationId_fkey" FOREIGN KEY ("interactionConversationId") REFERENCES "Interaction"("conversationId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Errors" ADD CONSTRAINT "Errors_interactionConversationId_fkey" FOREIGN KEY ("interactionConversationId") REFERENCES "Interaction"("conversationId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DropoffQuestions" ADD CONSTRAINT "DropoffQuestions_interactionConversationId_fkey" FOREIGN KEY ("interactionConversationId") REFERENCES "Interaction"("conversationId") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Interaction" ADD COLUMN     "botSuccess" BOOLEAN;
ALTER TABLE "User" ADD COLUMN     "signedUp" BOOLEAN;

-- DropForeignKey
ALTER TABLE "Agreements" DROP CONSTRAINT "Agreements_interactionConversationId_fkey";

-- DropForeignKey
ALTER TABLE "AnomalyQuestions" DROP CONSTRAINT "AnomalyQuestions_interactionConversationId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerSatisfaction" DROP CONSTRAINT "CustomerSatisfaction_interactionConversationId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerSatisfaction" DROP CONSTRAINT "CustomerSatisfaction_userUserId_fkey";

-- DropForeignKey
ALTER TABLE "DropoffQuestions" DROP CONSTRAINT "DropoffQuestions_interactionConversationId_fkey";

-- DropForeignKey
ALTER TABLE "Errors" DROP CONSTRAINT "Errors_interactionConversationId_fkey";

-- DropForeignKey
ALTER TABLE "Interaction" DROP CONSTRAINT "Interaction_userUserId_fkey";

-- DropForeignKey
ALTER TABLE "StoppedInteractions" DROP CONSTRAINT "StoppedInteractions_interactionConversationId_fkey";

-- AlterTable
ALTER TABLE "Agreements" DROP COLUMN "interactionConversationId";

-- AlterTable
ALTER TABLE "AnomalyQuestions" DROP COLUMN "interactionConversationId";

-- AlterTable
ALTER TABLE "CustomerSatisfaction" DROP COLUMN "customerId",
DROP COLUMN "interactionConversationId",
DROP COLUMN "userUserId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "DropoffQuestions" DROP COLUMN "interactionConversationId";

-- AlterTable
ALTER TABLE "Errors" DROP COLUMN "interactionConversationId";

-- AlterTable
ALTER TABLE "Interaction" DROP COLUMN "userUserId";

-- AlterTable
ALTER TABLE "StoppedInteractions" DROP COLUMN "interactionConversationId";

-- AddForeignKey
ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerSatisfaction" ADD CONSTRAINT "CustomerSatisfaction_interactionId_fkey" FOREIGN KEY ("interactionId") REFERENCES "Interaction"("conversationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerSatisfaction" ADD CONSTRAINT "CustomerSatisfaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoppedInteractions" ADD CONSTRAINT "StoppedInteractions_interactionId_fkey" FOREIGN KEY ("interactionId") REFERENCES "Interaction"("conversationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnomalyQuestions" ADD CONSTRAINT "AnomalyQuestions_interactionId_fkey" FOREIGN KEY ("interactionId") REFERENCES "Interaction"("conversationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agreements" ADD CONSTRAINT "Agreements_interactionId_fkey" FOREIGN KEY ("interactionId") REFERENCES "Interaction"("conversationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Errors" ADD CONSTRAINT "Errors_interactionId_fkey" FOREIGN KEY ("interactionId") REFERENCES "Interaction"("conversationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DropoffQuestions" ADD CONSTRAINT "DropoffQuestions_interactionId_fkey" FOREIGN KEY ("interactionId") REFERENCES "Interaction"("conversationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE "CustomerSatisfaction" DROP CONSTRAINT "CustomerSatisfaction_userId_fkey";

-- AlterTable
ALTER TABLE "CustomerSatisfaction" DROP COLUMN "userId",
ADD COLUMN     "customerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "CustomerSatisfaction" ADD CONSTRAINT "CustomerSatisfaction_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
