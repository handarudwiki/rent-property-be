/*
  Warnings:

  - Added the required column `email` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `applications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "applications" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "leaseId" TEXT,
ADD COLUMN     "message" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_leaseId_fkey" FOREIGN KEY ("leaseId") REFERENCES "leases"("id") ON DELETE SET NULL ON UPDATE CASCADE;
