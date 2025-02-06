-- AlterTable
ALTER TABLE "Track" ADD COLUMN     "groupId" INTEGER;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;
