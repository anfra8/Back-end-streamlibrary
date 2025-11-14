import React, { useState, useEffect } from 'react';
import GameCard from '../components/GameCard';
import Header from '../components/Header';

const Store = () => {
  const [games, setGames] = useState([]);
  const [filter, setFilter] = useState('all');

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

  const filteredGames = games.filter((game) => {
    if (filter === 'free') return game.price === 0;
    if (filter === 'paid') return game.price > 0;
    return true;
  });

  return (
    <div className="flex-1 rounded-xl bg-frame p-6 md:p-8 flex flex-col gap-8 neumorphic-outset">
      <Header />

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-white text-3xl font-bold">Game Store</h2>
          
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                filter === 'all'
                  ? 'bg-primary text-white neumorphic-outset-soft'
                  : 'bg-card text-white/60 neumorphic-inset hover:text-white'
              }`}
            >
              All Games
            </button>
            <button
              onClick={() => setFilter('free')}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                filter === 'free'
                  ? 'bg-primary text-white neumorphic-outset-soft'
                  : 'bg-card text-white/60 neumorphic-inset hover:text-white'
              }`}
            >
              Free to Play
            </button>
            <button
              onClick={() => setFilter('paid')}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                filter === 'paid'
                  ? 'bg-primary text-white neumorphic-outset-soft'
                  : 'bg-card text-white/60 neumorphic-inset hover:text-white'
              }`}
            >
              Premium
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-white/40 text-6xl">search_off</span>
            <p className="text-white/60 mt-4 text-lg">No games found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Store;
