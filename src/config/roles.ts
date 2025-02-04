export const Roles = {
    ADMIN: 'ADMIN',
    USER: 'USER',
    ANONYMOUS: 'ANONYMOUS',
};

export const Permissions = {
    CREATE_USER: 'create_user',
    READ_USER: 'read_user',
    UPDATE_USER: 'update_user',
    DELETE_USER: 'delete_user',

    CREATE_ALBUM: 'create_album',
    READ_ALBUM: 'read_album',
    UPDATE_ALBUM: 'update_album',
    DELETE_ALBUM: 'delete_album',

    CREATE_ARTIST: 'create_artist',
    READ_ARTIST: 'read_artist',
    UPDATE_ARTIST: 'update_artist',
    DELETE_ARTIST: 'delete_artist',

    CREATE_GROUP: 'create_group',
    READ_GROUP: 'read_group',
    UPDATE_GROUP: 'update_group',
    DELETE_GROUP: 'delete_group',

    CREATE_PLAYLIST: 'create_playlist',
    READ_PLAYLIST: 'read_playlist',
    UPDATE_PLAYLIST: 'update_playlist',
    DELETE_PLAYLIST: 'delete_playlist',

    CREATE_TRACK: 'create_track',
    READ_TRACK: 'read_track',
    UPDATE_TRACK: 'update_track',
    DELETE_TRACK: 'delete_track',

    UPLOAD_FILE: 'upload_file',

    READ_SOUND: 'read_sound',
};

export const RolePermissions = {
    [Roles.ADMIN]: [
        Permissions.CREATE_USER,
        Permissions.READ_USER,
        Permissions.UPDATE_USER,
        Permissions.DELETE_USER,

        Permissions.CREATE_ALBUM,
        Permissions.READ_ALBUM,
        Permissions.UPDATE_ALBUM,
        Permissions.DELETE_ALBUM,

        Permissions.CREATE_ARTIST,
        Permissions.READ_ARTIST,
        Permissions.UPDATE_ARTIST,
        Permissions.DELETE_ARTIST,

        Permissions.CREATE_GROUP,
        Permissions.READ_GROUP,
        Permissions.UPDATE_GROUP,
        Permissions.DELETE_GROUP,

        Permissions.CREATE_TRACK,
        Permissions.READ_TRACK,
        Permissions.UPDATE_TRACK,
        Permissions.DELETE_TRACK,

        Permissions.UPLOAD_FILE,
    ],
    [Roles.ANONYMOUS]: [
        Permissions.READ_USER,

        Permissions.READ_ALBUM,

        Permissions.READ_ARTIST,

        Permissions.READ_GROUP,

        Permissions.CREATE_PLAYLIST,
        Permissions.READ_PLAYLIST,
        Permissions.UPDATE_PLAYLIST,
        Permissions.DELETE_PLAYLIST,

        Permissions.READ_TRACK,

        Permissions.UPLOAD_FILE,
    ],
    [Roles.USER]: [Permissions.READ_SOUND],
};
