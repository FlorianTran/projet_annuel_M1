import axios from 'axios';
import { User } from '../models/user';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
});

export const getUserById = async (id: string): Promise<User> => {
  const res = await api.get(`/users/${id}`);
  return res.data as User;
};
