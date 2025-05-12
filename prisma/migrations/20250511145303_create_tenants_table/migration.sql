/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `managers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phoneNumber]` on the table `managers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "tenants" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenants_email_key" ON "tenants"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_phoneNumber_key" ON "tenants"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "managers_email_key" ON "managers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "managers_phoneNumber_key" ON "managers"("phoneNumber");
