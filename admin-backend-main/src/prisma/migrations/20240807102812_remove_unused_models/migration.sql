/*
  Warnings:

  - You are about to drop the `Agreements` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnomalyQuestions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CustomerSatisfaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DropoffQuestions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Errors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FAQs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StoppedInteractions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `popularProducts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Agreements" DROP CONSTRAINT IF EXISTS "Agreements_interactionId_fkey";

-- DropForeignKey
ALTER TABLE "Agreements" DROP CONSTRAINT IF EXISTS "Agreements_productId_fkey";

-- DropForeignKey
ALTER TABLE "AnomalyQuestions" DROP CONSTRAINT IF EXISTS "AnomalyQuestions_interactionId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerSatisfaction" DROP CONSTRAINT IF EXISTS "CustomerSatisfaction_customerId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerSatisfaction" DROP CONSTRAINT IF EXISTS "CustomerSatisfaction_interactionId_fkey";

-- DropForeignKey
ALTER TABLE "DropoffQuestions" DROP CONSTRAINT IF EXISTS "DropoffQuestions_interactionId_fkey";

-- DropForeignKey
ALTER TABLE "DropoffQuestions" DROP CONSTRAINT IF EXISTS "DropoffQuestions_productId_fkey";

-- DropForeignKey
ALTER TABLE "Errors" DROP CONSTRAINT IF EXISTS "Errors_interactionId_fkey";

-- DropForeignKey
ALTER TABLE "FAQs" DROP CONSTRAINT IF EXISTS "FAQs_productId_fkey";

-- DropForeignKey
ALTER TABLE "StoppedInteractions" DROP CONSTRAINT IF EXISTS "StoppedInteractions_interactionId_fkey";

-- DropForeignKey
ALTER TABLE "popularProducts" DROP CONSTRAINT IF EXISTS "popularProducts_productId_fkey";

-- DropTable
DROP TABLE IF EXISTS "Agreements";

-- DropTable
DROP TABLE IF EXISTS "AnomalyQuestions";

-- DropTable
DROP TABLE IF EXISTS "CustomerSatisfaction";

-- DropTable
DROP TABLE IF EXISTS "DropoffQuestions";

-- DropTable
DROP TABLE IF EXISTS "Errors";

-- DropTable
DROP TABLE IF EXISTS "FAQs";

-- DropTable
DROP TABLE IF EXISTS "StoppedInteractions";

-- DropTable
DROP TABLE IF EXISTS "popularProducts";
