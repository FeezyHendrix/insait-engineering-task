/*
  Warnings:

  - Added the required column `active` to the `Knowledge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Knowledge" ADD COLUMN "active" BOOLEAN DEFAULT true;

