/*
  Warnings:

  - The primary key for the `UnansweredQuestion` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[unansweredQuestionId]` on the table `UnansweredQuestion` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `unansweredQuestionId` to the `UnansweredQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UnansweredQuestion" 
    DROP CONSTRAINT "UnansweredQuestion_pkey",
    DROP COLUMN "questionsUnanswered";

ALTER TABLE "UnansweredQuestion"
    ADD COLUMN "answer" TEXT NOT NULL,
    ADD COLUMN "question" TEXT NOT NULL,
    ADD COLUMN "reason" TEXT NOT NULL,
    ADD CONSTRAINT "UnansweredQuestion_pkey" PRIMARY KEY ("unansweredQId");
