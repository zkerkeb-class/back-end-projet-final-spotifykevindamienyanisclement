import { IArtist } from './artist.interface';
import { IAlbum } from './album.interface';
import { IImage } from './image.interface';

export interface IGroupFull {
    id: number;
    name: string;

    image: IImage | null;
    imageId: number | null;

    albums: IAlbum[];
    artists: IArtist[];

    createdAt: Date;
    updatedAt: Date;
}

export interface IGroup {
    id: number;
    name: string;

    imageId: number | null;
    image: IImage | null;

    createdAt: Date;
    updatedAt: Date;
}

export interface IGroupCreate {
    name: string;
    imageId: number;
}
