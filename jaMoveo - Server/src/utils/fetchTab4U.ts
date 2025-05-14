import fetch from 'node-fetch';
import cheerio from 'cheerio';

export async function fetchChordsAndLyricsFromTab4U(
  title: string,
  artist: string
): Promise<{ lyrics: string | null; chords: string | null }> {
  const searchUrl = `https://www.tab4u.com/search.php?keyword=${encodeURIComponent(title)}&x=0&y=0`;

  try {
    const searchRes = await fetch(searchUrl);
    const searchHtml = await searchRes.text();
    const $ = cheerio.load(searchHtml);

    const firstLink = $('table a')
      .map((_, el) => $(el).attr('href'))
      .get()
      .find((href) => href?.includes('tabs'));

    if (!firstLink) {
      return { lyrics: null, chords: null };
    }

    const songUrl = `https://www.tab4u.com${firstLink}`;
    const songRes = await fetch(songUrl);
    const songHtml = await songRes.text();
    const $songPage = cheerio.load(songHtml);

    const chords = $songPage('.songtextpre').first().text().trim();

    return {
      lyrics: chords,
      chords,
    };
  } catch (err) {
    console.error('Erro ao buscar do Tab4U:', err);
    return { lyrics: null, chords: null };
  }
}
