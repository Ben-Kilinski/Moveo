import { useEffect, useState } from 'react';

interface Song {
  trackId: number;
  trackName: string;
  artistName: string;
  artworkUrl100: string;
  previewUrl: string;
  timestamp: number;
}

export default function ResultsPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/songs/history');
        const data = await res.json();
        setSongs(data);
      } catch (err) {
        console.error(err);
        setSongs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) return <div className="p-4">Loading history...</div>;
  if (!songs.length) return <div className="p-4 text-gray-600">No songs selected yet.</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Selection History</h1>
      <ul className="space-y-4">
        {songs.map((song) => (
          <li key={song.trackId} className="flex items-center gap-4 border-b pb-4">
            <img src={song.artworkUrl100} alt={song.trackName} className="w-16 h-16 rounded" />
            <div className="flex-1">
              <h2 className="text-lg font-semibold">{song.trackName}</h2>
              <p className="text-sm text-gray-600">{song.artistName}</p>
              <p className="text-xs text-gray-400">
                {new Date(song.timestamp).toLocaleString()}
              </p>
            </div>
            {song.previewUrl && (
              <audio controls className="w-32">
                <source src={song.previewUrl} type="audio/mpeg" />
              </audio>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
