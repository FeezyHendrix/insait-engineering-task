-- CreateTable
CREATE TABLE "Templates" (
    "templateId" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "Templates_pkey" PRIMARY KEY ("templateId")
);
