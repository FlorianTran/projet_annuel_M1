import axios from 'axios';
import { Chatroom } from '../models/chatroom';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
});

export const getChatroomById = async (id: string): Promise<Chatroom> => {
  const res = await api.get(`/chatroom/${id}`);
  return res.data as Chatroom;
};

export const getAllChatrooms = async (): Promise<Chatroom[]> => {
  const res = await api.get('/chatroom');
  return res.data as Chatroom[];
};