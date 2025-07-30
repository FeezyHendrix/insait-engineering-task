-- CreateEnum
CREATE TYPE "LinkType" AS ENUM ('URL', 'EMAIL', 'PHONE');

-- CreateTable
CREATE TABLE "Link" (
    "linkId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "LinkType" NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("linkId")
);
