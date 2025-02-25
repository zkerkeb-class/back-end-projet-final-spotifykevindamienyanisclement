-- CreateTable
CREATE TABLE "PerformanceMetric" (
    "id" SERIAL NOT NULL,
    "method" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,
    "responseTime" DOUBLE PRECISION NOT NULL,
    "statusCodeDistribution" JSONB NOT NULL,
    "heapUsed" DOUBLE PRECISION NOT NULL,
    "heapTotal" DOUBLE PRECISION NOT NULL,
    "rss" DOUBLE PRECISION NOT NULL,
    "cpu" DOUBLE PRECISION,
    "bandwidth" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PerformanceMetric_pkey" PRIMARY KEY ("id")
);
