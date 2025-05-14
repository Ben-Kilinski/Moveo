import { fetchChordsAndLyricsFromTab4U } from './src/utils/fetchTab4U';

async function test() {
  const { lyrics, chords } = await fetchChordsAndLyricsFromTab4U("מישהו", "עידן רייכל");

  console.log("🎼 LETRA:");
  console.log(lyrics || "Nada encontrado");

  console.log("\n🎸 CIFRA:");
  console.log(chords || "Nada encontrado");
}

test();
