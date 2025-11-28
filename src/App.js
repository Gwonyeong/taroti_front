import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Home from './pages/Home';
import Landing from './pages/Landing';
import Result from './pages/Result';
import Feedback from './pages/Feedback';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import DecemberFortune from './pages/DecemberFortune';
import DecemberFortuneResult from './pages/DecemberFortuneResult';
import ShareFortuneResult from './pages/ShareFortuneResult';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/mind-reading" element={<Landing />} />
            <Route path="/landing" element={<Navigate to="/mind-reading" replace />} />
            <Route path="/result/:landingUserId" element={<Result />} />
            <Route path="/mind-reading-result/:mindReadingId" element={<Result />} />
            <Route path="/feedback/:landingUserId" element={<Feedback />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/december-fortune" element={<DecemberFortune />} />
            <Route path="/december-fortune-result/:fortuneId" element={<DecemberFortuneResult />} />
            <Route path="/share/:shareId" element={<ShareFortuneResult />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster position="top-center" />
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;