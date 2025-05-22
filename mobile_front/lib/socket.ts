import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

class SocketService {
  private socket: Socket | null = null;

  connect(): Socket {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],
      });

      this.socket.on('connect', () => {
        console.log('🟢 Socket connecté:', this.socket?.id);
      });

      this.socket.on('disconnect', () => {
        console.log('🔴 Socket déconnecté');
      });
    }

    return this.socket;
  }

  getSocket(): Socket {
    if (!this.socket) {
      throw new Error("Socket non connecté. Appelle d'abord connect().");
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
