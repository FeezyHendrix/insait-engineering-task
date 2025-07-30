-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "DocumentKnowledge" ADD COLUMN     "reviewStatus" "ReviewStatus";
