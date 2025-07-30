/*
  Warnings:

  - A unique constraint covering the columns `[question,conversationId]` on the table `Question` will be added. If there are existing duplicate values, this will fail.

*/

-- Wrap all operations in a transaction
BEGIN;

-- First, create a temporary table to store unique combinations
CREATE TEMPORARY TABLE temp_unique_questions AS
SELECT DISTINCT ON ("question", "conversationId") 
    id,
    "clusterId",
    question,
    "createdAt",
    "updatedAt",
    "conversationId"
FROM "Question"
ORDER BY "question", "conversationId", "createdAt" ASC;

-- Delete all records from the original table
DELETE FROM "Question";

-- Insert back only unique records
INSERT INTO "Question" 
SELECT * FROM temp_unique_questions;

-- Drop the temporary table
DROP TABLE temp_unique_questions;

-- Now add the unique constraint
CREATE UNIQUE INDEX "Question_question_conversationId_key" ON "Question"("question", "conversationId");

COMMIT;
