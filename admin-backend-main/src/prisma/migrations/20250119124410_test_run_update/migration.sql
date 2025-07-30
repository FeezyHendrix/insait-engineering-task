/*
  Warnings:

  - A unique constraint covering the columns `[testRunId]` on the table `Interaction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[conversationId]` on the table `TestRun` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Interaction" DROP CONSTRAINT "Interaction_testRunId_fkey";

-- AlterTable
ALTER TABLE "TestRun" ADD COLUMN     "conversationId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Interaction_testRunId_key" ON "Interaction"("testRunId");

-- CreateIndex
CREATE UNIQUE INDEX "TestRun_conversationId_key" ON "TestRun"("conversationId");

-- AddForeignKey
ALTER TABLE "TestRun" ADD CONSTRAINT "TestRun_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Interaction"("conversationId") ON DELETE SET NULL ON UPDATE CASCADE;
