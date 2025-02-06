export interface IImage {
    id: number;

    formattedImageName: string;
    formattedImageURL: string;
    originalImageName: string;
    originalImageURL: string;
    avifImageName: string;
    avifImageURL: string;
    smallImageName: string;
    smallImageURL: string;
    mediumImageName: string;
    mediumImageURL: string;
    largeImageName: string;
    largeImageURL: string;

    createdAt: Date;
    updatedAt: Date;
}

export interface IImageCreate {
    originalImageName: string;
    originalImageURL: string;
    formattedImageName: string;
    formattedImageURL: string;
    avifImageName: string;
    avifImageURL: string;
    smallImageName: string;
    smallImageURL: string;
    mediumImageName: string;
    mediumImageURL: string;
    largeImageName: string;
    largeImageURL: string;
}
