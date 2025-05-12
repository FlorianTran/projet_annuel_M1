import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  
  @WebSocketGateway(3030, {
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:8081'],
      credentials: true,
    },
  })
  export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    handleConnection(client: Socket) {
      console.log(`🟢 Client connecté : ${client.id}`);
    }
  
    handleDisconnect(client: Socket) {
      console.log(`🔴 Client déconnecté : ${client.id}`);
    }
  
    @SubscribeMessage('ping')
    handlePing(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
      console.log('📩 Ping reçu :', data);
      client.emit('pong', 'pong');
    }
  
    @SubscribeMessage('message')
    handleMessage(@MessageBody() msg: any, @ConnectedSocket() client: Socket) {
      console.log('📨 Message reçu :', msg);
      client.broadcast.emit('message', msg);
    }
  }
  