-- DropForeignKey
ALTER TABLE "Album" DROP CONSTRAINT "Album_artistId_fkey";

-- DropForeignKey
ALTER TABLE "Album" DROP CONSTRAINT "Album_groupId_fkey";

-- DropForeignKey
ALTER TABLE "Album" DROP CONSTRAINT "Album_imageId_fkey";

-- DropForeignKey
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "Group" DROP CONSTRAINT "Group_imageId_fkey";

-- DropForeignKey
ALTER TABLE "Playlist" DROP CONSTRAINT "Playlist_imageId_fkey";

-- DropForeignKey
ALTER TABLE "Playlist" DROP CONSTRAINT "Playlist_userId_fkey";

-- DropForeignKey
ALTER TABLE "Track" DROP CONSTRAINT "Track_albumId_fkey";

-- DropForeignKey
ALTER TABLE "Track" DROP CONSTRAINT "Track_artistId_fkey";

-- DropForeignKey
ALTER TABLE "Track" DROP CONSTRAINT "Track_groupId_fkey";

-- DropForeignKey
ALTER TABLE "Track" DROP CONSTRAINT "Track_playlistId_fkey";

-- DropForeignKey
ALTER TABLE "Track" DROP CONSTRAINT "Track_soundId_fkey";

-- DropForeignKey
ALTER TABLE "TrackRead" DROP CONSTRAINT "TrackRead_trackId_fkey";

-- DropForeignKey
ALTER TABLE "TrackRead" DROP CONSTRAINT "TrackRead_userId_fkey";

-- DropForeignKey
ALTER TABLE "artist" DROP CONSTRAINT "artist_groupId_fkey";

-- DropForeignKey
ALTER TABLE "artist" DROP CONSTRAINT "artist_imageId_fkey";

-- AddForeignKey
ALTER TABLE "TrackRead" ADD CONSTRAINT "TrackRead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackRead" ADD CONSTRAINT "TrackRead_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artist" ADD CONSTRAINT "artist_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artist" ADD CONSTRAINT "artist_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_soundId_fkey" FOREIGN KEY ("soundId") REFERENCES "Sound"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
