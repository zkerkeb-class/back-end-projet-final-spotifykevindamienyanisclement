import { IPlaylist } from './playlist.interface';

export interface IUserFull {
    id: number;
    name: string | null;
    email: string;
    playlists: IPlaylist[];
    createdAt: Date;
    updatedAt: Date;
}

export interface IUser {
    id: number;
    name: string | null;
    email: string;

    createdAt: Date;
    updatedAt: Date;
}
export interface IUserCreate {
    name: string;
    email: string;
    password: string;
}

export interface IUserUpdate {
    name: string;
    email: string;
}
