-- CreateTable
CREATE TABLE "JamSession" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "hostId" INTEGER NOT NULL,
    "currentTrackId" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JamSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JamParticipant" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JamParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JamParticipant_userId_sessionId_key" ON "JamParticipant"("userId", "sessionId");

-- AddForeignKey
ALTER TABLE "JamSession" ADD CONSTRAINT "JamSession_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JamSession" ADD CONSTRAINT "JamSession_currentTrackId_fkey" FOREIGN KEY ("currentTrackId") REFERENCES "Track"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JamParticipant" ADD CONSTRAINT "JamParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JamParticipant" ADD CONSTRAINT "JamParticipant_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "JamSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
