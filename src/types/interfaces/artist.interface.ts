import { IAlbum } from './album.interface';
import { ITrack } from './track.interface';

export interface IArtist {
    id: string;
    name: string;

    image: string;

    albums: IAlbum[];
    tracks: ITrack[];

    createdAt: Date;
    updatedAt: Date;
}
