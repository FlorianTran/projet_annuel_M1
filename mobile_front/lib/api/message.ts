import axios from 'axios';
import { Message } from '../models/message';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
});

export const getMessagesByRoom = async (roomId: string): Promise<Message[]> => {
  const res = await api.get<Message[]>('/message');
  return res.data.filter((m) => m.chatroomId === roomId);
};

export const sendMessage = async (
  content: string,
  chatroomId: string,
  userId: string
): Promise<void> => {
  await api.post('/message', { content, chatroomId, userId });
};