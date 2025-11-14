import React from 'react';
import GameCard from '../components/GameCard';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';

const Library = () => {
  const { currentUser } = useAuth();

  const ownedGames = currentUser?.ownedGamesDetails || [];
  const totalPlaytime = currentUser?.totalPlaytime || 0;

  return (
    <div className="flex-1 rounded-xl bg-frame p-6 md:p-8 flex flex-col gap-8 neumorphic-outset">
      <Header />

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white text-3xl font-bold">My Library</h2>
            <p className="text-white/60 mt-1">
              {ownedGames.length} games • {totalPlaytime.toFixed(1)} hours played
            </p>
          </div>
        </div>

        {ownedGames.length > 0 ? (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-card p-6 rounded-lg neumorphic-outset-soft">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-4xl">
                    videogame_asset
                  </span>
                  <div>
                    <p className="text-white text-2xl font-bold">{ownedGames.length}</p>
                    <p className="text-white/60 text-sm">Games Owned</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card p-6 rounded-lg neumorphic-outset-soft">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-4xl">schedule</span>
                  <div>
                    <p className="text-white text-2xl font-bold">{totalPlaytime.toFixed(0)}h</p>
                    <p className="text-white/60 text-sm">Total Playtime</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card p-6 rounded-lg neumorphic-outset-soft">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-4xl">trending_up</span>
                  <div>
                    <p className="text-white text-2xl font-bold">
                      {ownedGames.length > 0 ? (totalPlaytime / ownedGames.length).toFixed(1) : 0}h
                    </p>
                    <p className="text-white/60 text-sm">Avg per Game</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Games Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {ownedGames.map((game) => (
                <GameCard key={game.id} game={game} showPlaytime={true} />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-card rounded-lg neumorphic-inset">
            <span className="material-symbols-outlined text-white/40 text-8xl mb-4">
              videogame_asset_off
            </span>
            <h3 className="text-white text-2xl font-bold mb-2">Your library is empty</h3>
            <p className="text-white/60 mb-6 text-center max-w-md">
              Browse our store to find amazing games to add to your collection
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

export default Library;
