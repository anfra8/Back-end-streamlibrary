import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const Login = ({ onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!supabase) {
        // Mock login para desarrollo sin Supabase
        if (isLogin) {
          // Simular login exitoso
          const mockUser = {
            id: email === 'nikitin@steam.com' ? 1 : 2,
            email: email,
            user_metadata: {
              username: email === 'nikitin@steam.com' ? 'NIKITIN' : 'NewGamer'
            }
          };
          onLoginSuccess(mockUser);
        } else {
          // Simular registro exitoso
          const mockUser = {
            id: Math.floor(Math.random() * 1000),
            email: email,
            user_metadata: { username: username }
          };
          onLoginSuccess(mockUser);
        }
        return;
      }

      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        onLoginSuccess(data.user);
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username,
            },
          },
        });

        if (error) throw error;
        
        if (data.user) {
          setError('Check your email to confirm your account!');
          setTimeout(() => {
            setIsLogin(true);
            setError('');
          }, 3000);
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError(error.message || 'Failed to authenticate. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    // Login como invitado (usuario NewGamer)
    const guestUser = {
      id: 2,
      email: 'guest@steam.com',
      user_metadata: {
        username: 'Guest'
      }
    };
    onLoginSuccess(guestUser);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-frame rounded-xl p-8 max-w-md w-full neumorphic-outset relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-primary text-4xl">
            sports_esports
          </span>
          <h2 className="text-white text-2xl font-bold">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
        </div>

        {error && (
          <div className={`mb-4 p-3 rounded-lg ${error.includes('Check your email') ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'}`}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-card text-white rounded-lg px-4 py-3 neumorphic-inset focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your username"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-card text-white rounded-lg px-4 py-3 neumorphic-inset focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-card text-white rounded-lg px-4 py-3 neumorphic-inset focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your password"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-bold py-3 rounded-full neumorphic-outset-soft hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-white/60 hover:text-white transition-colors text-sm"
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </button>
        </div>

        <div className="mt-6 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-frame text-white/60">Or</span>
          </div>
        </div>

        <button
          onClick={handleGuestLogin}
          className="w-full mt-4 bg-card text-white/80 font-bold py-3 rounded-full neumorphic-inset hover:text-white transition-colors"
        >
          Continue as Guest
        </button>

        {!supabase && (
          <div className="mt-4 p-3 bg-yellow-600/20 text-yellow-400 rounded-lg text-xs text-center">
            ⚠️ Demo mode: Configure Supabase for real authentication
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
