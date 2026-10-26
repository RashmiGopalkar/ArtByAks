import React from 'react';
import { useShop } from '../context/ShopContext';
import { 
  ArrowRight, 
  Eye, 
  Plus
} from 'lucide-react';

export const Hero = () => {
  const { 
    setIsCommissionOpen, 
    openRoomVisualizer, 
    paintings, 
    openAddPaintingModal,
    artistSettings
  } = useShop();

  const featuredPainting = paintings.find(p => p.isFeatured && p.status === 'available') || paintings[0];

  return (
    <section className="relative overflow-hidden bg-[#faf9f6] pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Editorial Narrative */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
            
            <div className="inline-block">
              <span className="text-[10px] uppercase tracking-[0.25em] text-stone-500 font-medium">
                Solo Fine Art Studio • Pan-India
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-stone-900 font-normal tracking-tight leading-[1.12]">
              Handmade Warli Folk Art & <br className="hidden sm:inline" />
              <span className="italic font-light text-stone-600">Original Oil Paintings</span>
            </h1>

            <p className="text-stone-600 text-sm sm:text-base max-w-lg mx-auto lg:mx-0 leading-relaxed font-normal">
              Every canvas is individually created by Akshatha Gopalkar. Intimate, thoughtful art rooted in tribal Indian geometry and soothing nature studies—offered at honest, accessible studio pricing from ₹950.
            </p>

            {/* Refined Minimalist Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <a
                href="#gallery"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-stone-900 hover:bg-black text-stone-100 px-7 py-3.5 rounded-full text-xs uppercase tracking-[0.15em] font-medium transition-all shadow-sm"
              >
                <span>Browse Gallery</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => setIsCommissionOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 px-6 py-3.5 rounded-full text-xs uppercase tracking-[0.15em] font-medium transition-all"
              >
                <span>Bespoke Order</span>
              </button>

              <button
                onClick={openAddPaintingModal}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 text-stone-500 hover:text-stone-900 px-4 py-3.5 text-xs uppercase tracking-[0.15em] font-medium transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload Art</span>
              </button>
            </div>

            {/* Subtle Gallery Commitments */}
            <div className="pt-8 border-t border-stone-200/60 flex flex-wrap items-center justify-center lg:justify-start gap-8 text-[11px] text-stone-500 uppercase tracking-wider">
              <span>Original 1 of 1</span>
              <span className="w-1 h-1 rounded-full bg-stone-300"></span>
              <span>Hand-Signed Provenance</span>
              <span className="w-1 h-1 rounded-full bg-stone-300"></span>
              <span>Secure Pan-India Shipping</span>
            </div>

          </div>

          {/* Right: Framed Masterpiece Presentation */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm lg:max-w-none">
              
              {featuredPainting ? (
                <div className="p-3 bg-white rounded-2xl shadow-xl border border-stone-200/80 group">
                  <div className="relative overflow-hidden rounded-xl bg-stone-100 aspect-[4/5]">
                    <img
                      src={featuredPainting.images?.[0] || featuredPainting.image}
                      alt={featuredPainting.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Minimalist Floating Card */}
                    <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-stone-200/60 flex items-center justify-between shadow-sm">
                      <div className="min-w-0 pr-2">
                        <span className="text-[9px] uppercase tracking-widest text-stone-400 font-semibold block truncate">
                          {featuredPainting.category}
                        </span>
                        <h3 className="font-serif text-base text-stone-900 font-medium truncate">
                          {featuredPainting.title}
                        </h3>
                        <p className="text-xs text-stone-700 font-medium font-mono">
                          {artistSettings.currency}{featuredPainting.price?.toLocaleString()}
                        </p>
                      </div>

                      <button
                        onClick={() => openRoomVisualizer(featuredPainting)}
                        className="p-2.5 rounded-full bg-stone-900 hover:bg-black text-white shrink-0 transition"
                        title="View in your room"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
