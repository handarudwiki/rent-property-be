/*
  Warnings:

  - Added the required column `managerId` to the `properties` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "managerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "managers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
