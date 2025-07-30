/*
  Warnings:

  - You are about to drop the column `interactionId` on the `Question` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_interactionId_fkey";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "interactionId",
ADD COLUMN     "conversationId" TEXT;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Interaction"("conversationId") ON DELETE SET NULL ON UPDATE CASCADE;
