-- CreateTable
CREATE TABLE "SystemMetric" (
    "id" TEXT NOT NULL DEFAULT 'global_metrics',
    "totalRedeem" INTEGER NOT NULL DEFAULT 0,
    "totalIdUsed" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActiveSession" (
    "id" TEXT NOT NULL,
    "clientIp" TEXT NOT NULL,
    "lastActive" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActiveSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ActiveSession_clientIp_key" ON "ActiveSession"("clientIp");
