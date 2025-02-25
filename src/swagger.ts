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
            name: 'Playlist',
            description: 'Playlist related apis',
        },
        {
            name: 'Artist',
            description: 'Groups related apis',
        },
        {
            name: 'User',
            description: 'User related apis',
        },
        {
            name: 'Metrics',
            description: 'Metrics related apis',
        },
        {
            name: 'JamSession',
            description: 'JamSession related apis',
        },
    ],
    securityDefinitions: {
        bearerAuth: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
            description:
                'Entrez votre token JWT avec le préfixe Bearer. Exemple: Bearer <token>',
        },
    },
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
            $artistId: 1,
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
            $groupIds: [1],
            $createdAt: '2021-09-01T00:00:00.000Z',
            $updatedAt: '2021-09-01T00:00:00.000Z',
        },

        artistResponseFull: {
            $id: 1,
            $name: 'Artist Name',
            $image: { $ref: '#/definitions/imageResponse' },
            $albums: [{ $ref: '#/definitions/albumResponse' }],
            $groupIds: [1],
            $groups: [{ $ref: '#/definitions/groupResponse' }],
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

        userResponse: {
            id: 1,
            name: 'name',
            email: 'email',
            createdAt: '2021-09-01T00:00:00.000Z',
            updatedAt: '2021-09-01T00:00:00.000Z',
        },

        userResponseFull: {
            id: 1,
            name: 'name',
            email: 'email',
            playlists: [{ $ref: '#/definitions/playlistResponse' }],
            createdAt: '2021-09-01T00:00:00.000Z',
            updatedAt: '2021-09-01T00:00:00.000Z',
        },

        playlistCreate: {
            $title: 'Playlist Title',
            $userId: 1,
            $imageId: 1,
        },

        playlistRequest: {
            id: 1,
            title: 'Playlist Title',

            image: { $ref: '#/definitions/imageResponse' },
            imageId: 1,
            userId: 1,

            createdAt: '2021-09-01T00:00:00.000Z',
            updatedAt: '2021-09-01T00:00:00.000Z',
        },

        playlistRequestFull: {
            id: 1,
            title: 'Playlist Title',

            image: { $ref: '#/definitions/imageResponse' },
            imageId: 1,
            user: { $ref: '#/definitions/userResponse' },
            userId: 1,
            tracks: [{ $ref: '#/definitions/trackResponse' }],

            createdAt: '2021-09-01T00:00:00.000Z',
            updatedAt: '2021-09-01T00:00:00.000Z',
        },

        loginRequest: {
            type: 'object',
            properties: {
                email: {
                    type: 'string',
                    example: 'user@example.com',
                },
                password: {
                    type: 'string',
                    example: 'password123',
                },
            },
            required: ['email', 'password'],
        },

        loginResponse: {
            type: 'object',
            properties: {
                token: {
                    type: 'string',
                    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                },
                user: {
                    $ref: '#/definitions/userResponse',
                },
            },
        },

        getBuisnessData: {
            type: 'object',
            properties: {
                Streams: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            date: { type: 'string' },
                            count: { type: 'number' },
                        },
                    },
                },
                ActiveUsers: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            date: { type: 'string' },
                            count: { type: 'number' },
                        },
                    },
                },
            },
        },
        getAveragePerformanceByEndpoint: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    endpoint: { type: 'string' },
                    _avg: {
                        type: 'object',
                        properties: {
                            duration: { type: 'number' },
                            responseTime: { type: 'number' },
                            heapUsed: { type: 'number' },
                            heapTotal: { type: 'number' },
                            rss: { type: 'number' },
                            cpu: { type: 'number' },
                            bandwidth: { type: 'number' },
                        },
                    },
                    _count: {
                        type: 'object',
                        properties: {
                            endpoint: { type: 'number' },
                        },
                    },
                },
            },
        },
        getSystemPerformance: {
            type: 'array',
            items: {
                type: 'array',
                properties: {
                    type: 'object',
                    properties: {
                        id: { type: 'number' },
                        method: { type: 'string' },
                        url: { type: 'string' },
                        endpoint: { type: 'string' },
                        status: { type: 'number' },
                        duration: { type: 'number' },
                        responseTime: { type: 'number' },
                        statusCodeDistribution: { type: 'string' },
                        heapUsed: { type: 'number' },
                        heapTotal: { type: 'number' },
                        rss: { type: 'number' },
                        cpu: { type: 'number' },
                        bandwidth: { type: 'number' },
                        createdAt: { type: 'string' },
                        updatedAt: { type: 'string' },
                    },
                },
            },
        },
        jamSessionCreate: {
            $name: 'Session Name',
        },

        jamSessionResponse: {
            id: 1,
            name: 'Session Name',
            hostId: 1,
            currentTrackId: 1,
            host: { $ref: '#/definitions/userResponse' },
            currentTrack: { $ref: '#/definitions/trackRequest' },
            participants: [
                {
                    userId: 1,
                    sessionId: 1,
                    user: { $ref: '#/definitions/userResponse' },
                },
            ],
            createdAt: '2021-09-01T00:00:00.000Z',
            updatedAt: '2021-09-01T00:00:00.000Z',
        },

        jamSessionUpdate: {
            $trackId: 1,
        },

        jamSessionParticipant: {
            userId: 1,
            sessionId: 1,
            user: { $ref: '#/definitions/userResponse' },
            session: { $ref: '#/definitions/jamSessionResponse' },
        },
    },
    security: [
        {
            bearerAuth: [],
        },
    ],
};

const outputFile = './docs/swagger.json';
const routes = [
    './routes/index.ts',
    './routes/auth.route.ts',
    './routes/upload.route.ts',
];

generateSwagger(outputFile, routes, doc);
