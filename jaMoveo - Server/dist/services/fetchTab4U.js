"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const node_fetch_1 = __importDefault(require("node-fetch"));
const cheerio = __importStar(require("cheerio"));
function fetchChordsAndLyricsFromTab4U(title, artist) {
    return __awaiter(this, void 0, void 0, function* () {
        const searchUrl = `https://www.tab4u.com/search.php?keyword=${encodeURIComponent(title)}&x=0&y=0`;
        console.log('🔗 URL de busca:', searchUrl);
        try {
            const searchRes = yield (0, node_fetch_1.default)(searchUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                    'Accept': 'text/html',
                }
            });
            const searchHtml = yield searchRes.text();
            console.log('🔎 HTML da busca Tab4U:');
            console.log(searchHtml.slice(0, 1000)); // mostra um pedaço do HTML da busca
            const $ = cheerio.load(searchHtml);
            const firstLink = $('table a')
                .map((_, el) => $(el).attr('href'))
                .get()
                .find((href) => href === null || href === void 0 ? void 0 : href.includes('tabs'));
            if (!firstLink) {
                return { lyrics: null, chords: null };
            }
            const songUrl = `https://www.tab4u.com${firstLink}`;
            const songRes = yield (0, node_fetch_1.default)(songUrl);
            const songHtml = yield songRes.text();
            const $songPage = cheerio.load(songHtml);
            const chords = $songPage('.songtextpre').first().text().trim();
            return {
                lyrics: chords,
                chords,
            };
        }
        catch (err) {
            console.error('Erro ao buscar do Tab4U:', err);
            return { lyrics: null, chords: null };
        }
    });
}
