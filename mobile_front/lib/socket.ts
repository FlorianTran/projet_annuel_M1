import { io } from 'socket.io-client';

export const socket = io('http://10.188.54.84:3030', {
  transports: ['websocket'],
});
