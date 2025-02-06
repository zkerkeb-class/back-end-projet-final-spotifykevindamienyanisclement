-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artiste" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Artiste_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MusicAlbum" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "artisteId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MusicAlbum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Track" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "albumId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaylistMusic" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlaylistMusic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "MusicAlbum" ADD CONSTRAINT "MusicAlbum_artisteId_fkey" FOREIGN KEY ("artisteId") REFERENCES "Artiste"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "MusicAlbum"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistMusic" ADD CONSTRAINT "PlaylistMusic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
