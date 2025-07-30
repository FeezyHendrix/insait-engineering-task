/*
  Warnings:

  - You are about to drop the column `chat_user` on the `Interaction` table. All the data in the column will be lost.
  - Added the required column `customerId` to the `Interaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Interaction" DROP COLUMN "chat_user",
ADD COLUMN     "customerId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "customerId" ON "Interaction"("customerId");

-- AddForeignKey
ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
