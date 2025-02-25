import {
    describe,
    expect,
    jest,
    it,
    beforeEach,
    afterEach,
} from '@jest/globals';
import WebSocketService from '../src/services/websocket.service';
import { Server } from 'http';
import { WebSocket } from 'ws';
import { WebSocketMessage } from '../src/types/interfaces/websocket.interface';

jest.mock('ws');

describe('WebSocketService', () => {
    let wsService: WebSocketService;
    let mockServer: Server;

    beforeEach(() => {
        mockServer = new Server();
        wsService = new WebSocketService(mockServer);
        // @ts-ignore - Pour les tests
        wsService.clients = new Map();
        global.wsService = wsService;
        // Mock des méthodes privées pour les tests
        wsService['notifySessionUpdate'] = jest.fn();
        wsService['notifyTrackChange'] = jest.fn();
        wsService['broadcastToSession'] = jest.fn();
    });

    afterEach(() => {
        mockServer.close();
    });

    it('should handle client connection and messages', () => {
        const mockClient = {
            on: jest.fn(),
            send: jest.fn(),
            readyState: WebSocket.OPEN,
        };

        wsService.clients.set(1, [mockClient as any]);
        wsService.notifySessionUpdate(1, { type: 'UPDATE', data: {} });

        expect(mockClient.send).toHaveBeenCalled();
    });

    it('should broadcast to session', () => {
        const sessionId = 1;
        const message = { type: 'TEST', data: {} };
        const mockClient = {
            sessionId: 1,
            readyState: WebSocket.OPEN,
            send: jest.fn(),
        };

        wsService.clients.set(sessionId, [mockClient as any]);
        wsService.broadcastToSession(sessionId, message);

        expect(mockClient.send).toHaveBeenCalledWith(JSON.stringify(message));
    });

    it('should handle session updates', () => {
        const sessionId = 1;
        const updateData = {
            type: 'UPDATE',
            data: { id: 1, name: 'Updated Session' },
        };

        wsService.notifySessionUpdate(sessionId, updateData);

        expect(wsService.broadcastToSession).toHaveBeenCalledWith(
            sessionId,
            updateData,
        );
    });

    it('should notify track changes', () => {
        const sessionId = 1;
        const track = {
            id: 2,
            title: 'Test Track',
            sound: { url: 'test.mp3' },
        };

        wsService.notifyTrackChange(sessionId, track);

        expect(wsService['notifySessionUpdate']).toHaveBeenCalledWith(
            sessionId,
            {
                type: 'TRACK_CHANGE',
                data: track,
            },
        );
    });
});
