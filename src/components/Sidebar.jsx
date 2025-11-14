import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <nav className="hidden lg:flex flex-col items-center justify-between rounded-xl bg-frame p-6 neumorphic-outset">
      <div className="flex flex-col items-center gap-6">
        <Link
          to="/"
          className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-primary text-white neumorphic-outset-soft hover:scale-105 transition-transform"
        >
          <span className="material-symbols-outlined text-3xl">sports_esports</span>
        </Link>
        
        <div className="flex flex-col items-center gap-4">
          <Link
            to="/"
            className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-card text-white/80 hover:text-white neumorphic-inset transition-all hover:scale-105"
          >
            <span className="material-symbols-outlined text-3xl icon-regular">home</span>
          </Link>
          
          <Link
            to="/library"
            className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-card text-white/80 hover:text-white neumorphic-inset transition-all hover:scale-105"
          >
            <span className="material-symbols-outlined text-3xl icon-regular">gamepad</span>
          </Link>
          
          <Link
            to="/store"
            className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-card text-white/80 hover:text-white neumorphic-inset transition-all hover:scale-105"
          >
            <span className="material-symbols-outlined text-3xl icon-regular">storefront</span>
          </Link>
          
          <Link
            to="/favorites"
            className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-card text-white/80 hover:text-white neumorphic-inset transition-all hover:scale-105"
          >
            <span className="material-symbols-outlined text-3xl">favorite</span>
          </Link>
        </div>
      </div>

      {/* Logo o información adicional */}
      <div className="flex flex-col items-center gap-2">
        <div className="text-white/40 text-xs text-center">
          <span className="material-symbols-outlined text-2xl">videogame_asset</span>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
