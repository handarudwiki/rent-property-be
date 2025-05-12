/*
  Warnings:

  - You are about to drop the column `photoUrls` on the `properties` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "properties" DROP COLUMN "photoUrls",
ADD COLUMN     "publicsId" TEXT[];
