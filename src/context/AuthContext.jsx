import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    // Check Supabase session
    checkSession();

    // Listen for auth changes
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session?.user) {
            setAuthUser(session.user);
            await fetchOrCreateUser(session.user);
          } else {
            setAuthUser(null);
            setCurrentUser(null);
            setLoading(false);
          }
        }
      );

      return () => subscription.unsubscribe();
    } else {
      // Sin Supabase, check localStorage
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId) {
        fetchUser(parseInt(storedUserId));
      } else {
        setLoading(false);
      }
    }
  }, []);

  const checkSession = async () => {
    if (supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setAuthUser(session.user);
        await fetchOrCreateUser(session.user);
      } else {
        setLoading(false);
      }
    }
  };

  const fetchOrCreateUser = async (authUser) => {
    try {
      // Intentar obtener usuario de la API
      let response = await fetch(`http://localhost:3001/api/users/email/${authUser.email}`);
      
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data);
        localStorage.setItem('userId', data.id);
      } else {
        // Crear nuevo usuario si no existe
        const newUser = {
          email: authUser.email,
          username: authUser.user_metadata?.username || authUser.email.split('@')[0],
          avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
          ownedGames: [],
          favorites: [],
          totalPlaytime: 0
        };

        response = await fetch('http://localhost:3001/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser)
        });

        if (response.ok) {
          const data = await response.json();
          setCurrentUser(data);
          localStorage.setItem('userId', data.id);
        }
      }
    } catch (error) {
      console.error('Error fetching/creating user:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/users/${userId}`);
      const data = await response.json();
      setCurrentUser(data);
      localStorage.setItem('userId', userId);
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (user) => {
    setAuthUser(user);
    await fetchOrCreateUser(user);
    setShowLogin(false);
  };

  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setAuthUser(null);
    setCurrentUser(null);
    localStorage.removeItem('userId');
  };

  const switchUser = (userId) => {
    fetchUser(userId);
  };

  const toggleFavorite = async (gameId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/users/${currentUser.id}/favorites/${gameId}`,
        { method: 'POST' }
      );
      const updatedUser = await response.json();
      setCurrentUser(updatedUser);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const purchaseGame = async (gameId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/users/${currentUser.id}/purchase/${gameId}`,
        { method: 'POST' }
      );
      if (response.ok) {
        await fetchUser(currentUser.id);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error purchasing game:', error);
      return false;
    }
  };

  const value = {
    currentUser,
    authUser,
    loading,
    showLogin,
    setShowLogin,
    login,
    logout,
    switchUser,
    toggleFavorite,
    purchaseGame,
    refreshUser: () => fetchUser(currentUser.id)
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
