-- CreateTable
CREATE TABLE "Hardware" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "category" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "specs" TEXT NOT NULL,
    "tdp" INTEGER,
    "msrp" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Price" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hardwareId" INTEGER NOT NULL,
    "platform" TEXT NOT NULL,
    "shopName" TEXT NOT NULL,
    "productUrl" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "originalPrice" INTEGER,
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "crawledAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Price_hardwareId_fkey" FOREIGN KEY ("hardwareId") REFERENCES "Hardware" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PresetConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CompatibilityRule" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ruleType" TEXT NOT NULL,
    "categoryA" TEXT NOT NULL,
    "categoryB" TEXT,
    "condition" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "suggestion" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "CrawlTask" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hardwareId" INTEGER NOT NULL,
    "platform" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "lastSuccessAt" DATETIME,
    "lastError" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "nextRunAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
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
