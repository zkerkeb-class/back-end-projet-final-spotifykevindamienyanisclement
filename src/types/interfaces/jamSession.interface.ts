import { IUser } from './user.interface';
import { ITrack } from './track.interface';
import { ISound } from './sound.interface';

export interface IJamSessionFull {
    id: number;
    name: string;
    hostId: number;
    currentTrackId: number | null;
    isActive: boolean;

    host: IUser;
    currentTrack:
        | (ITrack & {
              sound: {
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
              } | null;
          })
        | null;
    participants: {
        id: number;
        userId: number;
        sessionId: number;
        joinedAt: Date;
        user: IUser;
        session: IJamSession;
    }[];

    createdAt: Date;
    updatedAt: Date;
}

export interface IJamSession {
    id: number;
    name: string;
    hostId: number;
    currentTrackId: number | null;
    isActive: boolean;

    createdAt: Date;
    updatedAt: Date;
}

export interface IJamSessionCreate {
    name: string;
    hostId: number;
}

export interface IJamParticipant {
    id: number;
    userId: number;
    sessionId: number;
    joinedAt: Date;

    user: IUser;
    session: IJamSession;
}

export interface IJamParticipantCreate {
    userId: number;
    sessionId: number;
}
