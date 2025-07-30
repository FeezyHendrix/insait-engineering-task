/*
  Warnings:

  - A unique constraint covering the columns `[question,answer,conversationId]` on the table `UnansweredQuestion` will be added. If there are existing duplicate values, this will fail.

*/

/*Delete duplications*/
DELETE FROM "UnansweredQuestion"
WHERE "unansweredQId" NOT IN (
    SELECT MIN("unansweredQId")
    FROM "UnansweredQuestion"
    GROUP BY "question", "answer", "conversationId"
);
