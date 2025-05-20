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
import { MessageService } from '../message/message.service';
import { CreateMessageDto } from '../message/dto/create-message.dto';
import { Message } from '../message/entities/message.entity';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:8081'],
    credentials: true,
  },
})
export class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messageService: MessageService) {}

  handleConnection(client: Socket) {
    console.log(`🟢 Client connecté : ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`🔴 Client déconnecté : ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() data: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const message: Message = await this.messageService.create(data);

      // Informer les utilisateurs de la room concernée
      this.server.to(data.chatroomId).emit('newMessage', message);
    } catch (error) {
      console.error('Erreur lors de l’envoi du message :', error);
      client.emit('errorMessage', {
        message: 'Erreur lors de l’envoi du message',
        detail: error.message,
      });
    }
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: { chatroomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.chatroomId);
    console.log(`✅ ${client.id} a rejoint la room ${data.chatroomId}`);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @MessageBody() data: { chatroomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(data.chatroomId);
    console.log(`❌ ${client.id} a quitté la room ${data.chatroomId}`);
  }
}
