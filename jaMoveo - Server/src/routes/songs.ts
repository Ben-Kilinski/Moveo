import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { broadcastSong } from '../index';

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/songs/current
router.post('/current', async (req: Request, res: Response): Promise<any> => {
  const song = req.body;

  if (!song || !song.trackId) {
    return res.status(400).json({ message: 'Invalid song data' });
  }

  const saved = await prisma.song.create({
    data: {
      trackId: song.trackId,
      trackName: song.trackName,
      artistName: song.artistName,
      artworkUrl100: song.artworkUrl100,
      previewUrl: song.previewUrl,
    },
  });

  broadcastSong(saved);
  console.log('🎵 Saved and broadcasted:', saved.trackName);
  return res.status(200).json({ message: 'Song selected' });
});

// GET /api/songs/current
router.get('/current', async (req: Request, res: Response): Promise<any> => {
  const last = await prisma.song.findFirst({
    orderBy: { timestamp: 'desc' },
  });

  if (!last) return res.status(404).json({ message: 'No song selected' });
  return res.json(last);
});

// GET /api/songs/history
router.get('/history', async (_req, res) => {
  const songs = await prisma.song.findMany({
    orderBy: { timestamp: 'desc' },
  });

  res.json(songs);
});

// DELETE /api/songs/history
router.delete('/history', async (_req, res) => {
  await prisma.song.deleteMany();
  res.status(200).json({ message: 'History cleared' });
});

export default router;
