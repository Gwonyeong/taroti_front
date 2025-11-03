import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';

function Home() {
  const [apiStatus, setApiStatus] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5002/api/health')
      .then(res => res.json())
      .then(data => setApiStatus(data))
      .catch(err => console.error('API connection error:', err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold text-center mb-8">TaroTI</h1>
        <p className="text-xl text-center mb-12 text-purple-200">Your AI-Powered Tarot Reading Experience</p>

        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-lg p-8 shadow-2xl">
          <h2 className="text-2xl font-semibold mb-4">Welcome to TaroTI</h2>
          <p className="text-purple-100 mb-6">
            Discover insights through the mystical art of tarot, enhanced by artificial intelligence.
          </p>

          <div className="mt-8 p-4 bg-black/20 rounded">
            <p className="text-sm">
              API Status: {apiStatus ? (
                <span className="text-green-400">Connected ✓</span>
              ) : (
                <span className="text-yellow-400">Connecting...</span>
              )}
            </p>
            {apiStatus && (
              <p className="text-xs text-purple-200 mt-1">
                Last checked: {new Date(apiStatus.timestamp).toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;