/*
  Warnings:

  - You are about to drop the column `reviewStatus` on the `DocumentKnowledge` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('document', 'link');

-- AlterEnum
ALTER TYPE "DocumentStatus" ADD VALUE 'SCRAPING';

-- AlterTable
ALTER TABLE "DocumentKnowledge" DROP COLUMN "reviewStatus",
ADD COLUMN     "crawlingJobId" TEXT,
ADD COLUMN     "pageDescription" TEXT,
ADD COLUMN     "pagePath" TEXT,
ADD COLUMN     "pageTitle" TEXT,
ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "type" "DocumentType" NOT NULL DEFAULT 'document',
ADD COLUMN     "url" VARCHAR(2048),
ADD COLUMN     "words" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "key" SET DEFAULT '',
ALTER COLUMN "size" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Knowledge" ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'qa';

-- CreateTable
CREATE TABLE "CrawlingJob" (
    "id" TEXT NOT NULL,
    "tenant" TEXT,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "progress" INTEGER NOT NULL,
    "status" "DocumentStatus" DEFAULT 'COMPLETED',

    CONSTRAINT "CrawlingJob_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DocumentKnowledge" ADD CONSTRAINT "DocumentKnowledge_crawlingJobId_fkey" FOREIGN KEY ("crawlingJobId") REFERENCES "CrawlingJob"("id") ON DELETE SET NULL ON UPDATE CASCADE;
