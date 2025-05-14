import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import songRoutes from './routes/songs';
import { WebSocketServer } from 'ws';


dotenv.config();

const app = express();
const wss = new WebSocketServer({ port: 3002 }); // ou anexar ao servidor http

app.use(cors());
app.use(express.json());

app.use('/api/songs', songRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (_: Request, res: Response) => {
  res.send('Server is running 🚀');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server is listening on http://localhost:${PORT}`);
});

export function broadcastSong(song: Record<string, any>) {
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify({ type: 'update', song }));
    }
  });
}
