-- CreateTable
CREATE TABLE "Knowledge" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT,
    "url" TEXT,
    "createdAt" TEXT NOT NULL,
    "product" TEXT NOT NULL,

    CONSTRAINT "Knowledge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Knowledge_id_key" ON "Knowledge"("id");
