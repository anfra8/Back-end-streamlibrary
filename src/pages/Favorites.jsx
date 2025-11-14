import React, { useState, useEffect } from 'react';
import GameCard from '../components/GameCard';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';

const Favorites = () => {
  const [games, setGames] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/games');
      const data = await response.json();
      setGames(data);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  const favoriteGames = games.filter((game) =>
    currentUser?.favorites?.includes(game.id)
  );

  return (
    <div className="flex-1 rounded-xl bg-frame p-6 md:p-8 flex flex-col gap-8 neumorphic-outset">
      <Header />

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white text-3xl font-bold">Favorite Games</h2>
            <p className="text-white/60 mt-1">
              {favoriteGames.length} {favoriteGames.length === 1 ? 'game' : 'games'} in your favorites
            </p>
          </div>
        </div>

        {favoriteGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteGames.map((game) => (
              <GameCard key={game.id} game={game} showPlaytime={true} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-card rounded-lg neumorphic-inset">
            <span className="material-symbols-outlined text-white/40 text-8xl mb-4">
              heart_broken
            </span>
            <h3 className="text-white text-2xl font-bold mb-2">No favorites yet</h3>
            <p className="text-white/60 mb-6 text-center max-w-md">
              Add games to your favorites by clicking the heart icon on any game card
            </p>
            <a
              href="/store"
              className="px-6 py-3 bg-primary text-white rounded-full font-bold neumorphic-outset-soft hover:scale-105 transition-transform"
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined">storefront</span>
                Browse Store
              </span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
