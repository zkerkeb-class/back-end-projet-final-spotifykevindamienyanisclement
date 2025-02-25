import express from 'express';
import authRoute from './auth.route';
import artistRoute from './artist.route';
import albumRoute from './album.route';
import playlistRoute from './playlist.route';
import groupRoute from './group.route';
import uploadRoute from './upload.route';
import trackRoute from './track.route';
import metricsRoutes from './metrics.route';
import getAllTracks from './track.route';
import userRoute from './user.route';
import jamSessionRoute from './jamSession.route';

import verifyToken from '../middlewares/verifyToken';

const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * /auth:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Get auth resource
 *     responses:
 *       200:
 *         description: Auth resource
 */
router.use('/auth', authRoute);

// Application du middleware verifyToken pour toutes les routes protégées
router.use(verifyToken);

/**
 * @swagger
 * /artists:
 *   get:
 *     tags:
 *       - Artists
 *     summary: Get artists resource
 *     responses:
 *       200:
 *         description: Artists resource
 */
router.use('/artist', artistRoute);

/**
 * @swagger
 * /album:
 *   get:
 *     tags:
 *       - Album
 *     summary: Get album resource
 *     responses:
 *       200:
 *         description: Album resource
 */
router.use('/album', albumRoute);

/**
 * @swagger
 * /playlist-music:
 *   get:
 *     tags:
 *       - Playlist
 *     summary: Get playlist music resource
 *     responses:
 *       200:
 *         description: Playlist music resource
 */
router.use('/playlist', playlistRoute);

/**
 * @swagger
 * /artist-groups:
 *   get:
 *     tags:
 *       - Groups
 *     summary: Get artist groups resource
 *     responses:
 *       200:
 *         description: Artist groups resource
 */
router.use('/group', groupRoute);

/**
 * @swagger
 * /upload:
 *   get:
 *     tags:
 *       - Upload
 *     summary: Get upload resource
 *     responses:
 *       200:
 *         description: Upload resource
 */
router.use('/upload', uploadRoute);

/**
 * @swagger
 * /album/{albumId}/track:
 *   get:
 *     tags:
 *       - Track
 *     summary: Get tracks resource
 *     responses:
 *       200:
 *         description: Tracks resource
 */
router.use('/album/:albumId/track', trackRoute);

router.use('/metrics', metricsRoutes);
/**
 * @swagger
 * /tracks:
 *   get:
 *     tags:
 *       - Track
 *     summary: Get all tracks
 *     responses:
 *       200:
 *         description: All tracks
 */
router.use('/track', getAllTracks);

/**
 * @swagger
 * /user:
 *   get:
 *     tags:
 *       - User
 *     summary: Get user resource
 *     responses:
 *       200:
 *         description: user resource
 */
router.use('/user', userRoute);

/**
 * @swagger
 * /jam-session:
 *   get:
 *     tags:
 *       - JamSession
 *     summary: Get jam session resource
 *     responses:
 *       200:
 *         description: Jam session resource
 */
router.use('/jam-session', jamSessionRoute);

export default router;
