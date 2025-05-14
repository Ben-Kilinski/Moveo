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

  const clearHistory = async () => {
    const confirm = window.confirm('Are you sure you want to clear the history?');
    if (!confirm) return;
    await fetch('http://localhost:3001/api/songs/history', { method: 'DELETE' });
    setSongs([]);
  };

  const exportCSV = () => {
    const headers = ['Track Name', 'Artist', 'Date'];
    const rows = songs.map(song => [
      song.trackName,
      song.artistName,
      new Date(song.timestamp).toLocaleString()
    ]);
    const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'song-history.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Selection History</h1>
        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Export CSV
          </button>
          <button
            onClick={clearHistory}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Clear History
          </button>
        </div>
      </div>
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


