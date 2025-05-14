import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

let currentSong: any = null; // memória simples (pode ser substituído depois por banco ou cache)

router.post('/current', async (req: Request, res: Response): Promise<any> => {

  const song = req.body;

  if (!song || !song.trackId) {
    return res.status(400).json({ message: 'Invalid song data' });
  }

  currentSong = song;
  console.log('🎵 Current song set:', song.trackName);
  return res.status(200).json({ message: 'Song selected' });
});

router.get('/current', async (req: Request, res: Response): Promise<any> => {
  if (!currentSong) {
    return res.status(404).json({ message: 'No song selected' });
  }

  return res.json(currentSong);
});

export default router;
