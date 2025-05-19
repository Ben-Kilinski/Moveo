<<<<<<< HEAD
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001', {
  transports: ['websocket'], // forçar websocket localmente
=======
// src/socket.ts
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL || '', {
  transports: ['polling'], // <-- ESSENCIAL para funcionar no Render
>>>>>>> b6d012b2bb892e73be803181dbae202f0d357d57
  withCredentials: true,
});

export default socket;
