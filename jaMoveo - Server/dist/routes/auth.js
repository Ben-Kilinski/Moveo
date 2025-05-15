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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
// POST /signup
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, instrument, role } = req.body;
    const existingUser = yield prisma.user.findUnique({ where: { username } });
    if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    const newUser = yield prisma.user.create({
        data: {
            username,
            password: hashedPassword,
            instrument,
            role,
        },
    });
    return res.status(201).json({
        message: 'User created',
        user: {
            id: newUser.id,
            username: newUser.username,
            role,
        },
    });
}));
// POST /login
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield prisma.user.findUnique({ where: { username } });
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    const valid = yield bcryptjs_1.default.compare(password, user.password);
    if (!valid) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role, instrument: user.instrument }, JWT_SECRET, { expiresIn: '1d' });
    return res.json({
        token,
        user: {
            id: user.id,
            username: user.username,
            role: user.role,
            instrument: user.instrument,
        },
    });
}));
exports.default = router;
