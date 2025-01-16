import { IUser } from './user.interface';
import { ITrack } from './track.interface';

export interface IPlaylist {
    id: string;
    title: string;

    image: string;

    user: IUser;
    userId: string;
    tracks: ITrack[];

    createdAt: Date;
    updatedAt: Date;
}
