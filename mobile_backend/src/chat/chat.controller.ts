import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // Créer ou récupérer une room privée entre 2 utilisateurs
  @Post('room/private')
  async createPrivateRoom(@Body() body: { userAId: string; userBId: string }) {
    return this.chatService.findOrCreatePrivateRoom(body.userAId, body.userBId);
  }

  @Post('room/group')
  async createGroupRoom(@Body() body: { nom: string; userIds: string[] }) {
    return this.chatService.createGroupRoom(body.nom, body.userIds);
  }

  // Ajouter un utilisateur à une room existante
  @Post('room/:roomId/users')
  async addUserToRoom(@Param('roomId') roomId: string, @Body() body: { userId: string }) {
    return this.chatService.addUserToRoom(roomId, body.userId);
  }

  // Récupérer les rooms d'un utilisateur (privées et publiques)
  @Get('rooms/:userId')
  async getUserRooms(@Param('userId') userId: string) {
    return this.chatService.getUserRooms(userId);
  }

  //  Récupérer les messages d'une room
  @Get('messages/:roomId')
  async getMessages(@Param('roomId') roomId: string) {
    return this.chatService.getRoomMessages(roomId);
  }
}
