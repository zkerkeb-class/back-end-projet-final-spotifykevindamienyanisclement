-- CreateTable
CREATE TABLE "TrackRead" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "trackId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrackRead_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TrackRead" ADD CONSTRAINT "TrackRead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackRead" ADD CONSTRAINT "TrackRead_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
