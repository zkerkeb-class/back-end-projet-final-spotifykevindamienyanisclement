/*
  Warnings:

  - You are about to drop the column `artistGroupId` on the `Artiste` table. All the data in the column will be lost.
  - You are about to drop the `ArtistGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MusicAlbum` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlaylistMusic` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Artiste" DROP CONSTRAINT "Artiste_artistGroupId_fkey";

-- DropForeignKey
ALTER TABLE "MusicAlbum" DROP CONSTRAINT "MusicAlbum_artisteId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistMusic" DROP CONSTRAINT "PlaylistMusic_userId_fkey";

-- DropForeignKey
ALTER TABLE "Track" DROP CONSTRAINT "Track_albumId_fkey";

-- AlterTable
ALTER TABLE "Artiste" DROP COLUMN "artistGroupId",
ADD COLUMN     "groupId" INTEGER,
ADD COLUMN     "imageId" INTEGER;

-- AlterTable
ALTER TABLE "Track" ADD COLUMN     "artisteId" INTEGER,
ADD COLUMN     "playlistId" INTEGER,
ADD COLUMN     "soundId" INTEGER;

-- DropTable
DROP TABLE "ArtistGroup";

-- DropTable
DROP TABLE "MusicAlbum";

-- DropTable
DROP TABLE "PlaylistMusic";

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "formattedImageName" TEXT NOT NULL,
    "formattedImageURL" TEXT NOT NULL,
    "originalImageName" TEXT NOT NULL,
    "originalImageURL" TEXT NOT NULL,
    "avifImageName" TEXT NOT NULL,
    "avifImageURL" TEXT NOT NULL,
    "smallImageName" TEXT NOT NULL,
    "smallImageURL" TEXT NOT NULL,
    "mediumImageName" TEXT NOT NULL,
    "mediumImageURL" TEXT NOT NULL,
    "largeImageName" TEXT NOT NULL,
    "largeImageURL" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sound" (
    "id" SERIAL NOT NULL,
    "duration" INTEGER NOT NULL,
    "originalSoundName" TEXT NOT NULL,
    "originalSoundURL" TEXT NOT NULL,
    "wavSoundName" TEXT NOT NULL,
    "wavSoundURL" TEXT NOT NULL,
    "m4aSoundName" TEXT NOT NULL,
    "m4aSoundURL" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sound_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Album" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "imageId" INTEGER,
    "artisteId" INTEGER,
    "groupId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Album_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Playlist" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "imageId" INTEGER,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Playlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "imageId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Artiste" ADD CONSTRAINT "Artiste_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artiste" ADD CONSTRAINT "Artiste_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_artisteId_fkey" FOREIGN KEY ("artisteId") REFERENCES "Artiste"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_soundId_fkey" FOREIGN KEY ("soundId") REFERENCES "Sound"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_artisteId_fkey" FOREIGN KEY ("artisteId") REFERENCES "Artiste"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;
