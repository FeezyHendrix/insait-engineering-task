/*
  Warnings:

  - A unique constraint covering the columns `[questionHash,answerHash,conversationId]` on the table `UnansweredQuestion` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "UnansweredQuestion" ADD COLUMN     "answerHash" TEXT,
ADD COLUMN     "questionHash" TEXT;

CREATE OR REPLACE FUNCTION set_question_answer_hashes()
RETURNS TRIGGER AS $$
BEGIN
  NEW."questionHash" := md5(NEW."question");
  NEW."answerHash" := md5(NEW."answer");
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_question_answer_hashes
BEFORE INSERT OR UPDATE ON "UnansweredQuestion"
FOR EACH ROW EXECUTE FUNCTION set_question_answer_hashes();

UPDATE "UnansweredQuestion"
SET "questionHash" = md5("question"),
    "answerHash" = md5("answer")
WHERE "questionHash" IS NULL OR "answerHash" IS NULL;

DELETE FROM "UnansweredQuestion"
WHERE "unansweredQId" NOT IN (
    SELECT MIN("unansweredQId")
    FROM "UnansweredQuestion"
    GROUP BY "question", "answer", "conversationId"
);

-- CreateIndex
CREATE UNIQUE INDEX "UnansweredQuestion_questionHash_answerHash_conversationId_key" ON "UnansweredQuestion"("questionHash", "answerHash", "conversationId");