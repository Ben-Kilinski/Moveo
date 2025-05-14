import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const [selectedSongId, setSelectedSongId] = useState<number | null>(null);
  const [currentDbId, setCurrentDbId] = useState<number | null>(null);
  const navigate = useNavigate();
  const [latestSong, setLatestSong] = useState<{ id: number; trackName: string } | null>(null);

  useEffect(() => {
    const fetchCurrent = async () => {
      const res = await fetch('http://localhost:3001/api/songs/current');
      const data = await res.json();
      setLatestSong({ id: data.id, trackName: data.trackName });
    };
    fetchCurrent();
  }, []);


  const searchSongs = async () => {
    setLoading(true);
    const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&limit=6`);
    const data = await res.json();
    setSongs(data.results);
    setLoading(false);
  };

  const handleSelect = async (song: Song) => {
    setSelectedSongId(song.trackId);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3001/api/songs/current', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(song),
      });

      if (!res.ok) {
        const error = await res.json();
        alert('Failed to select song: ' + error.message);
      } else {
        alert('Song selected 🎶');
        // buscar o id real no banco
        const current = await fetch('http://localhost:3001/api/songs/current');
        const data = await current.json();
        setCurrentDbId(data.id);
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Search any song...</h1>
      <div className="flex gap-2 mb-4">
        {latestSong && (
          <div className="mb-4 flex items-center justify-between border p-3 rounded bg-slate-50">
            <p className="text-sm">
              Última música selecionada: <strong>{latestSong.trackName}</strong>
            </p>
            <button
              onClick={() => navigate(`/admin/chords-editor/${latestSong.id}`)}
              className="ml-4 bg-indigo-600 text-white px-4 py-1.5 rounded hover:bg-indigo-700"
            >
              Editar Cifras
            </button>
          </div>
        )}

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
        <button
          onClick={() => navigate('/admin/results')}
          className="bg-gray-700 text-white px-4 py-2 rounded"
        >
          View History
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
            <button
              onClick={() => handleSelect(song)}
              className={`mt-2 px-3 py-1 rounded text-white ${selectedSongId === song.trackId ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700'
                }`}
              disabled={selectedSongId === song.trackId}
            >
              {selectedSongId === song.trackId ? 'Selected' : 'Select'}
            </button>

            {/* Botão para editar cifra */}
            {selectedSongId === song.trackId && currentDbId && (
              <button
                onClick={() => navigate(`/admin/chords-editor/${currentDbId}`)}
                className="mt-2 px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Editar Cifras
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
