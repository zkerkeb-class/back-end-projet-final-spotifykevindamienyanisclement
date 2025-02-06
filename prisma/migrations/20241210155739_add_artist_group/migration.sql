-- AlterTable
ALTER TABLE "Artiste" ADD COLUMN     "artistGroupId" INTEGER;

-- CreateTable
CREATE TABLE "ArtistGroup" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArtistGroup_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Artiste" ADD CONSTRAINT "Artiste_artistGroupId_fkey" FOREIGN KEY ("artistGroupId") REFERENCES "ArtistGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;
