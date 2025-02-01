import { IAlbum } from './album.interface';
import { IGroup } from './group.interface';
import { IImage } from './image.interface';
import { ITrack } from './track.interface';

export interface IArtistFull {
    id: number;
    name: string;

    image: IImage | null;
    imageId: number | null;

    groupId: number | null;
    group: IGroup | null;

    albums: IAlbum[];
    tracks: ITrack[];

    createdAt: Date;
    updatedAt: Date;
}

export interface IArtist {
    id: number;
    name: string;

    imageId: number | null;
    image: IImage | null;

    groupId: number | null;

    createdAt: Date;
    updatedAt: Date;
}

export interface IArtistCreate {
    name: string;
    imageId: number;
}
