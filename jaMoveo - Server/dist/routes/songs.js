"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const index_1 = require("../index");
const node_fetch_1 = __importDefault(require("node-fetch"));
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// POST /api/songs/current
router.post('/current', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const song = req.body;
    if (!song || !song.trackId) {
        return res.status(400).json({ message: 'Invalid song data' });
    }
    const lyrics = yield fetchLyrics(song.artistName, song.trackName);
    const saved = yield prisma.song.create({
        data: {
            trackId: song.trackId,
            trackName: song.trackName,
            artistName: song.artistName,
            artworkUrl100: song.artworkUrl100,
            previewUrl: song.previewUrl,
            lyrics,
            chords: null, // será preenchido depois pelo admin
        },
    });
    console.log("🎤 Buscando letra de:", song.artistName, "-", song.trackName);
    console.log("🎤 LETRA:", lyrics);
    const full = yield prisma.song.findUnique({ where: { id: saved.id } });
    (0, index_1.broadcastSong)(full);
    console.log('🎵 Saved and broadcasted:', saved.trackName);
    return res.status(200).json({ message: 'Song selected' });
}));
// GET /api/songs/current
router.get('/current', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const last = yield prisma.song.findFirst({
        orderBy: { timestamp: 'desc' },
    });
    if (!last)
        return res.status(404).json({ message: 'No song selected' });
    return res.json(last);
}));
// GET /api/songs/history
router.get('/history', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const songs = yield prisma.song.findMany({
        orderBy: { timestamp: 'desc' },
    });
    res.json(songs);
}));
// DELETE /api/songs/history
router.delete('/history', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.song.deleteMany();
    res.status(200).json({ message: 'History cleared' });
}));
// Busca letra na API Lyrics.ovh
function fetchLyrics(artist, title) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield (0, node_fetch_1.default)(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`);
            const data = yield res.json();
            return data.lyrics || null;
        }
        catch (err) {
            console.error('Lyrics fetch error:', err);
            return null;
        }
    });
}
// PATCH /api/songs/:id/chords
router.patch('/:id/chords', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { chords } = req.body;
    if (!chords) {
        return res.status(400).json({ message: 'Missing chords in request body' });
    }
    try {
        const updated = yield prisma.song.update({
            where: { id: Number(id) },
            data: { chords: JSON.stringify(chords) },
        });
        // ✅ Dispara o broadcast com a nova versão da música
        (0, index_1.broadcastSong)(updated);
        return res.status(200).json({ message: 'Chords updated', song: updated });
    }
    catch (err) {
        console.error('Error updating chords:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}));
exports.default = router;
