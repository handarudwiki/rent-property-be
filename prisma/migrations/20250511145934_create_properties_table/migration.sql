-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('Rooms', 'Tinyhouse', 'Apartment', 'Villa', 'Townhouse', 'Cottage');

-- CreateTable
CREATE TABLE "properties" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "pricePerMonth" DOUBLE PRECISION NOT NULL,
    "securityDeposit" DOUBLE PRECISION NOT NULL,
    "applicationFee" DOUBLE PRECISION NOT NULL,
    "isPetsAllowed" BOOLEAN NOT NULL DEFAULT false,
    "isParkingIncluded" BOOLEAN NOT NULL DEFAULT false,
    "beds" INTEGER NOT NULL,
    "baths" DOUBLE PRECISION NOT NULL,
    "squareFeet" INTEGER NOT NULL,
    "propertyType" "PropertyType" NOT NULL,
    "averageRating" DOUBLE PRECISION DEFAULT 0,
    "numberOfReviews" INTEGER DEFAULT 0,
    "locationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
