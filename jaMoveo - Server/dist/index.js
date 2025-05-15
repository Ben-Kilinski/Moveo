"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcastSong = broadcastSong;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const songs_1 = __importDefault(require("./routes/songs"));
const ws_1 = require("ws");
const http_1 = __importDefault(require("http"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app); // 🔧 servidor compartilhado
const wss = new ws_1.WebSocketServer({ server }); // ✅ WebSocket na mesma porta
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/songs', songs_1.default);
app.use('/api/auth', auth_1.default);
app.get('/', (_req, res) => {
    res.send('🚀 API online');
});
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`🚀 Server is listening on http://localhost:${PORT}`);
});
// ✅ Exporta função para enviar atualizações
function broadcastSong(song) {
    wss.clients.forEach((client) => {
        if (client.readyState === 1) {
            client.send(JSON.stringify({ type: 'update', song }));
        }
    });
}
