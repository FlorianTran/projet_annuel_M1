// src/chat/chat.controller.ts (corrigé avec Swagger)
import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { ChatService } from './chat.service';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('private')
  @ApiOperation({ summary: 'Créer ou retrouver une room privée entre deux utilisateurs' })
  @ApiBody({ schema: {
    type: 'object',
    properties: {
      userAId: { type: 'string', example: 'uuid-1' },
      userBId: { type: 'string', example: 'uuid-2' },
    },
  }})
  createPrivateRoom(@Body() body: { userAId: string; userBId: string }) {
    return this.chatService.findOrCreatePrivateRoom(body.userAId, body.userBId);
  }

  @Post('group')
  @ApiOperation({ summary: 'Créer une salle de groupe avec plusieurs utilisateurs' })
  @ApiBody({ schema: {
    type: 'object',
    properties: {
      nom: { type: 'string', example: 'Groupe de sport' },
      userIds: {
        type: 'array',
        items: { type: 'string' },
        example: ['uuid-1', 'uuid-2'],
      },
    },
  }})
  createGroupRoom(@Body() body: { nom: string; userIds: string[] }) {
    return this.chatService.createGroupRoom(body.nom, body.userIds);
  }

  @Post(':roomId/add-user')
  @ApiOperation({ summary: "Ajouter un utilisateur à une room existante" })
  @ApiParam({ name: 'roomId', type: 'string' })
  @ApiBody({ schema: {
    type: 'object',
    properties: {
      userId: { type: 'string', example: 'uuid-user' },
    },
  }})
  addUser(@Param('roomId') roomId: string, @Body() body: { userId: string }) {
    return this.chatService.addUserToRoom(roomId, body.userId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Récupérer toutes les rooms auxquelles appartient un utilisateur' })
  @ApiParam({ name: 'userId', type: 'string' })
  getUserRooms(@Param('userId') userId: string) {
    return this.chatService.getUserRooms(userId);
  }

  @Get(':roomId/messages')
  @ApiOperation({ summary: 'Récupérer tous les messages d’une room' })
  @ApiParam({ name: 'roomId', type: 'string' })
  getRoomMessages(@Param('roomId') roomId: string) {
    return this.chatService.getRoomMessages(roomId);
  }
}
