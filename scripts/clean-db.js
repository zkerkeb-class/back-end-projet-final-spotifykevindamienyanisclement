const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanDatabase() {
    try {
        console.info('Starting database cleanup...');

        // Supprimer dans l'ordre pour respecter les contraintes de clés étrangères
        await prisma.trackRead.deleteMany({});
        await prisma.track.deleteMany({});
        await prisma.sound.deleteMany({});
        await prisma.album.deleteMany({});
        await prisma.artist.deleteMany({});
        await prisma.group.deleteMany({});
        await prisma.image.deleteMany({});
        await prisma.playlist.deleteMany({});
        await prisma.auditLog.deleteMany({});
        await prisma.user.deleteMany({});

        console.info('Database cleanup completed successfully');
    } catch (error) {
        console.error('Error in database cleanup:', error);
        throw error;
    }
}

if (require.main === module) {
    cleanDatabase()
        .then(async () => {
            await prisma.$disconnect();
        })
        .catch(async (e) => {
            console.error(e);
            await prisma.$disconnect();
            process.exit(1);
        });
}
