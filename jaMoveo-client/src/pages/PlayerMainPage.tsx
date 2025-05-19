import { useEffect, useState } from 'react';
<<<<<<< HEAD
import { useParams } from 'react-router-dom';
import socket from '../socket';
=======
import socket from '../socket'; // ajuste o caminho conforme a estrutura
>>>>>>> b6d012b2bb892e73be803181dbae202f0d357d57

interface Song {
  id: number;
  trackId: number;
  trackName: string;
  artistName: string;
  artworkUrl100: string;
  previewUrl: string;
  lyrics: string;
  chords: string | null;
}

<<<<<<< HEAD
interface User {
  id: number;
  username: string;
  role: 'admin' | 'user';
  instrument: string;
}

export default function PlayerMainPage() {
  const { id } = useParams();
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);

  const storedUser = localStorage.getItem('user');
  const user: User | null = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/songs/${id}`);
        const data = await res.json();
        setSong(data);
      } catch (error) {
        console.error('Erro ao buscar a música:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSong();
  }, [id]);

  useEffect(() => {
    const handleUpdate = (data: Song) => {
      if (id && Number(id) === data.id) {
        setSong(data);
        setLoading(false);
      }
    };

    socket.on('song-selected', handleUpdate);
    return () => {
      socket.off('song-selected', handleUpdate);
    };
  }, [id]);

  if (loading) {
    return <div className="p-4 text-white text-xl text-center">🔄 Carregando música...</div>;
  }

  if (!song) {
    return <div className="p-4 text-white text-xl text-center">❌ Música não encontrada.</div>;
  }

  return (
    <div className="min-h-screen bg-[#1f2c38] text-white p-6 mt-14">
      <h1 className="text-2xl font-bold text-center mb-2">{song.trackName}</h1>
      <h2 className="text-md text-center mb-6 text-gray-400">by {song.artistName}</h2>

      <div className="flex justify-center mb-6">
=======
export default function PlayerMainPage() {
  const [song, setSong] = useState<Song | null>(null);

  useEffect(() => {
    // 🎧 Escuta o evento enviado pelo admin
    socket.on('song-selected', (data: Song) => {
      console.log('🎶 Música recebida via socket:', data);
      setSong(data);
    });

    return () => {
      socket.off('song-selected');
    };
  }, []);

  if (!song) {
    return <div className="p-4 text-white text-xl text-center">🎵 Waiting for next song...</div>;
  }

  return (
    <div className="min-h-screen bg-[#1f2c38] text-white p-6">
      <h1 className="text-2xl font-bold text-center mb-4">{song.trackName}</h1>
      <h2 className="text-md text-center mb-6 text-gray-400">by {song.artistName}</h2>

      <div className="flex justify-center mb-4">
>>>>>>> b6d012b2bb892e73be803181dbae202f0d357d57
        <img
          src={song.artworkUrl100}
          alt={song.trackName}
          className="rounded-xl shadow-lg w-40 h-40 object-cover"
        />
      </div>

<<<<<<< HEAD
      {song.previewUrl && (
        <div className="flex justify-center mb-6">
          <audio controls className="w-full max-w-md">
            <source src={song.previewUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      <div className="bg-[#2b3e4f] p-6 rounded-xl max-w-3xl mx-auto whitespace-pre-wrap text-lg leading-relaxed">
        {/* 🎸 Mostrar acordes se existir e o usuário não for "singer" */}
        {song.chords && user?.instrument !== 'vocals' ? (
          <>
            {JSON.parse(song.chords).map((line: any[], lineIndex: number) => (
              <div key={lineIndex} className="mb-4">
                {/* Linha de acordes */}
                <div className="text-green-400 font-semibold">
                  {line.map((word, i) => (
                    <span key={i} className="inline-block min-w-[2ch] mr-1">
                      {word.chords || ''}
                    </span>
                  ))}
                </div>
                {/* Linha de letras */}
                <div className="text-white">
                  {line.map((word, i) => (
                    <span key={i} className="inline-block min-w-[2ch] mr-1">
                      {word.lyrics}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </>
        ) : (
          <p className="text-white whitespace-pre-line">{song.lyrics}</p>
        )}
=======
      <div className="bg-[#2b3e4f] p-6 rounded-xl max-w-3xl mx-auto whitespace-pre-wrap text-lg leading-relaxed">
        {/* Aqui renderiza só a letra ou letra + acordes baseado no usuário (ajustar isso se tiver role/instrumento) */}
        {song.chords ? (
          <>
            <p className="text-green-400 mb-2">🎸 Chords:</p>
            <pre className="text-white">{song.chords}</pre>
            <hr className="my-4 border-gray-600" />
          </>
        ) : null}

        <p className="text-white whitespace-pre-line">{song.lyrics}</p>
>>>>>>> b6d012b2bb892e73be803181dbae202f0d357d57
      </div>
    </div>
  );
}
