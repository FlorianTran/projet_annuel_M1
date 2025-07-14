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
import { Injectable } from '@nestjs/common';

@WebSocketGateway(3030, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:8081'],
    credentials: true,
  },
})
@Injectable()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messageService: MessageService) {}

  handleConnection(client: Socket) {
    console.log(`🟢 Client connecté : ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`🔴 Client déconnecté : ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() data: { chatroomId: string }, @ConnectedSocket() client: Socket) {
    client.join(data.chatroomId);
    console.log(`👥 ${client.id} a rejoint la salle ${data.chatroomId}`);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(@MessageBody() data: { chatroomId: string }, @ConnectedSocket() client: Socket) {
    client.leave(data.chatroomId);
    console.log(`🚪 ${client.id} a quitté la salle ${data.chatroomId}`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() payload: CreateMessageDto,
    @ConnectedSocket() client: Socket
  ) {
    try {
      const saved = await this.messageService.create(payload);
      this.server.to(payload.chatroomId).emit('newMessage', saved);
      console.log('💬 Message enregistré et émis :', saved);
    } catch (err) {
      console.error('❌ Erreur lors de l’envoi du message :', err.message);
      client.emit('error', { error: err.message });
    }
  }
}
