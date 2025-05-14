import { Routes, Route } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import PlayerMainPage from './/pages/PlayerMainPage';
import AdminMainPage from './pages/AdminMainPage';
import ResultsPage from './pages/ResultsPage';
import LivePage from './pages/LivePage';

function App() {
  return (
    <Routes>
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/player" element={<PlayerMainPage />} />
      <Route path="/admin" element={<AdminMainPage />} />
      <Route path="/admin/results" element={<ResultsPage />} />
      <Route path="/live" element={<LivePage />} />
    </Routes>
  );
}

export default App;