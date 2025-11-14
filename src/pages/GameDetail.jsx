import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';

const GameDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const { currentUser, toggleFavorite, purchaseGame, refreshUser } = useAuth();

  useEffect(() => {
    fetchGame();
  }, [id]);

  const fetchGame = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/games/${id}`);
      const data = await response.json();
      setGame(data);
    } catch (error) {
      console.error('Error fetching game:', error);
    }
  };

  if (!game) {
    return (
      <div className="flex-1 rounded-xl bg-frame p-6 md:p-8 flex items-center justify-center neumorphic-outset">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const isOwned = currentUser?.ownedGames?.some((og) => og.gameId === game.id);
  const isFavorite = currentUser?.favorites?.includes(game.id);
  const ownedGame = currentUser?.ownedGamesDetails?.find((og) => og.id === game.id);

  const handlePurchase = async () => {
    const success = await purchaseGame(game.id);
    if (success) {
      alert(`${game.name} has been added to your library!`);
      await refreshUser();
    } else {
      alert('Unable to purchase game');
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="material-symbols-outlined text-yellow-400 text-2xl">
          star
        </span>
      );
    }
    if (hasHalfStar) {
      stars.push(
        <span key="half" className="material-symbols-outlined text-yellow-400 text-2xl">
          star_half
        </span>
      );
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="material-symbols-outlined text-white/30 text-2xl icon-regular">
          star
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="flex-1 rounded-xl bg-frame p-6 md:p-8 flex flex-col gap-8 neumorphic-outset overflow-auto">
      <Header />

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-white/80 hover:text-white transition-colors w-fit"
      >
        <span className="material-symbols-outlined">arrow_back</span>
        <span>Back</span>
      </button>

      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center rounded-xl overflow-hidden neumorphic-outset-soft"
        style={{
          backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0.8) 100%), url(${game.banner})`,
          minHeight: '400px'
        }}
      >
        <div className="absolute inset-0 flex flex-col justify-end p-8">
          <h1 className="text-white text-5xl font-bold mb-4">{game.name}</h1>
          <p className="text-white/90 text-xl mb-4 max-w-3xl">{game.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {game.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-black/50 text-white text-sm font-medium py-2 px-4 rounded-full backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {!isOwned ? (
              <>
                <button
                  onClick={handlePurchase}
                  className="px-8 py-4 bg-primary text-white rounded-full font-bold text-lg neumorphic-outset-soft hover:scale-105 transition-transform"
                >
                  {game.price === 0 ? 'Add to Library - FREE' : `Buy Now - $${game.price}`}
                </button>
                <span className="text-white text-3xl font-bold">
                  {game.price === 0 ? 'FREE TO PLAY' : `$${game.price}`}
                </span>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <div className="px-8 py-4 bg-green-600 text-white rounded-full font-bold text-lg neumorphic-outset-soft">
                  ✓ In Your Library
                </div>
                {ownedGame?.playtime > 0 && (
                  <span className="text-white/80">
                    {ownedGame.playtime.toFixed(1)} hours played
                  </span>
                )}
              </div>
            )}

            <button
              onClick={() => toggleFavorite(game.id)}
              className={`h-14 w-14 flex items-center justify-center rounded-full ${
                isFavorite ? 'bg-primary' : 'bg-card'
              } text-white neumorphic-outset-soft hover:scale-110 transition-all`}
            >
              <span className="material-symbols-outlined text-2xl">
                {isFavorite ? 'favorite' : 'favorite_border'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Stats */}
        <div className="bg-card rounded-lg p-6 neumorphic-outset-soft">
          <h3 className="text-white text-xl font-bold mb-6">Game Info</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-white/60 text-sm mb-1">Rating</p>
              <div className="flex items-center gap-2">
                {renderStars(game.rating)}
                <span className="text-white font-bold ml-2">{game.rating.toFixed(1)}</span>
              </div>
            </div>

            <div>
              <p className="text-white/60 text-sm mb-1">Reviews</p>
              <p className="text-white font-bold text-lg">{game.reviews.toLocaleString()}</p>
            </div>

            <div>
              <p className="text-white/60 text-sm mb-1">Price</p>
              <p className="text-white font-bold text-lg">
                {game.price === 0 ? 'FREE TO PLAY' : `$${game.price}`}
              </p>
            </div>

            <div>
              <p className="text-white/60 text-sm mb-1">Tags</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {game.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-[#3D1E2D] text-white text-xs font-medium py-1 px-3 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Comments */}
        <div className="lg:col-span-2 bg-card rounded-lg p-6 neumorphic-outset-soft">
          <h3 className="text-white text-xl font-bold mb-6">
            User Reviews ({game.comments.length})
          </h3>

          <div className="space-y-4">
            {game.comments.map((comment, index) => (
              <div key={index} className="bg-[#3D1E2D] p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full bg-cover bg-center"
                      style={{ backgroundImage: `url(https://i.pravatar.cc/150?img=${index + 10})` }}
                    />
                    <div>
                      <p className="text-white font-bold">{comment.user}</p>
                      <p className="text-white/60 text-xs">{comment.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(comment.rating)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-yellow-400 text-lg">
                        star
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-white/90">{comment.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetail;
