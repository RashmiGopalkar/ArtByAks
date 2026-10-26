import React, { useState, useMemo } from 'react';
import { useShop, ShopProvider } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { RoomVisualizerModal } from './components/RoomVisualizerModal';
import { CertificateModal } from './components/CertificateModal';
import { CommissionModal } from './components/CommissionModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { ArtworkFormModal } from './components/ArtworkFormModal';
import { ArtistStory } from './components/ArtistStory';
import { ArtCareFAQ } from './components/ArtCareFAQ';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';
import { Toast } from './components/Toast';
import { ART_CATEGORIES } from './data/paintings';
import { 
  Plus, 
  Trash2, 
  RotateCcw, 
  X, 
  SlidersHorizontal,
  Brush
} from 'lucide-react';

function GalleryApp() {
  const { 
    paintings, 
    isAdminOpen, 
    setIsCommissionOpen,
    isArtistMode,
    openAddPaintingModal,
    clearAllPaintings,
    resetToSamplePaintings,
    artistSettings
  } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'available' | 'sold'
  const [sizeFilter, setSizeFilter] = useState('all'); // 'all' | 'Small' | 'Medium' | 'Large'
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price-asc' | 'price-desc' | 'newest'

  // Filter and sort paintings
  const filteredPaintings = useMemo(() => {
    return paintings.filter((art) => {
      if (selectedCategory !== 'All' && art.category !== selectedCategory) {
        return false;
      }
      if (statusFilter !== 'all' && art.status !== statusFilter) {
        return false;
      }
      if (sizeFilter !== 'all' && art.sizeCategory !== sizeFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = art.title?.toLowerCase().includes(query);
        const matchesMedium = art.medium?.toLowerCase().includes(query);
        const matchesCategory = art.category?.toLowerCase().includes(query);
        const matchesTags = art.tags?.some(t => t.toLowerCase().includes(query));
        return matchesTitle || matchesMedium || matchesCategory || matchesTags;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0);
      if (sortBy === 'newest') return Number(b.year || 0) - Number(a.year || 0);
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return 0;
    });
  }, [paintings, selectedCategory, statusFilter, sizeFilter, searchQuery, sortBy]);

  if (isAdminOpen) {
    return (
      <>
        <AdminDashboard />
        <ArtworkFormModal />
        <Toast />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f6]">
      {/* Navigation */}
      <Navbar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Hero Showcase */}
      <Hero />

      {/* Main Art Gallery Catalog Section */}
      <section id="gallery" className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        
        {/* REFINED MINIMALIST ARTIST CONTROLS BAR */}
        {isArtistMode && (
          <div className="mb-8 bg-white border border-stone-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center space-x-2.5 text-xs text-stone-600">
              <Brush className="w-3.5 h-3.5 text-stone-900" />
              <span><strong>Studio Edit Mode Active:</strong> Click <em>"+ Add Painting"</em> to upload photos or use the edit/trash icons on cards.</span>
            </div>

            <div className="flex items-center space-x-2 shrink-0 text-xs">
              <button
                onClick={openAddPaintingModal}
                className="bg-stone-900 hover:bg-black text-white px-3.5 py-1.5 rounded-full font-medium transition flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Painting</span>
              </button>

              <button
                onClick={() => {
                  if (window.confirm("Remove all demo sample paintings? This gives you an empty clean store to showcase only your own artwork.")) {
                    clearAllPaintings();
                  }
                }}
                className="text-stone-500 hover:text-rose-600 px-3 py-1.5 rounded-full transition border border-stone-200 hover:border-rose-200"
              >
                <span>Clear Demo Art</span>
              </button>

              {paintings.length === 0 && (
                <button
                  onClick={resetToSamplePaintings}
                  className="text-stone-600 hover:text-stone-900 px-2.5 py-1.5 rounded-full border border-stone-200 flex items-center space-x-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Restore Samples</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Gallery Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-stone-200/60 pb-5">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-stone-400 font-medium block mb-1">
              Curated Catalog
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal">
              Original Fine Artworks
            </h2>
          </div>

          <div className="text-xs text-stone-500 font-mono">
            {filteredPaintings.length} {filteredPaintings.length === 1 ? 'artwork' : 'artworks'}
          </div>
        </div>

        {/* Minimalist Underline Categories Bar */}
        <div className="flex items-center gap-6 overflow-x-auto pb-2 mb-8 scrollbar-none border-b border-stone-200/50 text-xs uppercase tracking-[0.15em]">
          {ART_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`pb-2 transition-all whitespace-nowrap font-medium ${
                selectedCategory === cat
                  ? 'text-stone-900 border-b-2 border-stone-900'
                  : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filter Controls Row */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4 text-xs">
          
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-stone-400 uppercase tracking-widest text-[10px]">Filter:</span>

            {/* Availability */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-stone-200 rounded-full px-3 py-1.5 text-stone-700 text-xs focus:outline-none focus:border-stone-400 cursor-pointer"
            >
              <option value="all">All Artworks</option>
              <option value="available">Available in Studio</option>
              <option value="sold">Sold Archive</option>
            </select>

            {/* Size */}
            <select
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value)}
              className="bg-white border border-stone-200 rounded-full px-3 py-1.5 text-stone-700 text-xs focus:outline-none focus:border-stone-400 cursor-pointer"
            >
              <option value="all">All Dimensions</option>
              <option value="Small">Small (&lt; 12")</option>
              <option value="Medium">Medium (12" - 24")</option>
              <option value="Large">Large (24"+)</option>
            </select>

            {searchQuery && (
              <span className="inline-flex items-center space-x-1.5 bg-stone-100 text-stone-800 px-3 py-1 rounded-full text-xs">
                <span>"{searchQuery}"</span>
                <button onClick={() => setSearchQuery('')} className="hover:text-black">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>

          {/* Sort */}
          <div className="flex items-center space-x-2">
            <span className="text-stone-400 uppercase tracking-widest text-[10px]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-stone-200 rounded-full px-3 py-1.5 text-stone-700 text-xs focus:outline-none focus:border-stone-400 cursor-pointer"
            >
              <option value="featured">Featured Curations</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest Additions</option>
            </select>
          </div>

        </div>

        {/* Artwork Grid */}
        {filteredPaintings.length === 0 ? (
          <div className="bg-white rounded-2xl p-14 text-center border border-stone-200/70 max-w-md mx-auto space-y-4">
            <h3 className="font-serif text-xl text-stone-900 font-normal">No Paintings Found</h3>
            <p className="text-xs text-stone-500 font-light leading-relaxed">
              {paintings.length === 0 
                ? "Your gallery is ready for your own paintings. Click below to upload your art!" 
                : "No paintings match your current filters. Try resetting or requesting a custom order."}
            </p>
            <div className="flex justify-center gap-2.5 pt-2">
              <button
                onClick={openAddPaintingModal}
                className="px-5 py-2.5 bg-stone-900 hover:bg-black text-white text-xs rounded-full font-medium transition"
              >
                + Add Your Painting
              </button>
              {paintings.length === 0 && (
                <button
                  onClick={resetToSamplePaintings}
                  className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs rounded-full transition"
                >
                  Restore Sample Art
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
            {filteredPaintings.map((art) => (
              <ProductCard key={art.id} artwork={art} />
            ))}
          </div>
        )}

        {/* Quiet Minimalist Bespoke Banner */}
        <div className="mt-20 bg-stone-100/70 rounded-2xl p-8 sm:p-12 border border-stone-200/80 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1.5 max-w-lg">
            <span className="text-[10px] uppercase tracking-[0.25em] text-stone-500 font-medium">
              Bespoke Commission
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal">
              Need a Custom Warli Motif or Landscape?
            </h3>
            <p className="text-xs text-stone-600 font-light leading-relaxed">
              Have a specific canvas size or color palette in mind? Akshatha works 1-on-1 with you to create tailored original artworks for your living space.
            </p>
          </div>

          <button
            onClick={() => setIsCommissionOpen(true)}
            className="bg-stone-900 hover:bg-black text-white text-xs uppercase tracking-[0.15em] font-medium px-6 py-3.5 rounded-full transition shrink-0"
          >
            Commission a Piece
          </button>
        </div>

      </section>

      {/* Artist Story & Studio Section */}
      <ArtistStory />

      {/* Care & FAQ */}
      <ArtCareFAQ />

      {/* Studio Footer */}
      <Footer />

      {/* Global Interactive Modals & Drawers */}
      <ArtworkFormModal />
      <ProductModal />
      <RoomVisualizerModal />
      <CertificateModal />
      <CommissionModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderSuccessModal />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <GalleryApp />
    </ShopProvider>
  );
}
