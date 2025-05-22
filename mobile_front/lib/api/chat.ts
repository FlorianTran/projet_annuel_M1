import axios from 'axios';
import { Chatroom } from '../models/chatroom';
import { Message } from '../models/message';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
});

export const getAllChatrooms = async (): Promise<Chatroom[]> => {
  const res = await api.get('/chatroom');
  return res.data as Chatroom[];
};

export const getChatroomById = async (id: string): Promise<Chatroom> => {
  const res = await api.get(`/chatroom/${id}`);
  return res.data as Chatroom;
};

export const getMessagesByRoom = async (roomId: string): Promise<Message[]> => {
  const res = await api.get<Message[]>('/message');
  console.log('roomId attendu :', roomId);
  console.log('Tous messages :', res.data);

  const m = res.data.filter((m: any) => {
    const currentRoomId = m.chatroomId || m.chatRoomId || m.chatRoom?.id;
    return currentRoomId === roomId || currentRoomId?.toLowerCase() === roomId.toLowerCase();
  });

  console.log('Messages filtrés pour roomId :', m);
  return m;
};


export const sendMessage = async (
  content: string,
  chatroomId: string,
  userId: string
): Promise<Message> => {
  const res = await api.post('/message', { content, chatroomId, userId });
  console.log('Message sent:', res.data);
  return res.data as Message;
};
