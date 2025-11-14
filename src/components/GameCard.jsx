import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GameCard = ({ game, showPlaytime = false }) => {
  const { currentUser, toggleFavorite } = useAuth();

  const isOwned = currentUser?.ownedGames?.some(og => og.gameId === game.id);
  const isFavorite = currentUser?.favorites?.includes(game.id);
  const ownedGame = currentUser?.ownedGamesDetails?.find(og => og.id === game.id);
  const playtime = ownedGame?.playtime || game.playtime || 0;

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(game.id);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="material-symbols-outlined text-yellow-400 text-lg">
          star
        </span>
      );
    }
    if (hasHalfStar) {
      stars.push(
        <span key="half" className="material-symbols-outlined text-yellow-400 text-lg">
          star_half
        </span>
      );
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="material-symbols-outlined text-white/30 text-lg icon-regular">
          star
        </span>
      );
    }
    return stars;
  };

  return (
    <Link to={`/game/${game.id}`}>
      <div className="bg-card rounded-lg overflow-hidden flex flex-col gap-3 neumorphic-outset-soft hover:scale-[1.02] transition-transform cursor-pointer group">
        <div className="relative">
          <div
            className="bg-cover bg-center aspect-video w-full"
            style={{ backgroundImage: `url(${game.banner})` }}
          />
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-3 right-3 h-10 w-10 flex items-center justify-center rounded-full ${
              isFavorite ? 'bg-primary' : 'bg-card/80'
            } text-white neumorphic-outset-soft hover:scale-110 transition-all backdrop-blur-sm`}
          >
            <span className="material-symbols-outlined">
              {isFavorite ? 'favorite' : 'favorite_border'}
            </span>
          </button>
          {isOwned && (
            <div className="absolute top-3 left-3 bg-green-600/90 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
              OWNED
            </div>
          )}
        </div>
        
        <div className="p-4 flex flex-col gap-2">
          <div className="flex items-start justify-between">
            <h3 className="text-white font-bold text-lg group-hover:text-primary transition-colors">
              {game.name}
            </h3>
            <span className="text-primary font-bold text-lg whitespace-nowrap ml-2">
              {game.price === 0 ? 'FREE' : `$${game.price}`}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            {renderStars(game.rating)}
            <span className="text-white/60 text-sm ml-2">
              ({game.reviews.toLocaleString()})
            </span>
          </div>
          
          {showPlaytime && playtime > 0 && (
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <span className="material-symbols-outlined text-base icon-regular">schedule</span>
              <span>{playtime.toFixed(1)} hours played</span>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 mt-2">
            {game.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-[#3D1E2D] text-white/80 text-xs font-medium py-1 px-3 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GameCard;
