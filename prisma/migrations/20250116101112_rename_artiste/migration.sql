/*
  Warnings:

  - You are about to drop the column `artisteId` on the `Album` table. All the data in the column will be lost.
  - You are about to drop the column `artisteId` on the `Track` table. All the data in the column will be lost.
  - You are about to drop the `Artiste` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Album" DROP CONSTRAINT "Album_artisteId_fkey";

-- DropForeignKey
ALTER TABLE "Artiste" DROP CONSTRAINT "Artiste_groupId_fkey";

-- DropForeignKey
ALTER TABLE "Artiste" DROP CONSTRAINT "Artiste_imageId_fkey";

-- DropForeignKey
ALTER TABLE "Track" DROP CONSTRAINT "Track_artisteId_fkey";

-- AlterTable
ALTER TABLE "Album" DROP COLUMN "artisteId",
ADD COLUMN     "artistId" INTEGER;

-- AlterTable
ALTER TABLE "Track" DROP COLUMN "artisteId",
ADD COLUMN     "artistId" INTEGER;

-- DropTable
DROP TABLE "Artiste";

-- CreateTable
CREATE TABLE "artist" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "imageId" INTEGER,
    "groupId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "artist_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "artist" ADD CONSTRAINT "artist_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artist" ADD CONSTRAINT "artist_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artist"("id") ON DELETE SET NULL ON UPDATE CASCADE;
