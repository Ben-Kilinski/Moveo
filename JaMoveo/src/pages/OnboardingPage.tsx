import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const instruments = [
  'drums',
  'guitar',
  'bass',
  'vocals',
  'keyboards',
  'saxophone',
];

export default function OnboardingPage() {
  const [selected, setSelected] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!selected) return alert('Please select an instrument');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = { ...user, instrument: selected };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    navigate('/live');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-2xl font-bold">Select Your Instrument</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {instruments.map((inst) => (
          <button
            key={inst}
            onClick={() => setSelected(inst)}
            className={`px-4 py-2 border rounded shadow hover:bg-blue-100 transition ${
              selected === inst ? 'bg-blue-600 text-white' : 'bg-white'
            }`}
          >
            {inst}
          </button>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Continue
      </button>
    </div>
  );
}
