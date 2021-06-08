import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    handleTest(data: string): void;
    handleLogin(data: {
        id: number;
        channels: number[];
    }, socket: Socket): void;
    afterInit(server: Server): any;
    handleConnection(socket: Socket): void;
    handleDisconnect(socket: Socket): void;
}
