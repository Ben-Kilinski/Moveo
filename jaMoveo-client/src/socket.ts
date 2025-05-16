// src/socket.ts
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL ?? 'http://localhost:3001', {
  transports: ['polling'], // <-- ESSENCIAL para funcionar no Render
  withCredentials: true,
});

export default socket;
