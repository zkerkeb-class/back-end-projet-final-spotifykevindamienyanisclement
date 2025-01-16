import { IPlaylist } from './playlist.interface';

export interface IUser {
    id: string;
    username: string;
    email: string;
    password: string;
    PlaylistMusic: IPlaylist[];

    createdAt: Date;
    updatedAt: Date;
}
