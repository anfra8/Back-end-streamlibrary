import React from 'react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { currentUser, authUser, logout, setShowLogin } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-4">
      <h1 className="text-white tracking-light text-[32px] font-bold leading-tight text-left">
        {getGreeting()}, {currentUser?.username || 'Guest'}
      </h1>
      
      <div className="flex w-full md:w-auto items-center gap-4">
        <label className="flex flex-col min-w-40 h-12 w-full max-w-xs">
          <div className="flex w-full flex-1 items-stretch rounded-full h-full bg-card neumorphic-inset">
            <div className="text-white/60 flex items-center justify-center pl-4">
              <span className="material-symbols-outlined icon-regular">search</span>
            </div>
            <input
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-full text-white/90 focus:outline-0 focus:ring-0 border-none bg-transparent h-full placeholder:text-white/60 px-4 pl-2 text-base font-normal leading-normal"
              placeholder="Search games..."
            />
          </div>
        </label>

        {currentUser ? (
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 neumorphic-outset-soft cursor-pointer hover:scale-105 transition-transform"
                style={{ backgroundImage: `url(${currentUser?.avatar})` }}
                title={currentUser?.username}
              />
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 top-14 w-48 bg-card rounded-lg neumorphic-outset-soft opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-3 border-b border-white/10">
                  <p className="text-white font-bold">{currentUser?.username}</p>
                  <p className="text-white/60 text-xs truncate">{currentUser?.email}</p>
                </div>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-4 py-3 text-white/80 hover:text-white hover:bg-[#4D2E3D] transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">logout</span>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowLogin(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-full neumorphic-outset-soft hover:scale-105 transition-transform"
          >
            <span className="material-symbols-outlined">login</span>
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
