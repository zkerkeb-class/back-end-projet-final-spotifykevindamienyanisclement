export interface ISound {
    id: number;
    duration: number;

    originalSoundName: string;
    originalSoundURL: string;
    wavSoundName: string;
    wavSoundURL: string;
    m4aSoundName: string;
    m4aSoundURL: string;

    createdAt: Date;
    updatedAt: Date;
}

export interface ISoundCreate {
    duration: number;

    originalSoundName: string;
    originalSoundURL: string;
    wavSoundName: string;
    wavSoundURL: string;
    m4aSoundName: string;
    m4aSoundURL: string;
}
