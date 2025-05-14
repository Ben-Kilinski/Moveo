import { useState } from 'react';
import { useLocation } from 'react-router-dom';

interface SignupPageProps {
  isAdmin?: boolean;
}

export default function SignupPage({ isAdmin = false }: SignupPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [instrument, setInstrument] = useState('guitar');
  const [message, setMessage] = useState('');
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const role = location.pathname.includes('/admin') ? 'admin' : 'user';

    try {
      const res = await fetch('http://localhost:3001/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, instrument, role }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');

      setMessage('User created successfully ✅');
    } catch (err: any) {
      setMessage(err.message);
    }
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
        {message && <p className="mt-2 text-sm text-center text-red-600">{message}</p>}
      </form>
    </div>
  );
}
