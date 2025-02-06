import { IUser } from './user.interface';
import { ITrack } from './track.interface';
import { IImage } from './image.interface';

export interface IPlaylistFull {
    id: number;
    title: string;

    image: IImage | null;
    imageId: number | null;
    user: IUser;
    userId: number;
    tracks: ITrack[];

    createdAt: Date;
    updatedAt: Date;
}

export interface IPlaylist {
    id: number;
    title: string;

    imageId: number | null;
    image: IImage | null;

    userId: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IPlaylistCreate {
    title: string;
    imageId: number;
    userId: number;
}
