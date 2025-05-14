import { useEffect, useState } from 'react';

interface Song {
  trackId: number;
  trackName: string;
  artistName: string;
  artworkUrl100: string;
  previewUrl: string;
}

export default function LivePage() {
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/songs/current');
        if (!res.ok) throw new Error('No song selected');
        const data = await res.json();
        setSong(data);
      } catch (err) {
        console.error(err);
        setSong(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSong();
  }, []);

  if (loading) return <div className="p-4">Loading song...</div>;
  if (!song) return <div className="p-4 text-red-600">No song selected</div>;

  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Now Playing</h1>
      <img src={song.artworkUrl100} alt={song.trackName} className="mx-auto rounded mb-4" />
      <h2 className="text-xl font-semibold">{song.trackName}</h2>
      <p className="text-gray-600 mb-4">{song.artistName}</p>
      {song.previewUrl && (
        <audio controls className="mx-auto">
          <source src={song.previewUrl} type="audio/mpeg" />
        </audio>
      )}
    </div>
  );
}