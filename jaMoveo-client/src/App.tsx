<<<<<<< HEAD
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
=======
import { Routes, Route, Navigate } from 'react-router-dom';
>>>>>>> b6d012b2bb892e73be803181dbae202f0d357d57
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import PlayerMainPage from './pages/PlayerMainPage';
import AdminMainPage from './pages/AdminMainPage';
import ResultsPage from './pages/ResultsPage';
import LivePage from './pages/LivePage';
import OnboardingPage from './pages/OnboardingPage';
import RequireAuth from './components/RequireAuth';
import AdminChordsEditor from './pages/AdminChordsEditor';
<<<<<<< HEAD
import Navbar from './components/Navbar';

export default function App() {
  const location = useLocation();

  // Páginas onde não queremos mostrar a Navbar
  const hideNavbar = ['/login', '/signup'].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}

      <div className={hideNavbar ? '' : 'pt-0'}>
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/player/:id"
            element={
              <RequireAuth>
                <PlayerMainPage />
              </RequireAuth>
            }
          />

          <Route
            path="/admin"
            element={
              <RequireAuth>
                <AdminMainPage />
              </RequireAuth>
            }
          />

          <Route
            path="/admin/chords-editor/:id"
            element={
              <RequireAuth>
                <AdminChordsEditor />
              </RequireAuth>
            }
          />

          <Route path="/admin/results" element={<ResultsPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/live" element={<LivePage />} />

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </>
=======

export default function App() {
  return (
    <Routes>
      <Route path="/signup" element={<SignupPage />} />
      {/* Removido signup admin separado */}
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/player"
        element={
          <RequireAuth>
            <PlayerMainPage />
          </RequireAuth>
        }
      />
      <Route
        path="/admin"
        element={
          <RequireAuth>
            <AdminMainPage />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/chords-editor/:id"
        element={
          <RequireAuth>
            <AdminChordsEditor />
          </RequireAuth>
        }
      />

      <Route path="/admin/results" element={<ResultsPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/live" element={<LivePage />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
>>>>>>> b6d012b2bb892e73be803181dbae202f0d357d57
  );
}
