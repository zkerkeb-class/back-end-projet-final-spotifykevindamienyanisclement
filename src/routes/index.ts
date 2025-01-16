import express from 'express';
import authRoute from './auth.route';
import artistRoute from './artist.route';
import albumRoute from './album.route';
import playlistMusicRoute from './playlist.route';
import artistGroupRoute from './artistGroup.route';
import uploadRoute from './upload.route';

const router = express.Router();

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
 *       - PlaylistMusic
 *     summary: Get playlist music resource
 *     responses:
 *       200:
 *         description: Playlist music resource
 */
router.use('/playlist', playlistMusicRoute);

/**
 * @swagger
 * /artist-groups:
 *   get:
 *     tags:
 *       - ArtistGroups
 *     summary: Get artist groups resource
 *     responses:
 *       200:
 *         description: Artist groups resource
 */
router.use('/group', artistGroupRoute);

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

export default router;
