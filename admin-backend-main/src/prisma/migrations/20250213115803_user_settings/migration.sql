-- CreateTable
CREATE TABLE "UserSetting" (
    "username" TEXT NOT NULL,
    "favoriteCharts" TEXT[],

    CONSTRAINT "UserSetting_pkey" PRIMARY KEY ("username")
);
