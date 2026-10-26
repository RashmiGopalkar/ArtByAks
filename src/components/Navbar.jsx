import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  Menu, 
  X, 
  Settings, 
  Plus,
  Brush
} from 'lucide-react';

export const Navbar = ({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory }) => {
  const { 
    cart, 
    wishlist, 
    setIsCartOpen, 
    setIsCommissionOpen, 
    isAdminOpen, 
    setIsAdminOpen,
    isArtistMode,
    setIsArtistMode,
    openAddPaintingModal,
    artistSettings
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const totalCartCount = cart.length;
  const totalWishlistCount = wishlist.length;

  return (
    <header className="sticky top-0 z-40 bg-[#faf9f6]/95 backdrop-blur-md border-b border-stone-200/70 transition-all">
      {/* Delicate, Minimalist Announcement Bar */}
      <div className="border-b border-stone-200/50 py-1.5 px-4 text-[11px] text-stone-500 font-normal tracking-wide">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="hidden sm:flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-stone-400"></span>
            <span>{artistSettings.brandName} • Original Warli Art & Oil Paintings • Pan-India Delivery</span>
          </div>

          <div className="flex items-center space-x-3 ml-auto text-[11px]">
            {/* Minimalist Artist Mode Switch */}
            <button
              onClick={() => setIsArtistMode(!isArtistMode)}
              className={`px-2.5 py-0.5 rounded-full text-[10px] transition flex items-center space-x-1.5 border ${
                isArtistMode 
                  ? 'border-stone-800 bg-stone-900 text-stone-100 font-medium' 
                  : 'border-stone-300 bg-white/60 text-stone-600 hover:text-stone-900'
              }`}
              title="Toggle artist edit/delete controls on cards"
            >
              <Brush className="w-2.5 h-2.5" />
              <span>Studio Controls: {isArtistMode ? 'Active' : 'Off'}</span>
            </button>

            {isArtistMode && (
              <button
                onClick={openAddPaintingModal}
                className="text-[10px] uppercase tracking-wider font-semibold text-stone-900 hover:text-amber-900 underline underline-offset-4 flex items-center space-x-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Painting</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Main Navbar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Left: Nav Links */}
        <div className="flex items-center space-x-8">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-700 hover:text-stone-950 rounded-lg hover:bg-stone-100/60 transition"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="hidden md:flex items-center space-x-8 text-xs font-normal uppercase tracking-[0.16em] text-stone-600">
            <a 
              href="#gallery" 
              className="hover:text-stone-950 transition-colors"
            >
              Gallery
            </a>
            <button 
              onClick={() => setIsCommissionOpen(true)}
              className="hover:text-stone-950 transition-colors text-left"
            >
              Bespoke Order
            </button>
            <a 
              href="#story" 
              className="hover:text-stone-950 transition-colors"
            >
              About the Artist
            </a>
            <a 
              href="#care" 
              className="hover:text-stone-950 transition-colors"
            >
              Care & Guidance
            </a>
          </div>
        </div>

        {/* Center: Refined Editorial Typography Brand */}
        <div 
          className="flex flex-col items-center cursor-pointer select-none" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <span className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-stone-900">
            Akshatha Gopalkar
          </span>
          <span className="text-[9px] uppercase tracking-[0.3em] text-stone-400 font-light -mt-0.5">
            Original Art Studio
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          
          {/* Minimalist Search */}
          <div className="relative">
            {showSearchInput ? (
              <div className="flex items-center bg-white border border-stone-300 rounded-full px-3 py-1 text-xs shadow-sm w-44 sm:w-56">
                <Search className="w-3.5 h-3.5 text-stone-400 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Search Warli, oils..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-stone-800 placeholder-stone-400 text-xs"
                  autoFocus
                />
                <button 
                  onClick={() => { setShowSearchInput(false); setSearchQuery(''); }}
                  className="text-stone-400 hover:text-stone-700 ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSearchInput(true)}
                className="p-2 text-stone-600 hover:text-stone-950 transition rounded-full hover:bg-stone-100/60"
                title="Search Artworks"
              >
                <Search className="w-4 h-4 stroke-[1.5]" />
              </button>
            )}
          </div>

          {/* Wishlist */}
          <a
            href="#gallery"
            className="relative p-2 text-stone-600 hover:text-stone-950 transition rounded-full hover:bg-stone-100/60"
            title="Saved Favorites"
          >
            <Heart className={`w-4 h-4 stroke-[1.5] ${totalWishlistCount > 0 ? 'text-stone-900 fill-stone-900/10' : ''}`} />
            {totalWishlistCount > 0 && (
              <span className="absolute 1 top-1 -right-0.5 bg-stone-900 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-mono">
                {totalWishlistCount}
              </span>
            )}
          </a>

          {/* Bag */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-stone-900 hover:text-black transition rounded-full hover:bg-stone-100/60 flex items-center"
            title="Collector Bag"
          >
            <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
            {totalCartCount > 0 && (
              <span className="absolute 1 top-1 -right-0.5 bg-stone-900 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-mono">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* Minimalist Studio Portal Button */}
          <button
            onClick={() => setIsAdminOpen(!isAdminOpen)}
            className={`hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium border transition ${
              isAdminOpen 
                ? 'bg-stone-900 text-stone-50 border-stone-900' 
                : 'bg-white/80 text-stone-700 border-stone-200 hover:border-stone-400'
            }`}
          >
            <Settings className="w-3 h-3 stroke-[1.5]" />
            <span>Studio</span>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#faf9f6] border-b border-stone-200 px-6 py-6 space-y-4 animate-fadeIn">
          <div className="flex flex-col space-y-3.5 text-xs font-normal uppercase tracking-[0.16em] text-stone-700">
            <button
              onClick={() => { openAddPaintingModal(); setMobileMenuOpen(false); }}
              className="text-left py-2 px-3 rounded-xl bg-stone-900 text-white font-medium flex items-center space-x-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Your Painting</span>
            </button>
            <a 
              href="#gallery" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-stone-950"
            >
              Gallery Collection
            </a>
            <button 
              onClick={() => { setIsCommissionOpen(true); setMobileMenuOpen(false); }}
              className="text-left py-1 hover:text-stone-950 uppercase"
            >
              Bespoke Order
            </button>
            <a 
              href="#story" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-stone-950"
            >
              About the Artist
            </a>
            <a 
              href="#care" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-stone-950"
            >
              Care & Guidance
            </a>
            <div className="pt-3 border-t border-stone-200">
              <button
                onClick={() => { setIsAdminOpen(!isAdminOpen); setMobileMenuOpen(false); }}
                className="w-full py-2.5 px-3 text-[11px] font-medium rounded-xl border border-stone-300 text-stone-800 flex items-center justify-center space-x-2 bg-white"
              >
                <Settings className="w-3.5 h-3.5 text-stone-600" />
                <span>{isAdminOpen ? 'Close Studio View' : 'Open Artist Studio Portal'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
