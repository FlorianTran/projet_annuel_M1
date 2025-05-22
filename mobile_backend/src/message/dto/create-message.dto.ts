import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({
    example: 'Salut à tous !',
    description: 'Contenu du message',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: '1e7e3c76-5d2b-4f4a-a3e4-abc123456789',
    description: "UUID de l'utilisateur qui envoie le message",
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    example: '2f9f819a-2fc7-4320-bcd7-def987654321',
    description: 'UUID de la salle de chat',
  })
  @IsUUID()
  chatroomId: string;
}
