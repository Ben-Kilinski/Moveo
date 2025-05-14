import { useEffect, useState } from 'react';
import { Music, Drum, Guitar, Mic2, Piano } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Song {
  trackId: number;
  trackName: string;
  artistName: string;
  artworkUrl100: string;
  previewUrl: string;
}

const iconMap: Record<string, LucideIcon> = {
  drums: Drum,
  guitar: Guitar,
  bass: Guitar,
  vocals: Mic2,
  keyboards: Piano,
  saxophone: Music,
  unknown: Music,
};

const instructionMap: Record<string, string> = {
  drums: 'Keep the tempo steady, focus on rhythm.',
  guitar: 'Play chord progression in G major.',
  bass: 'Follow root notes and lock with kick drum.',
  saxophone: 'Improvise over the chorus using G pentatonic.',
  keyboards: 'Use ambient pads and soft chords in intro.',
  vocals: 'Sing the main melody, follow the lyrics on sheet.',
  unknown: 'No instrument assigned.',
};

export default function LivePage() {
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const instrument = user.instrument || 'unknown';
  const Icon = iconMap[instrument] || Music;
  const instruction = instructionMap[instrument];

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

      <div className="mt-6 p-4 border rounded shadow bg-gray-50">
        <h3 className="text-lg font-semibold mb-2 flex items-center justify-center gap-2">
          <Icon className="w-5 h-5" /> Instructions for: {instrument}
        </h3>
        <p className="text-sm text-gray-700">{instruction}</p>
      </div>
    </div>
  );
}

