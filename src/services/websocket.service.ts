import { WebSocket, Server } from 'ws';
import { WebSocketMessage } from '../types/interfaces/websocket.interface';

export default class WebSocketService {
    private wss: Server;
    private clients: Map<number, WebSocket[]>;

    constructor(server: any) {
        this.wss = new Server({ server });
        this.clients = new Map();
        this.initialize();
    }

    public broadcastToSession(
        sessionId: number,
        message: WebSocketMessage,
    ): void {
        const sessionClients = this.clients.get(sessionId);
        if (!sessionClients) return;

        const messageWithTimestamp = {
            ...message,
            timestamp: Date.now(),
        };

        sessionClients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(messageWithTimestamp));
            }
        });
    }

    public notifySessionUpdate(
        sessionId: number,
        message: WebSocketMessage,
    ): void {
        this.broadcastToSession(sessionId, message);
    }

    public notifyTrackChange(
        sessionId: number,
        message: WebSocketMessage,
    ): void {
        this.broadcastToSession(sessionId, message);
    }

    public handleTrackPositionUpdate(
        sessionId: number,
        message: WebSocketMessage,
    ): void {
        this.broadcastToSession(sessionId, message);
    }

    public handleTrackPlayPause(
        sessionId: number,
        message: WebSocketMessage,
    ): void {
        this.broadcastToSession(sessionId, message);
    }

    private initialize(): void {
        this.wss.on('connection', (ws: WebSocket) => {
            ws.on('message', (message: string) =>
                this.handleMessage(ws, message),
            );
            ws.on('close', () => this.handleClose(ws));
        });
    }

    private handleMessage(ws: WebSocket, message: string): void {
        try {
            const data = JSON.parse(message);
            if (data.sessionId) {
                if (!this.clients.has(data.sessionId)) {
                    this.clients.set(data.sessionId, []);
                }
                this.clients.get(data.sessionId)?.push(ws);
            }
        } catch (error) {
            console.error('WebSocket message handling error:', error);
        }
    }

    private handleClose(ws: WebSocket): void {
        this.clients.forEach((clients, sessionId) => {
            const index = clients.indexOf(ws);
            if (index !== -1) {
                clients.splice(index, 1);
                if (clients.length === 0) {
                    this.clients.delete(sessionId);
                }
            }
        });
    }
}
