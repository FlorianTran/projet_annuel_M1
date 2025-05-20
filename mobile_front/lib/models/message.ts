import { User } from './user';

export interface Message {
  id: string;
  content: string;
  userId: string;
  chatroomId: string;
  createdAt: string;
  user?: User;
}
