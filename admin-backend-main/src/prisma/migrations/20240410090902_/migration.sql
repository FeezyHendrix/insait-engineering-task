-- CreateTable
CREATE TABLE "UnansweredQuestion" (
    "conversationId" TEXT NOT NULL,
    "questionsUnanswered" JSONB NOT NULL,
    "createdAt" TEXT NOT NULL,
    "archive" BOOLEAN NOT NULL,
    "unansweredQId" TEXT NOT NULL,

    CONSTRAINT "UnansweredQuestion_pkey" PRIMARY KEY ("unansweredQId")
);

-- AddForeignKey
ALTER TABLE "UnansweredQuestion"
ADD CONSTRAINT "UnansweredQuestion_conversationId_fkey"
FOREIGN KEY ("conversationId")
REFERENCES "Interaction"("conversationId")
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- CreateIndex
CREATE UNIQUE INDEX "UnansweredQuestion_unansweredQId_key"
ON "UnansweredQuestion"("unansweredQId");
