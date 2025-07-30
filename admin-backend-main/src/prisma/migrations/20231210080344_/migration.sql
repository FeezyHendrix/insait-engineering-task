/*
  Warnings:

  - The primary key for the `Interaction` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Agreements" DROP CONSTRAINT "Agreements_interactionId_fkey";

-- DropForeignKey
ALTER TABLE "AnomalyQuestions" DROP CONSTRAINT "AnomalyQuestions_interactionId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerSatisfaction" DROP CONSTRAINT "CustomerSatisfaction_interactionId_fkey";

-- DropForeignKey
ALTER TABLE "DropoffQuestions" DROP CONSTRAINT "DropoffQuestions_interactionId_fkey";

-- DropForeignKey
ALTER TABLE "Errors" DROP CONSTRAINT "Errors_interactionId_fkey";

-- DropForeignKey
ALTER TABLE "StoppedInteractions" DROP CONSTRAINT "StoppedInteractions_interactionId_fkey";

-- AlterTable
ALTER TABLE "Agreements" ALTER COLUMN "interactionId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "AnomalyQuestions" ALTER COLUMN "interactionId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "CustomerSatisfaction" ALTER COLUMN "interactionId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "DropoffQuestions" ALTER COLUMN "interactionId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Errors" ALTER COLUMN "interactionId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Interaction" DROP CONSTRAINT "Interaction_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Interaction_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "StoppedInteractions" ALTER COLUMN "interactionId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "CustomerSatisfaction" ADD CONSTRAINT "CustomerSatisfaction_interactionId_fkey" FOREIGN KEY ("interactionId") REFERENCES "Interaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoppedInteractions" ADD CONSTRAINT "StoppedInteractions_interactionId_fkey" FOREIGN KEY ("interactionId") REFERENCES "Interaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnomalyQuestions" ADD CONSTRAINT "AnomalyQuestions_interactionId_fkey" FOREIGN KEY ("interactionId") REFERENCES "Interaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agreements" ADD CONSTRAINT "Agreements_interactionId_fkey" FOREIGN KEY ("interactionId") REFERENCES "Interaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Errors" ADD CONSTRAINT "Errors_interactionId_fkey" FOREIGN KEY ("interactionId") REFERENCES "Interaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DropoffQuestions" ADD CONSTRAINT "DropoffQuestions_interactionId_fkey" FOREIGN KEY ("interactionId") REFERENCES "Interaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
