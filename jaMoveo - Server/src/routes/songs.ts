import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { broadcastSong } from '../index'; // ajuste o caminho se necessário


const router = express.Router();
const prisma = new PrismaClient();

let currentSong: any = null; // memória simples (pode ser substituído depois por banco ou cache)
let history: any[] = [];     // histórico em memória

// POST /api/songs/current
router.post('/current', async (req: Request, res: Response): Promise<any> => {
  const song = req.body;

  if (!song || !song.trackId) {
    return res.status(400).json({ message: 'Invalid song data' });
  }

  currentSong = song;
  history.unshift({ ...song, timestamp: Date.now() }); // adiciona no início do array
  broadcastSong(currentSong); //notifica live page
  console.log('🎵 Current song set:', song.trackName);
  return res.status(200).json({ message: 'Song selected' });
});

// GET /api/songs/current
router.get('/current', async (_req: Request, res: Response): Promise<any> => {
  if (!currentSong) {
    return res.status(404).json({ message: 'No song selected' });
  }

  return res.json(currentSong);
});

// GET /api/songs/history
router.get('/history', async (_req: Request, res: Response): Promise<any> => {
  return res.json(history);
});

// DELETE /api/songs/history
router.delete('/history', (_req, res) => {
  history = [];
  res.status(200).json({ message: 'History cleared' });
});

export default router;
