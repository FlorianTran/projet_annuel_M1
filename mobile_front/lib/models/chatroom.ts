import { User } from './user';
import { Message } from './message';

export interface Chatroom {
  id: string;
  nom: string;
  estPrivee?: boolean;
  createdAt: string;
  utilisateurs: User[];
  messages?: Message[];
}
