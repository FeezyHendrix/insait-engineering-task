/*
  Warnings:

  - You are about to drop the column `customerId` on the `Interaction` table. All the data in the column will be lost.
  - Added the required column `chat_user` to the `Interaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Interaction" DROP CONSTRAINT "Interaction_customerId_fkey";

-- DropIndex
DROP INDEX "customerId";

-- AlterTable
ALTER TABLE "Interaction" DROP COLUMN "customerId",
ADD COLUMN     "chat_user" TEXT NOT NULL;
