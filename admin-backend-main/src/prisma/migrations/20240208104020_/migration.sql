/*
  Warnings:

  - You are about to drop the column `Active` on the `ChartConfig` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[chartName]` on the table `ChartConfig` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `active` to the `ChartConfig` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChartConfig" DROP COLUMN "Active",
ADD COLUMN     "active" BOOLEAN NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ChartConfig_chartName_key" ON "ChartConfig"("chartName");
