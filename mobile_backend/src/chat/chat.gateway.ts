import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: true }) // autorise les connexions cross-origin
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log(`Client connecté : ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client déconnecté : ${client.id}`);
  }

  // Rejoindre une room
  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() roomId: string, @ConnectedSocket() client: Socket) {
    client.join(roomId);
    console.log(`Client ${client.id} a rejoint la room ${roomId}`);
  }

  // Un utilisateur envoie un message dans une room (privée ou groupe)
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody()
    payload: { roomId: string; userId: string; message: string },
    @ConnectedSocket() client: Socket
  ) {
    try {
      const saved = await this.chatService.saveMessage(
        payload.roomId, payload.userId, payload.message);
      this.server.to(payload.roomId).emit('newMessage', saved);
    } catch (err) {
      client.emit('errorMessage', err.message);
    }
  }
}
