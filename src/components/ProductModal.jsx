import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { FRAMING_OPTIONS } from '../data/paintings';
import { 
  X, 
  Heart, 
  Eye, 
  ShoppingBag, 
  Award, 
  ShieldCheck, 
  Truck, 
  Layers, 
  MessageCircle,
  CheckCircle2,
  Maximize2
} from 'lucide-react';

export const ProductModal = () => {
  const { 
    selectedArtwork, 
    setSelectedArtwork, 
    addToCart, 
    wishlist, 
    toggleWishlist, 
    openRoomVisualizer, 
    openCertificate,
    artistSettings
  } = useShop();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedFrameId, setSelectedFrameId] = useState('none');
  const [isZoomed, setIsZoomed] = useState(false);

  if (!selectedArtwork) return null;

  const isFavorited = wishlist.includes(selectedArtwork.id);
  const isAvailable = selectedArtwork.status === 'available';

  const chosenFrame = FRAMING_OPTIONS.find(f => f.id === selectedFrameId) || FRAMING_OPTIONS[0];
  const totalPrice = selectedArtwork.price + chosenFrame.price;

  const handleWhatsAppInquiry = () => {
    const cleanNumber = artistSettings.whatsappNumber.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hello Akshatha! I am viewing your original artwork "${selectedArtwork.title}".\n• Price: ${artistSettings.currency}${totalPrice.toLocaleString()} (Frame: ${chosenFrame.name})\n• Dimensions: ${selectedArtwork.dimensions}\nCan you share more details / shipping timeline for this piece?`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      {/* Modal Dialog Card */}
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-xl border border-stone-200 relative my-6 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Close & Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-[#faf9f6]">
          <div className="flex items-center space-x-2 text-[10px] uppercase tracking-[0.2em] text-stone-500">
            <span>Original Art Studio</span>
            <span>•</span>
            <span className="text-stone-800 font-medium">1 of 1 Edition</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => toggleWishlist(selectedArtwork.id)}
              className={`p-1.5 rounded-full border transition ${
                isFavorited 
                  ? 'border-stone-800 bg-stone-900 text-white' 
                  : 'border-stone-200 text-stone-600 hover:text-stone-900'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={() => setSelectedArtwork(null)}
              className="p-1.5 rounded-full border border-stone-200 text-stone-600 hover:text-stone-900 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Visuals */}
          <div className="lg:col-span-7 space-y-3.5">
            
            {/* Main Stage Image */}
            <div className="relative aspect-[4/5] bg-stone-100 rounded-xl overflow-hidden border border-stone-200 shadow-inner group">
              <img
                src={(selectedArtwork.images && selectedArtwork.images[activeImageIndex]) || selectedArtwork.images?.[0] || selectedArtwork.image || ''}
                alt={selectedArtwork.title}
                className={`w-full h-full object-cover transition-transform duration-500 cursor-zoom-in ${
                  isZoomed ? 'scale-150' : 'scale-100'
                }`}
                onClick={() => setIsZoomed(!isZoomed)}
              />

              {/* Zoom hint badge */}
              <button 
                onClick={() => setIsZoomed(!isZoomed)}
                className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-stone-800 text-[10px] px-2.5 py-1 rounded-full border border-stone-200 flex items-center space-x-1"
              >
                <Maximize2 className="w-3 h-3 text-stone-600" />
                <span>{isZoomed ? 'Reset' : 'Zoom Brushwork'}</span>
              </button>
            </div>

            {/* Thumbnail switcher if multiple images */}
            {selectedArtwork.images?.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {selectedArtwork.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setActiveImageIndex(idx); setIsZoomed(false); }}
                    className={`relative w-16 h-18 rounded-lg overflow-hidden border transition shrink-0 ${
                      activeImageIndex === idx ? 'border-stone-900 ring-1 ring-stone-900' : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Interactive Feature Shortcuts */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={() => openRoomVisualizer(selectedArtwork)}
                className="p-2.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl flex items-center justify-center space-x-2 text-stone-800 text-xs font-normal transition"
              >
                <Eye className="w-3.5 h-3.5 text-stone-600" />
                <span>Hang in Your Room (AR)</span>
              </button>

              <button
                onClick={() => openCertificate(selectedArtwork)}
                className="p-2.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl flex items-center justify-center space-x-2 text-stone-800 text-xs font-normal transition"
              >
                <Award className="w-3.5 h-3.5 text-stone-600" />
                <span>Certificate of Provenance</span>
              </button>
            </div>

          </div>

          {/* Right Column: Narrative, Framing & Purchasing */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-medium block">
                  {selectedArtwork.category}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal mt-0.5">
                  {selectedArtwork.title}
                </h2>
                <p className="text-xs text-stone-600 mt-1 font-light">
                  {selectedArtwork.medium}
                </p>
                <p className="text-xs text-stone-500 mt-0.5 font-light">
                  Dimensions: <strong>{selectedArtwork.dimensions}</strong>
                </p>
              </div>

              {/* Price display */}
              <div className="bg-[#faf9f6] border border-stone-200 rounded-xl p-4 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-stone-400 block mb-0.5">Studio Price</span>
                  <div className="flex items-baseline space-x-2 font-mono">
                    <span className="text-2xl font-semibold text-stone-900">
                      {artistSettings.currency}{totalPrice.toLocaleString()}
                    </span>
                    {selectedArtwork.originalPrice > selectedArtwork.price && (
                      <span className="text-xs text-stone-400 line-through">
                        {artistSettings.currency}{(selectedArtwork.originalPrice + chosenFrame.price).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-stone-600 bg-white px-2.5 py-1 rounded-full border border-stone-200">
                    Complimentary Shipping
                  </span>
                </div>
              </div>

              {/* Story behind the piece */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-medium block">
                  Artist's Note
                </span>
                <p className="text-xs text-stone-600 leading-relaxed font-light italic bg-stone-50/70 p-3 rounded-xl border border-stone-200/50">
                  "{selectedArtwork.story || selectedArtwork.description}"
                </p>
              </div>

              {/* Framing Selection */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-medium block">
                  Framing Selection
                </label>

                <div className="space-y-1.5">
                  {FRAMING_OPTIONS.map((frame) => (
                    <label
                      key={frame.id}
                      className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer text-xs transition ${
                        selectedFrameId === frame.id
                          ? 'border-stone-900 bg-stone-50 font-medium text-stone-900'
                          : 'border-stone-200 hover:bg-stone-50/50 text-stone-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="framing"
                          value={frame.id}
                          checked={selectedFrameId === frame.id}
                          onChange={() => setSelectedFrameId(frame.id)}
                          className="accent-stone-900 w-3.5 h-3.5"
                        />
                        <span>{frame.name}</span>
                      </div>
                      <span className="font-mono text-stone-900">
                        {frame.price === 0 ? 'Included' : `+${artistSettings.currency}${frame.price}`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Checklist */}
              <div className="pt-2 border-t border-stone-100 grid grid-cols-2 gap-2 text-[11px] text-stone-500 font-light">
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-stone-700 shrink-0" />
                  <span>UV Varnish Sealed</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-stone-700 shrink-0" />
                  <span>Pre-installed Hanger</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Award className="w-3.5 h-3.5 text-stone-700 shrink-0" />
                  <span>Signed Certificate</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Truck className="w-3.5 h-3.5 text-stone-700 shrink-0" />
                  <span>Safe Bubble Wrap Box</span>
                </div>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-stone-200">
              {isAvailable ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    onClick={() => {
                      addToCart(selectedArtwork, selectedFrameId);
                      setSelectedArtwork(null);
                    }}
                    className="w-full bg-stone-900 hover:bg-black text-white py-3.5 px-4 rounded-full font-medium text-xs uppercase tracking-[0.15em] transition shadow-sm flex items-center justify-center space-x-2"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Bag</span>
                  </button>

                  <button
                    onClick={handleWhatsAppInquiry}
                    className="w-full bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 py-3.5 px-4 rounded-full font-medium text-xs uppercase tracking-[0.15em] transition flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Inquire via WhatsApp</span>
                  </button>
                </div>
              ) : (
                <div className="p-3 bg-stone-100 rounded-xl text-center text-xs text-stone-500 font-light">
                  This original artwork has found its home. You can request a similar bespoke commission piece!
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
