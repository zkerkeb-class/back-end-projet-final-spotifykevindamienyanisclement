const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

const SOUND_URLS = [
    'https://cdn.pixabay.com/audio/2024/12/02/audio_4255c48290.mp3',
    'https://cdn.pixabay.com/audio/2024/12/09/audio_5c5be993bd.mp3',
    'https://cdn.pixabay.com/audio/2024/11/05/audio_da986d1e2a.mp3',
    'https://cdn.pixabay.com/audio/2024/06/14/audio_0e2636099d.mp3',
    'https://cdn.pixabay.com/audio/2024/03/22/audio_1ef53377ba.mp3',
    'https://cdn.pixabay.com/audio/2024/04/07/audio_7917e14f03.mp3',
    'https://cdn.pixabay.com/audio/2025/02/03/audio_502e27ab2b.mp3',
    'https://cdn.pixabay.com/audio/2024/11/29/audio_45bbd49c34.mp3',
    'https://cdn.pixabay.com/audio/2024/11/10/audio_593e8523e6.mp3',
    'https://cdn.pixabay.com/audio/2024/11/08/audio_05b10daae7.mp3',
    'https://cdn.pixabay.com/audio/2024/11/05/audio_da986d1e2a.mp3',
    'https://cdn.pixabay.com/audio/2024/10/18/audio_883a8b2ed8.mp3',
    'https://cdn.pixabay.com/audio/2024/09/16/audio_a10608d6cd.mp3',
    'https://cdn.pixabay.com/audio/2024/09/09/audio_7556bb3a41.mp3',
    'https://cdn.pixabay.com/audio/2024/07/30/audio_09a1a55404.mp3',
    'https://cdn.pixabay.com/audio/2024/07/24/audio_5ec636ca14.mp3',
    'https://cdn.pixabay.com/audio/2024/06/25/audio_7bfb8d2ab0.mp3',
    'https://cdn.pixabay.com/audio/2024/06/14/audio_0e2636099d.mp3',
    'https://cdn.pixabay.com/audio/2024/06/13/audio_8822cea290.mp3',
    'https://cdn.pixabay.com/audio/2024/05/24/audio_46382ae035.mp3',
    'https://cdn.pixabay.com/audio/2024/04/14/audio_5d6668b1f0.mp3',
    'https://cdn.pixabay.com/audio/2024/04/12/audio_3118cb3f2a.mp3',
    'https://cdn.pixabay.com/audio/2024/04/07/audio_7917e14f03.mp3',
    'https://cdn.pixabay.com/audio/2024/02/14/audio_b9bc3934cc.mp3',
    'https://cdn.pixabay.com/audio/2024/01/16/audio_e2b992254f.mp3',
];

async function updateSounds() {
    try {
        console.info('Starting sound update process...');

        const tracks = await prisma.track.findMany({
            where: {
                soundId: {
                    not: null,
                },
            },
            include: {
                sound: true,
            },
        });

        console.info(`Found ${tracks.length} tracks to update`);

        let updatedCount = 0;
        for (const track of tracks) {
            if (!track.soundId) continue;

            try {
                const randomSoundUrl =
                    SOUND_URLS[Math.floor(Math.random() * SOUND_URLS.length)];

                await prisma.sound.update({
                    where: {
                        id: track.soundId,
                    },
                    data: {
                        duration: faker.number.int({ min: 120, max: 300 }),
                        originalSoundName: faker.music.songName(),
                        originalSoundURL: randomSoundUrl,
                        wavSoundName: `${faker.system.fileName()}.wav`,
                        wavSoundURL: randomSoundUrl,
                        m4aSoundName: `${faker.system.fileName()}.m4a`,
                        m4aSoundURL: randomSoundUrl,
                    },
                });

                updatedCount++;
                console.info(
                    `Updated sound for track: ${track.title} (ID: ${track.id})`,
                );
            } catch (error) {
                console.error(
                    `Failed to update sound for track ${track.id}: ${error.message}`,
                );
                continue;
            }
        }

        console.info(
            `Successfully updated ${updatedCount}/${tracks.length} track sounds`,
        );
    } catch (error) {
        console.error('Error in updateSounds:', error);
        throw error;
    }
}

if (require.main === module) {
    updateSounds()
        .then(async () => {
            await prisma.$disconnect();
        })
        .catch(async (e) => {
            console.error(e);
            await prisma.$disconnect();
            process.exit(1);
        });
}
