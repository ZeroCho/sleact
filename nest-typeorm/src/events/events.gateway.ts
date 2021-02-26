import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: /\/ws-.+/ })
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private onlineMap = {};

  @SubscribeMessage('test')
  handleTest(@MessageBody() data: string) {
    console.log('test', data);
  }

  @SubscribeMessage('login')
  handleLogin(
    @MessageBody() data: { id: number; channels: number[] },
    @ConnectedSocket() socket: Socket,
  ) {
    const newNamespace = socket.nsp;
    console.log('login', newNamespace);
    this.onlineMap[socket.nsp.name][socket.id] = data.id;
    newNamespace.emit(
      'onlineList',
      Object.values(this.onlineMap[socket.nsp.name]),
    );
    data.channels.forEach((channel) => {
      socket.join(`${socket.nsp.name}-${channel}`);
    });
  }

  afterInit(server: Server): any {
    console.log('init');
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    console.log('connected', socket.nsp.name);
    if (!this.onlineMap[socket.nsp.name]) {
      this.onlineMap[socket.nsp.name] = {};
    }
    // broadcast to all clients in the given sub-namespace
    socket.emit('hello', socket.nsp.name);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log('disconnected', socket.nsp.name);
    const newNamespace = socket.nsp;
    delete this.onlineMap[socket.nsp.name][socket.id];
    newNamespace.emit(
      'onlineList',
      Object.values(this.onlineMap[socket.nsp.name]),
    );
  }
}
