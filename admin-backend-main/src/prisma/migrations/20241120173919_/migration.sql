-- CreateTable
CREATE TABLE "DocumentKnowledge" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "hash" VARCHAR(64) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentKnowledge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DocumentKnowledge_name_key" ON "DocumentKnowledge"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentKnowledge_hash_key" ON "DocumentKnowledge"("hash");
