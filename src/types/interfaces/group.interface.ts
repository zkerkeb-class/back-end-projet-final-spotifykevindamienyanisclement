import { IArtist } from './artist.interface';
import { ITrack } from './track.interface';
import { IAlbum } from './album.interface';

export interface IGroup {
    id: string;
    name: string;

    image: string;

    artists: IArtist[];
    tracks: ITrack[];
    albums: IAlbum[];

    createdAt: Date;
    updatedAt: Date;
}
