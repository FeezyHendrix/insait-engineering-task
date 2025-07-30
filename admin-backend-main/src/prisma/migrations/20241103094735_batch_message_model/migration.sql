-- CreateTable
CREATE TABLE "BatchMessage" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recipient" TEXT NOT NULL,
    "subject" TEXT,
    "sender" TEXT NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "BatchMessage_pkey" PRIMARY KEY ("id")
);
