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
exports.fetchChordsAndLyricsFromTab4U = fetchChordsAndLyricsFromTab4U;
const puppeteer_1 = __importDefault(require("puppeteer"));
function fetchChordsAndLyricsFromTab4U(title, artist) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = encodeURIComponent(title);
        const searchUrl = `https://www.tab4u.com/search.php?keyword=${query}`;
        const browser = yield puppeteer_1.default.launch({ headless: true });
        ; // 'new' para evitar warning
        const page = yield browser.newPage();
        try {
            yield page.goto(searchUrl, { waitUntil: 'networkidle2' });
            // Clicar no primeiro link da tabela de resultados
            const songLink = yield page.evaluate(() => {
                const link = document.querySelector('table a[href*="tabs"]');
                return (link === null || link === void 0 ? void 0 : link.getAttribute('href')) || null;
            });
            if (!songLink) {
                yield browser.close();
                return { lyrics: null, chords: null };
            }
            const songUrl = `https://www.tab4u.com${songLink}`;
            yield page.goto(songUrl, { waitUntil: 'networkidle2' });
            const chords = yield page.evaluate(() => {
                var _a;
                const el = document.querySelector('.songtextpre');
                return ((_a = el === null || el === void 0 ? void 0 : el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || null;
            });
            yield browser.close();
            return {
                lyrics: chords, // Tab4U embute letra + cifra no mesmo bloco
                chords,
            };
        }
        catch (err) {
            console.error('Erro no Puppeteer:', err);
            yield browser.close();
            return { lyrics: null, chords: null };
        }
    });
}
// Teste direto (só roda se esse arquivo for executado diretamente)
if (require.main === module) {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield fetchChordsAndLyricsFromTab4U("מישהו", "עידן רייכל");
        console.log("🎼 LETRA:\n", result.lyrics || 'Nada');
        console.log("🎸 CIFRA:\n", result.chords || 'Nada');
    }))();
}
