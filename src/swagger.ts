const generateSwagger = require('swagger-autogen')();
const dotenv = require('dotenv');
dotenv.config();

const doc = {
    info: {
        version: '1.0.0',
        title: 'Spotify API',
        description: 'Spotify API Documentation',
    },
    host: process.env.HOST,
    basePath: '/',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        {
            name: 'Auth',
            description: 'auth related apis',
        },
        {
            name: 'Upload',
            description: 'Upload related apis',
        },
        {
            name: 'Album',
            description: 'Album related apis',
        },
        {
            name: 'Artist',
            description: 'Artist related apis',
        },
        {
            name: 'PlaylistMusic',
            description: 'Playlist related apis',
        },
        {
            name: 'Artist',
            description: 'ArtistGroups related apis',
        },
    ],
    securityDefinitions: {},
    definitions: {
        'successResponse.200': {
            code: 200,
            message: 'Success',
        },
        'successResponse.201': {
            code: 201,
            message: 'Created',
        },
        'errorResponse.400': {
            code: 400,
            message:
                'The request was malformed or invalid. Please check the request parameters.',
        },
        'errorResponse.401': {
            code: 401,
            message:
                'Authentication failed or user lacks proper authorization.',
        },
        'errorResponse.403': {
            code: 403,
            message: 'You do not have permission to access this resource.',
        },
        'errorResponse.404': {
            code: 404,
            message: 'The requested resource could not be found on the server.',
        },
        'errorResponse.500': {
            code: 500,
            message:
                'An unexpected error occurred on the server. Please try again later.',
        },

        // files
        file: {
            type: 'object',
            properties: {
                file: {
                    type: 'file',
                    description: 'Fichier à uploader',
                    in: 'formData',
                },
            },
            required: ['file'],
        },
        soundResponse: {
            id: 1,
            duration: 1,

            originalSoundName: 'originalSoundName',
            originalSoundURL: '/originalSoundURL',
            wavSoundName: 'wavSoundName',
            wavSoundURL: '/wavSoundURL',
            m4aSoundName: 'm4aSoundName',
            m4aSoundURL: '/m4aSoundURL',
            createdAt: '2021-09-01T00:00:00.000Z',
            updatedAt: '2021-09-01T00:00:00.000Z',
        },

        imageResponse: {
            id: 1,
            formattedImageName: 'formattedImageName',
            formattedImageURL: '/formattedImageURL',
            originalImageName: 'originalImageName',
            originalImageURL: '/originalImageURL',
            avifImageName: 'avifImageName',
            avifImageURL: '/avifImageURL',
            smallImageName: 'smallImageName',
            smallImageURL: '/smallImageURL',
            mediumImageName: 'mediumImageName',
            mediumImageURL: '/mediumImageURL',
            largeImageName: 'largeImageName',
            largeImageURL: '/largeImageURL',
            createdAt: '2021-09-01T00:00:00.000Z',
            updatedAt: '2021-09-01T00:00:00.000Z',
        },

        albumCreate: {
            $title: 'Album Title',
            $artisteId: 1,
            $groupId: 1,
            $imageId: 1,
            $tracks: [
                {
                    $title: 'Track Title',
                    $soundId: 1,
                },
            ],
        },

        albumResponse: {
            id: 1,
            title: 'Album Title',
            image: { $ref: '#/definitions/imageResponse' },
            createdAt: '2021-09-01T00:00:00.000Z',
            updatedAt: '2021-09-01T00:00:00.000Z',
        },

        albumResponseFull: {
            id: 1,
            title: 'Album Title',
            artiste: { $ref: '#/definitions/artistResponse' },
            group: { $ref: '#/definitions/groupResponse' },
            image: { $ref: '#/definitions/imageResponse' },
            tracks: [
                {
                    id: 1,
                    title: 'Track Title',
                    sound: { $ref: '#/definitions/soundResponse' },
                    albumId: 1,
                    createdAt: '2021-09-01T00:00:00.000Z',
                    updatedAt: '2021-09-01T00:00:00.000Z',
                },
            ],
            createdAt: '2021-09-01T00:00:00.000Z',
            updatedAt: '2021-09-01T00:00:00.000Z',
        },

        artistCreate: {
            $name: 'Artist Name',
            $imageId: 1,
        },

        artistResponse: {
            $id: 1,
            $name: 'Artist Name',
            $image: { $ref: '#/definitions/imageResponse' },
            $createdAt: '2021-09-01T00:00:00.000Z',
            $updatedAt: '2021-09-01T00:00:00.000Z',
        },

        artistResponseFull: {
            $id: 1,
            $name: 'Artist Name',
            $image: { $ref: '#/definitions/imageResponse' },
            $albums: [{ $ref: '#/definitions/albumResponse' }],
            $createdAt: '2021-09-01T00:00:00.000Z',
            $updatedAt: '2021-09-01T00:00:00.000Z',
        },

        trackCreate: {
            $title: 'Track Title',
            $albumId: 1,
            $soundId: 1,
        },

        trackRequest: {
            $title: 'Track Title',
            $sound: { $ref: '#/definitions/soundResponse' },
            $album: { $ref: '#/definitions/albumResponse' },
        },

        groupCreate: {
            $name: 'Group Name',
            $imageId: 1,
            $artists: [
                {
                    artistId: 1,
                },
            ],
        },

        groupResponse: {
            id: 1,
            name: 'Group Name',
            image: { $ref: '#/definitions/imageResponse' },
            createdAt: '2021-09-01T00:00:00.000Z',
            updatedAt: '2021-09-01T00:00:00.000Z',
        },

        groupResponseFull: {
            id: 1,
            name: 'Group Name',
            image: { $ref: '#/definitions/imageResponse' },
            artists: [{ $ref: '#/definitions/artistResponse' }],
            albums: [{ $ref: '#/definitions/albumResponse' }],
            createdAt: '2021-09-01T00:00:00.000Z',
            updatedAt: '2021-09-01T00:00:00.000Z',
        },
    },
};

const outputFile = './docs/swagger.json';
const routes = [
    './routes/index.ts',
    './routes/auth.route.ts',
    './routes/upload.route.ts',
];

generateSwagger(outputFile, routes, doc);
