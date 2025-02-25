import type WebSocketService from '../../services/websocket.service';

declare global {
    var wsService: WebSocketService;
    namespace NodeJS {
        interface Global {
            wsService: WebSocketService;
        }
    }
}

export {};

export type WebSocketMessageType =
    | 'SESSION_CREATED'
    | 'SESSION_CLOSED'
    | 'PARTICIPANT_JOIN'
    | 'PARTICIPANT_LEAVE'
    | 'TRACK_CHANGE'
    | 'TRACK_POSITION'
    | 'TRACK_PLAY_STATE';

export interface WebSocketMessage {
    type: WebSocketMessageType;
    sessionId: number;
    data: {
        position?: number;
        isPlaying?: boolean;
        trackId?: number;
        track?: any;
        userId?: number;
        participant?: any;
        sessionId?: number;
    };
}

export interface TrackChangeData {
    trackId: number;
    title: string;
    sound: {
        url: string;
    };
}

export interface ParticipantData {
    userId: number;
    username: string;
}
