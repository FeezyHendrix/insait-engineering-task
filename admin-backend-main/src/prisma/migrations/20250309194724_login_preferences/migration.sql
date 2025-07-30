-- CreateEnum
CREATE TYPE "LoginProvider" AS ENUM ('microsoft', 'google', 'other');

-- CreateEnum
CREATE TYPE "LoginPreferenceStatus" AS ENUM ('PENDING', 'LOADING', 'COMPLETED', 'ERROR');

-- CreateTable
CREATE TABLE "LoginPreference" (
    "loginPreferenceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "provider" "LoginProvider" NOT NULL,
    "clientId" TEXT,
    "tenantId" TEXT,
    "hostedDomain" TEXT,
    "status" "LoginPreferenceStatus" NOT NULL DEFAULT 'PENDING',
    "statusString" TEXT DEFAULT 'triggering prefect flow',
    "prefectFlowId" TEXT,

    CONSTRAINT "LoginPreference_pkey" PRIMARY KEY ("loginPreferenceId")
);
