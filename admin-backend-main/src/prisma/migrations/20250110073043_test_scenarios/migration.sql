-- CreateEnum
CREATE TYPE "TestScenarioType" AS ENUM ('QA', 'SESSION');

-- CreateEnum
CREATE TYPE "TestRunStatus" AS ENUM ('SUCCESS', 'FAILURE', 'PENDING');

-- AlterTable
ALTER TABLE "Interaction" ADD COLUMN     "testRunId" TEXT;

-- CreateTable
CREATE TABLE "TestRun" (
    "testRunId" TEXT NOT NULL,
    "status" "TestRunStatus" NOT NULL DEFAULT 'PENDING',
    "runDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "testScenarioId" TEXT,

    CONSTRAINT "TestRun_pkey" PRIMARY KEY ("testRunId")
);

-- CreateTable
CREATE TABLE "TestScenario" (
    "testScenarioId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "TestScenarioType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "questions" TEXT[],

    CONSTRAINT "TestScenario_pkey" PRIMARY KEY ("testScenarioId")
);

-- AddForeignKey
ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_testRunId_fkey" FOREIGN KEY ("testRunId") REFERENCES "TestRun"("testRunId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestRun" ADD CONSTRAINT "TestRun_testScenarioId_fkey" FOREIGN KEY ("testScenarioId") REFERENCES "TestScenario"("testScenarioId") ON DELETE SET NULL ON UPDATE CASCADE;
