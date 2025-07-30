/*
  Warnings:

  - The primary key for the `Customer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `endStatus` on the `Interaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `messages` on table `Interaction` required. This step will fail if there are existing NULL values in that column.
  - Made the column `comment` on table `Interaction` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "CustomerSatisfaction" DROP CONSTRAINT "CustomerSatisfaction_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Interaction" DROP CONSTRAINT "Interaction_customerId_fkey";

-- AlterTable
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT;
DROP SEQUENCE "Customer_id_seq";

-- AlterTable
ALTER TABLE "CustomerSatisfaction" ALTER COLUMN "customerId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Interaction" ALTER COLUMN "customerId" SET DATA TYPE TEXT,
ALTER COLUMN "avgResponseTimePerQuery" SET DATA TYPE DOUBLE PRECISION,
DROP COLUMN "endStatus",
ADD COLUMN     "endStatus" TEXT NOT NULL,
ALTER COLUMN "positivenessScore" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "messages" SET NOT NULL,
ALTER COLUMN "comment" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Customer_id_key" ON "Customer"("id");

-- AddForeignKey
ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerSatisfaction" ADD CONSTRAINT "CustomerSatisfaction_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
