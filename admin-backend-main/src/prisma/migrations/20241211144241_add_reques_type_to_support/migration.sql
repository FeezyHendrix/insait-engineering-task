-- CreateEnum
CREATE TYPE "TicketRequestType" AS ENUM ('bug', 'feature');

-- AlterTable
ALTER TABLE "Support" ADD COLUMN     "requestType" "TicketRequestType" NOT NULL DEFAULT 'bug';
