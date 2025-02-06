const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

async function updateTrackSounds() {
    try {
        console.info('Starting to update track sounds...');

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
                        duration: faker.number.int({ min: 120, max: 300 }), // Entre 2min et 5min
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
        console.error('Error in updateTrackSounds:', error);
        throw error;
    }
}

async function main() {
    try {
        if (process.argv.includes('--update-sounds')) {
            console.info('Starting sound update process...');
            await updateTrackSounds();
            console.info('Sound update process completed successfully');
        } else {
            // Nombre de fausses données à générer
            const NUM_GROUPS = 5;
            const NUM_ARTISTS = 15;
            const NUM_ALBUMS = 20;
            const NUM_TRACKS_PER_ALBUM = 10;

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

            // -------------------------
            // Etape 1 : Créer des Images
            // -------------------------
            const images = [];
            for (let i = 0; i < NUM_GROUPS + NUM_ARTISTS + NUM_ALBUMS; i++) {
                const image = await prisma.image.create({
                    data: {
                        originalImageName: faker.system.fileName(),
                        originalImageURL: faker.image.url(),
                        formattedImageName: faker.system.fileName(),
                        formattedImageURL: faker.image.url(),
                        avifImageName: faker.system.fileName(),
                        avifImageURL: faker.image.url(),
                        smallImageName: faker.system.fileName(),
                        smallImageURL: faker.image.url(),
                        mediumImageName: faker.system.fileName(),
                        mediumImageURL: faker.image.url(),
                        largeImageName: faker.system.fileName(),
                        largeImageURL: faker.image.url(),
                    },
                });
                images.push(image);
            }

            // -------------------------
            // Etape 2 : Créer des Groups
            // -------------------------
            const groups = [];
            for (let i = 0; i < NUM_GROUPS; i++) {
                const group = await prisma.group.create({
                    data: {
                        name: faker.company.name(),
                        imageId: images[i].id, // Associe une image
                    },
                });
                groups.push(group);
            }

            // -------------------------
            // Etape 3 : Créer des Artists
            // -------------------------
            const artists = [];
            for (let i = 0; i < NUM_ARTISTS; i++) {
                const artistGroup = faker.helpers.arrayElement(groups); // Associe un groupe aléatoire
                const artist = await prisma.artist.create({
                    data: {
                        name: faker.person.fullName(),
                        imageId: faker.helpers.arrayElement(images).id, // Associe une image aléatoire
                        groupId: artistGroup.id, // Associe un groupe au hasard
                    },
                });
                artists.push(artist);
            }

            // -------------------------
            // Etape 4 : Créer des Albums
            // -------------------------
            const albums = [];
            for (let i = 0; i < NUM_ALBUMS; i++) {
                const albumArtist = faker.helpers.arrayElement(artists); // Associe un artiste aléatoire
                const albumGroup = albumArtist.groupId
                    ? await prisma.group.findUnique({
                          where: { id: albumArtist.groupId },
                      }) // Associe le même groupe que l'artiste, le cas échéant
                    : null;

                const album = await prisma.album.create({
                    data: {
                        title: faker.music.album(),
                        imageId: faker.helpers.arrayElement(images).id, // Associe une image
                        artistId: albumArtist.id, // Associe un artiste
                        groupId: albumGroup?.id || null, // Associe un groupe
                    },
                });
                albums.push(album);
            }

            // -------------------------
            // Etape 5 : Créer des Sons (Sounds)
            // -------------------------
            const sounds = [];
            for (let i = 0; i < NUM_ALBUMS * NUM_TRACKS_PER_ALBUM; i++) {
                const sound = await prisma.sound.create({
                    data: {
                        duration: faker.number.int({ min: 120, max: 300 }), // Entre 2min et 5min
                        originalSoundName: faker.music.songName(),
                        originalSoundURL:
                            SOUND_URLS[
                                Math.floor(Math.random() * SOUND_URLS.length)
                            ],
                        wavSoundName: faker.system.fileName(),
                        wavSoundURL:
                            SOUND_URLS[
                                Math.floor(Math.random() * SOUND_URLS.length)
                            ],
                        m4aSoundName: faker.system.fileName(),
                        m4aSoundURL:
                            SOUND_URLS[
                                Math.floor(Math.random() * SOUND_URLS.length)
                            ],
                    },
                });
                sounds.push(sound);
            }

            // -------------------------
            // Etape 6 : Créer des Tracks
            // -------------------------
            const tracks = [];
            for (const album of albums) {
                for (let i = 0; i < NUM_TRACKS_PER_ALBUM; i++) {
                    const trackSound = faker.helpers.arrayElement(sounds); // Associe un son aléatoire
                    const trackArtist = faker.helpers.arrayElement(artists); // Associe un artiste aléatoire

                    const track = await prisma.track.create({
                        data: {
                            title: faker.music.songName(),
                            albumId: album.id, // Associe un album
                            soundId: trackSound.id, // Associe un son
                            artistId: trackArtist.id, // Associe un artiste
                            groupId: trackArtist.groupId, // Associe un groupe (le cas échéant)
                        },
                    });
                    tracks.push(track);
                }
            }
        }

        console.log('Base de données mise à jour avec succès!');
    } catch (error) {
        console.error('Error in main:', error);
        throw error;
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
