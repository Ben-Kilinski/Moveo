import { useState } from 'react';
import { useLocation } from 'react-router-dom';

interface SignupPageProps {
  isAdmin?: boolean;
}

export default function SignupPage({ isAdmin = false }: SignupPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [instrument, setInstrument] = useState('guitar');
  const location = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const role = location.pathname.includes('/admin') ? 'admin' : 'user';
    console.log({ username, password, instrument, role });
    // TODO: enviar dados para backend
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Signup ({isAdmin ? 'Admin' : 'User'})</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          className="w-full border p-2 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select
          className="w-full border p-2 rounded"
          value={instrument}
          onChange={(e) => setInstrument(e.target.value)}
        >
          <option value="guitar">Guitar</option>
          <option value="drums">Drums</option>
          <option value="bass">Bass</option>
          <option value="saxophone">Saxophone</option>
          <option value="keyboards">Keyboards</option>
          <option value="vocals">Vocals</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}