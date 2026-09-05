-- CreateTable
CREATE TABLE "Hardware" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "specs" TEXT NOT NULL,
    "tdp" INTEGER,
    "msrp" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hardware_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Price" (
    "id" SERIAL NOT NULL,
    "hardwareId" INTEGER NOT NULL,
    "platform" TEXT NOT NULL,
    "shopName" TEXT NOT NULL,
    "productUrl" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "originalPrice" INTEGER,
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "crawledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Price_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PresetConfig" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "budgetMin" INTEGER NOT NULL,
    "budgetMax" INTEGER NOT NULL,
    "useCase" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "components" TEXT NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "description" TEXT,
    "source" TEXT,
    "sourceUrl" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PresetConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompatibilityRule" (
    "id" SERIAL NOT NULL,
    "ruleType" TEXT NOT NULL,
    "categoryA" TEXT NOT NULL,
    "categoryB" TEXT,
    "condition" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "suggestion" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompatibilityRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrawlTask" (
    "id" SERIAL NOT NULL,
    "hardwareId" INTEGER NOT NULL,
    "platform" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "lastSuccessAt" TIMESTAMP(3),
    "lastError" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "nextRunAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CrawlTask_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Hardware_category_idx" ON "Hardware"("category");

-- CreateIndex
CREATE INDEX "Hardware_brand_idx" ON "Hardware"("brand");

-- CreateIndex
CREATE INDEX "Price_hardwareId_idx" ON "Price"("hardwareId");

-- CreateIndex
CREATE INDEX "Price_crawledAt_idx" ON "Price"("crawledAt");

-- CreateIndex
CREATE INDEX "Price_platform_idx" ON "Price"("platform");

-- CreateIndex
CREATE INDEX "PresetConfig_useCase_idx" ON "PresetConfig"("useCase");

-- CreateIndex
CREATE INDEX "PresetConfig_budgetMin_budgetMax_idx" ON "PresetConfig"("budgetMin", "budgetMax");

-- CreateIndex
CREATE INDEX "CrawlTask_hardwareId_idx" ON "CrawlTask"("hardwareId");

-- CreateIndex
CREATE INDEX "CrawlTask_status_idx" ON "CrawlTask"("status");

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_hardwareId_fkey" FOREIGN KEY ("hardwareId") REFERENCES "Hardware"("id") ON DELETE CASCADE ON UPDATE CASCADE;
