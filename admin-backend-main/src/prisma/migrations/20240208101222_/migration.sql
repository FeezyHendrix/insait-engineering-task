-- CreateTable
CREATE TABLE "ChartConfig" (
    "id" SERIAL NOT NULL,
    "chartName" TEXT NOT NULL,
    "Active" BOOLEAN NOT NULL,

    CONSTRAINT "ChartConfig_pkey" PRIMARY KEY ("id")
);
