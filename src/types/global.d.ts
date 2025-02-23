import type WebSocketService from '../services/websocket.service';

declare global {
    var wsService: WebSocketService;
    namespace NodeJS {
        interface Global {
            wsService: WebSocketService;
        }
    }
}
