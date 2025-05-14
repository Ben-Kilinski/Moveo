import { useEffect, useState } from 'react';
import { Music, Drum, Guitar, Mic2, Piano } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Song {
  trackId: number;
  trackName: string;
  artistName: string;
  artworkUrl100: string;
  previewUrl: string;
  lyrics?: string;
  chords?: string;
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
  const [audioKey, setAudioKey] = useState(0);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const instrument = user.instrument || 'unknown';

  useEffect(() => {
    if (!user.instrument) {
      navigate('/onboarding');
      return;
    }
  }, []);

  const Icon = iconMap[instrument] || Music;
  const instruction = instructionMap[instrument];

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3002');

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'update') {
        setSong(message.song);
        setAudioKey(prev => prev + 1);
      }
    };

    socket.onerror = (err) => {
      console.error('WebSocket error:', err);
    };

    return () => socket.close();
  }, []);

  const selectExampleSong = async () => {
    const res = await fetch('https://itunes.apple.com/search?term=beatles&media=music&limit=1');
    const data = await res.json();
    const song = data.results[0];

    const payload = {
      trackId: song.trackId,
      trackName: song.trackName,
      artistName: song.artistName,
      artworkUrl100: song.artworkUrl100,
      previewUrl: song.previewUrl,
    };

    await fetch('http://localhost:3001/api/songs/current', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-gradient-to-br from-slate-100 to-slate-200 text-center">
      <div className="absolute top-4 right-6">
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 underline hover:text-red-800"
        >
          Logout
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-6">Now Playing</h1>

      {!song ? (
        <>
          <p className="mb-6 text-red-500">No song selected</p>
          <button
            onClick={selectExampleSong}
            className="animate-pulse bg-blue-600 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition"
          >
            Load Example Song
          </button>
        </>
      ) : (
        <>
          <img
            src={song.artworkUrl100}
            alt={song.trackName}
            className="mx-auto mb-6 w-48 h-48 rounded-xl shadow-lg hover:scale-105 transition"
          />
          <h2 className="text-2xl font-bold mb-1">{song.trackName}</h2>
          <p className="text-gray-600 mb-4">{song.artistName}</p>

          {song.previewUrl && (
            <audio key={audioKey} controls autoPlay className="mx-auto mb-6">
              <source src={song.previewUrl} type="audio/mpeg" />
            </audio>
          )}

          <div className="max-w-md mx-auto mt-6 p-4 border border-slate-300 bg-white/60 backdrop-blur rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2 flex items-center justify-center gap-2">
              <Icon className="w-5 h-5" /> Instructions for: {instrument}
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">{instruction}</p>
          </div>

          {song.lyrics && (
            <div className="mt-6 p-4 border rounded shadow bg-white text-left max-w-2xl mx-auto">
              <h4 className="text-lg font-bold mb-2">Lyrics</h4>
              <pre className="whitespace-pre-wrap text-sm text-gray-800">{song.lyrics}</pre>
            </div>
          )}
          {song.chords && (
            <div className="mt-6 p-4 border rounded shadow bg-white max-w-2xl mx-auto">
              <h4 className="text-lg font-bold mb-4 text-center">Chords</h4>
              <div className="space-y-4 text-left font-mono text-sm">
                {JSON.parse(song.chords).map((line: any[], lineIdx: number) => (
                  <div key={lineIdx}>
                    <div className="flex gap-2">
                      {line.map((item, idx) => (
                        <span key={idx} className="min-w-[50px] text-blue-600 text-center">
                          {item.chords || ''}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      {line.map((item, idx) => (
                        <span key={idx} className="min-w-[50px] text-gray-800 text-center">
                          {item.lyrics}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </>
      )}
    </div>
  );
}
