-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('PENDING', 'COMPLETED', 'ERROR');

-- AlterTable
ALTER TABLE "DocumentKnowledge" ADD COLUMN     "status" "DocumentStatus" DEFAULT 'COMPLETED';
