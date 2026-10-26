import React from 'react';
import { useShop } from '../context/ShopContext';
import { 
  Heart, 
  Eye, 
  ShoppingBag, 
  MessageCircle,
  Edit2,
  Trash2
} from 'lucide-react';

export const ProductCard = ({ artwork }) => {
  const { 
    wishlist, 
    toggleWishlist, 
    setSelectedArtwork, 
    openRoomVisualizer, 
    addToCart,
    artistSettings,
    isArtistMode,
    openEditPaintingModal,
    deletePainting
  } = useShop();

  const isFavorited = wishlist.includes(artwork.id);
  const isAvailable = artwork.status === 'available';

  const handleWhatsAppInquiry = (e) => {
    e.stopPropagation();
    const cleanNumber = artistSettings.whatsappNumber.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hello Akshatha! I am interested in your original artwork "${artwork.title}" (${artistSettings.currency}${artwork.price.toLocaleString()}, ${artwork.dimensions}). Is this piece available?`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Remove "${artwork.title}" from your store?`)) {
      deletePainting(artwork.id);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    openEditPaintingModal(artwork);
  };

  return (
    <div 
      onClick={() => setSelectedArtwork(artwork)}
      className="group bg-white rounded-2xl overflow-hidden border border-stone-200/70 hover:border-stone-400/80 transition-all duration-300 flex flex-col cursor-pointer relative"
    >
      {/* Artwork Canvas Stage */}
      <div className="relative aspect-[4/5] bg-stone-100 overflow-hidden">
        <img
          src={artwork.images?.[0] || artwork.image}
          alt={artwork.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          loading="lazy"
        />

        {/* Minimal Category & Status Badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          <span className="bg-white/90 backdrop-blur-md text-stone-800 text-[10px] font-medium px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-stone-200/50">
            {artwork.category}
          </span>
          {artwork.status === 'sold' && (
            <span className="bg-stone-900/90 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Sold
            </span>
          )}
        </div>

        {/* Top Right Action Tools */}
        <div className="absolute top-3 right-3 flex items-center space-x-1.5 z-20">
          {/* Subtle Artist Editing Controls */}
          {isArtistMode && (
            <div className="flex items-center space-x-1 bg-white/95 backdrop-blur-md p-1 rounded-full shadow-sm border border-stone-200">
              <button
                onClick={handleEdit}
                className="p-1 text-stone-500 hover:text-stone-900 transition rounded-full hover:bg-stone-100"
                title="Edit details"
              >
                <Edit2 className="w-3 h-3 stroke-[1.5]" />
              </button>
              <button
                onClick={handleDelete}
                className="p-1 text-stone-500 hover:text-rose-600 transition rounded-full hover:bg-stone-100"
                title="Remove painting"
              >
                <Trash2 className="w-3 h-3 stroke-[1.5]" />
              </button>
            </div>
          )}

          {/* Wishlist */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(artwork.id);
            }}
            className={`p-1.5 rounded-full backdrop-blur-md transition shadow-sm ${
              isFavorited 
                ? 'bg-white text-stone-900 fill-stone-900' 
                : 'bg-white/80 text-stone-500 hover:text-stone-900 hover:bg-white'
            }`}
            title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-3.5 h-3.5 stroke-[1.5] ${isFavorited ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Subtle Hover Action Pill */}
        <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openRoomVisualizer(artwork);
            }}
            className="bg-white/95 text-stone-900 hover:bg-white px-3.5 py-1.5 rounded-full text-[11px] font-medium tracking-wide shadow-md flex items-center space-x-1.5 transition"
          >
            <Eye className="w-3 h-3 text-stone-600" />
            <span>View in Room</span>
          </button>
        </div>
      </div>

      {/* Gallery Label Metadata */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <span className="text-[10px] text-stone-400 uppercase tracking-widest font-normal block mb-0.5">
            {artwork.dimensions?.split('(')[0]?.trim() || artwork.dimensions}
          </span>

          <h3 className="font-serif text-base font-medium text-stone-900 group-hover:text-stone-700 transition-colors line-clamp-1">
            {artwork.title}
          </h3>

          <p className="text-xs text-stone-500 mt-0.5 line-clamp-1 font-light">
            {artwork.medium}
          </p>
        </div>

        {/* Price & Purchase Actions */}
        <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-baseline space-x-1.5 font-mono">
            <span className="text-sm font-semibold text-stone-900">
              {artistSettings.currency}{artwork.price?.toLocaleString()}
            </span>
            {artwork.originalPrice > artwork.price && (
              <span className="text-[11px] text-stone-400 line-through">
                {artistSettings.currency}{artwork.originalPrice?.toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1">
            {/* Direct WhatsApp Chat */}
            <button
              onClick={handleWhatsAppInquiry}
              className="p-1.5 rounded-full text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition"
              title="Message Akshatha on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 stroke-[1.5]" />
            </button>

            {/* Collect */}
            {isAvailable ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(artwork, 'none');
                }}
                className="bg-stone-900 hover:bg-black text-white px-3 py-1.5 rounded-full text-[11px] font-normal tracking-wide transition flex items-center space-x-1"
              >
                <ShoppingBag className="w-3 h-3" />
                <span>Collect</span>
              </button>
            ) : (
              <span className="text-[11px] text-stone-400 font-medium px-2 py-1">
                Archived
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
