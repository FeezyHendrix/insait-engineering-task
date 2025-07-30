-- CreateEnum
CREATE TYPE "EndStatus" AS ENUM ('completion', 'customerService', 'dropOff');

-- CreateTable
CREATE TABLE "Interaction" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "startedTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "avgResponseTimePerQuery" INTEGER NOT NULL,
    "endStatus" "EndStatus" NOT NULL,
    "positivenessScore" INTEGER NOT NULL,
    "complexityScore" DOUBLE PRECISION NOT NULL,
    "speed" INTEGER NOT NULL,
    "messages" JSONB,
    "comment" TEXT,

    CONSTRAINT "Interaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "personaClassification" TEXT NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "available" BOOLEAN NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerSatisfaction" (
    "id" SERIAL NOT NULL,
    "interactionId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "comments" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "CustomerSatisfaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoppedInteractions" (
    "id" SERIAL NOT NULL,
    "interactionId" INTEGER NOT NULL,
    "step" TEXT NOT NULL,
    "abandonTimestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoppedInteractions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "popularProducts" (
    "id" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "popularProducts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnomalyQuestions" (
    "id" SERIAL NOT NULL,
    "interactionId" INTEGER NOT NULL,
    "anomalyRate" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnomalyQuestions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agreements" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "openDate" TIMESTAMP(3) NOT NULL,
    "interactionId" INTEGER NOT NULL,

    CONSTRAINT "Agreements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FAQs" (
    "id" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "FAQs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Errors" (
    "id" SERIAL NOT NULL,
    "interactionId" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Errors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DropoffQuestions" (
    "id" SERIAL NOT NULL,
    "interactionId" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "productId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "DropoffQuestions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "customerId" ON "Interaction"("customerId");

-- CreateIndex
CREATE INDEX "productId" ON "Interaction"("productId");

-- CreateIndex
CREATE INDEX "fullNameIndex" ON "Customer"("firstName", "lastName");

-- CreateIndex
CREATE UNIQUE INDEX "Product_name_key" ON "Product"("name");

-- AddForeignKey
ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerSatisfaction" ADD CONSTRAINT "CustomerSatisfaction_interactionId_fkey" FOREIGN KEY ("interactionId") REFERENCES "Interaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerSatisfaction" ADD CONSTRAINT "CustomerSatisfaction_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoppedInteractions" ADD CONSTRAINT "StoppedInteractions_interactionId_fkey" FOREIGN KEY ("interactionId") REFERENCES "Interaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "popularProducts" ADD CONSTRAINT "popularProducts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnomalyQuestions" ADD CONSTRAINT "AnomalyQuestions_interactionId_fkey" FOREIGN KEY ("interactionId") REFERENCES "Interaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agreements" ADD CONSTRAINT "Agreements_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agreements" ADD CONSTRAINT "Agreements_interactionId_fkey" FOREIGN KEY ("interactionId") REFERENCES "Interaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FAQs" ADD CONSTRAINT "FAQs_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Errors" ADD CONSTRAINT "Errors_interactionId_fkey" FOREIGN KEY ("interactionId") REFERENCES "Interaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DropoffQuestions" ADD CONSTRAINT "DropoffQuestions_interactionId_fkey" FOREIGN KEY ("interactionId") REFERENCES "Interaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DropoffQuestions" ADD CONSTRAINT "DropoffQuestions_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
