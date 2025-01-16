import { IArtist } from './artist.interface';
import { IAlbum } from './album.interface';

export interface ITrack {
    id: string;
    title: string;
    url: string;

    image: string;

    artist: IArtist;
    album: IAlbum;

    createdAt: Date;
    updatedAt: Date;
}
