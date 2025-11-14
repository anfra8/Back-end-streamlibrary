import React, { useState, useEffect } from 'react';
import GameCard from '../components/GameCard';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [games, setGames] = useState([]);
  const [featuredGame, setFeaturedGame] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/games');
      const data = await response.json();
      setGames(data);
      // Set first game as featured
      if (data.length > 0) {
        setFeaturedGame(data[0]);
      }
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  const newGames = games.slice(1, 4);
  const popularGames = games.slice(4, 8);

  return (
    <div className="flex-1 rounded-xl bg-frame p-6 md:p-8 flex flex-col gap-8 neumorphic-outset">
      <Header />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="xl:col-span-2 flex flex-col gap-8">
          {/* Hero Card */}
          {featuredGame && (
            <div
              className="bg-cover bg-center flex flex-col items-stretch justify-end rounded-xl pt-[132px] neumorphic-outset-soft"
              style={{
                backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.2) 100%), url(${featuredGame.banner})`
              }}
            >
              <div className="flex w-full flex-col sm:flex-row items-start sm:items-end justify-between gap-4 p-6">
                <div className="flex max-w-[440px] flex-1 flex-col gap-2">
                  <p className="text-[#F5DDAA] text-sm font-bold leading-normal bg-black/30 px-2 py-1 rounded-md self-start">
                    Featured
                  </p>
                  <p className="text-white tracking-light text-3xl font-bold leading-tight">
                    {featuredGame.name}
                  </p>
                  <p className="text-white/80 text-base font-medium leading-normal">
                    {featuredGame.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    {featuredGame.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-black/40 text-white/90 text-xs font-medium py-1 px-3 rounded-full backdrop-blur-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <a
                  href={`/game/${featuredGame.id}`}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-6 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] neumorphic-outset-soft hover:scale-105 transition-transform"
                >
                  <span className="truncate">View Details</span>
                </a>
              </div>
            </div>
          )}

          {/* New Games */}
          <div className="flex flex-col gap-4">
            <h2 className="text-white text-2xl font-bold">New Releases</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {newGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </div>

          {/* Popular Games */}
          <div className="flex flex-col gap-4">
            <h2 className="text-white text-2xl font-bold">Popular Games</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="xl:col-span-1 flex flex-col gap-8">
          {/* User Stats */}
          <div className="bg-card rounded-lg p-6 flex flex-col items-center gap-4 neumorphic-outset-soft">
            <h3 className="text-white text-xl font-bold self-start">Your Library</h3>
            
            <div className="w-full grid grid-cols-2 gap-4">
              <div className="bg-[#3D1E2D] p-4 rounded-lg text-center">
                <p className="text-white text-3xl font-bold">{currentUser?.ownedGames?.length || 0}</p>
                <p className="text-white/60 text-sm mt-1">Games Owned</p>
              </div>
              <div className="bg-[#3D1E2D] p-4 rounded-lg text-center">
                <p className="text-white text-3xl font-bold">{currentUser?.totalPlaytime?.toFixed(0) || 0}h</p>
                <p className="text-white/60 text-sm mt-1">Total Playtime</p>
              </div>
            </div>

            {currentUser?.ownedGames?.length > 0 && (
              <div className="w-full">
                <h4 className="text-white/80 text-sm font-bold mb-3">Recently Played</h4>
                {currentUser.ownedGamesDetails?.slice(0, 3).map((game) => (
                  <div key={game.id} className="flex items-center gap-3 mb-3 bg-[#3D1E2D] p-3 rounded-lg">
                    <div
                      className="w-12 h-12 bg-cover bg-center rounded"
                      style={{ backgroundImage: `url(${game.banner})` }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate">{game.name}</p>
                      <p className="text-white/60 text-xs">{game.playtime?.toFixed(1)}h played</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {currentUser?.ownedGames?.length === 0 && (
              <div className="w-full text-center py-6">
                <span className="material-symbols-outlined text-white/40 text-6xl">
                  videogame_asset_off
                </span>
                <p className="text-white/60 mt-3">No games in library</p>
                <a
                  href="/store"
                  className="inline-block mt-3 px-4 py-2 bg-primary text-white rounded-full text-sm font-bold hover:scale-105 transition-transform"
                >
                  Browse Store
                </a>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-card rounded-lg p-6 flex flex-col gap-4 neumorphic-outset-soft">
            <h3 className="text-white text-xl font-bold">Quick Access</h3>
            <a
              href="/library"
              className="flex items-center gap-3 bg-[#3D1E2D] p-4 rounded-lg hover:bg-[#4D2E3D] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-white/80 icon-regular">gamepad</span>
              <span className="text-white font-medium">My Library</span>
            </a>
            <a
              href="/store"
              className="flex items-center gap-3 bg-[#3D1E2D] p-4 rounded-lg hover:bg-[#4D2E3D] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-white/80 icon-regular">storefront</span>
              <span className="text-white font-medium">Browse Store</span>
            </a>
            <a
              href="/favorites"
              className="flex items-center gap-3 bg-[#3D1E2D] p-4 rounded-lg hover:bg-[#4D2E3D] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-white/80">favorite</span>
              <span className="text-white font-medium">Favorites ({currentUser?.favorites?.length || 0})</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
