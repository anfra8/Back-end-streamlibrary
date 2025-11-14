import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import Home from './pages/Home';
import Store from './pages/Store';
import Library from './pages/Library';
import Favorites from './pages/Favorites';
import GameDetail from './pages/GameDetail';

function AppContent() {
  const { loading, showLogin, setShowLogin, login } = useAuth();

  if (loading) {
    return (
      <div className="relative flex h-screen w-full items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div className="relative flex h-auto min-h-screen w-full flex-col p-4 sm:p-6 lg:p-8">
        <div className="flex h-full w-full grow gap-6">
          <Sidebar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/store" element={<Store />} />
            <Route path="/library" element={<Library />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/game/:id" element={<GameDetail />} />
          </Routes>
        </div>
      </div>

      {showLogin && (
        <Login 
          onClose={() => setShowLogin(false)} 
          onLoginSuccess={login}
        />
      )}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
