import { useState } from 'react';

interface Song {
  trackId: number;
  trackName: string;
  artistName: string;
  artworkUrl100: string;
  previewUrl: string;
}

export default function AdminMainPage() {
  const [term, setTerm] = useState('');
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);

  const searchSongs = async () => {
    setLoading(true);
    const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&limit=6`);
    const data = await res.json();
    setSongs(data.results);
    setLoading(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Search any song...</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="border rounded p-2 w-full"
          placeholder="Search"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
        <button onClick={searchSongs} className="bg-blue-600 text-white px-4 py-2 rounded">
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {songs.map((song) => (
          <div
            key={song.trackId}
            className="border rounded p-3 flex flex-col items-center shadow hover:shadow-lg transition"
          >
            <img src={song.artworkUrl100} alt={song.trackName} className="mb-2 rounded" />
            <h3 className="text-md font-semibold text-center">{song.trackName}</h3>
            <p className="text-sm text-gray-600 text-center mb-2">{song.artistName}</p>
            {song.previewUrl && (
              <audio controls className="w-full">
                <source src={song.previewUrl} type="audio/mpeg" />
              </audio>
            )}
            <button className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
              Select
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}