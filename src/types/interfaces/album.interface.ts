import { IArtist } from './artist.interface';
import { ITrack } from './track.interface';

export interface IAlbum {
    id: string;
    title: string;

    image: string;

    artist: IArtist;
    artistId: string;
    tracks: ITrack[];

    createdAt: Date;
    updatedAt: Date;
}
