import { IArtist } from './artist.interface';
import { ITrack } from './track.interface';
import { IImage } from './image.interface';
import { IGroup } from './group.interface';
import { ITrackCreate } from './track.interface';

export interface IAlbumFull {
    id: number;
    title: string;

    image: IImage | null;
    imageId: number | null;

    artist: IArtist | null;
    artistId: number | null;

    group: IGroup | null;
    groupId: number | null;

    tracks: ITrack[];

    createdAt: Date;
    updatedAt: Date;
}

export interface IAlbum {
    id: number;
    title: string;

    imageId: number | null;
    image: IImage | null;

    artistId: number | null;
    groupId: number | null;

    createdAt: Date;
    updatedAt: Date;
}

export interface IAlbumCreate {
    title: string;

    imageId: number;
    artistId: number;
    groupId: number;

    tracks: ITrackCreate[];
}

export interface IAlbumUpdate {
    title: string;

    imageId: number;
    artistId: number;
    groupId: number;
}
