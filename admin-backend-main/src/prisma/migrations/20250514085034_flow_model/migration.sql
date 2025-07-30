-- AlterTable
ALTER TABLE "Interaction" ADD COLUMN     "flowId" TEXT;

-- CreateTable
CREATE TABLE "Flow" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Flow_id_key" ON "Flow"("id");

-- AddForeignKey
ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "Flow"("id") ON DELETE SET NULL ON UPDATE CASCADE;
