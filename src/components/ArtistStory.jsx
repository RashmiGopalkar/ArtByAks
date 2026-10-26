import React from 'react';
import { useShop } from '../context/ShopContext';

export const ArtistStory = () => {
  const { setIsCommissionOpen } = useShop();

  const studioSteps = [
    {
      step: "01",
      title: "Handmade Preparation",
      desc: "Each piece begins on stretched canvas, fine handmade rag paper, or wooden panels, primed with acid-free gesso for lasting archival stability."
    },
    {
      step: "02",
      title: "Warli & Oil Layering",
      desc: "Intricate folk narratives are drawn freehand with fine brushes and rice-ink white, while oil works are gently glazed and blended wet-on-wet."
    },
    {
      step: "03",
      title: "Protective Clear Varnish",
      desc: "Completed artworks receive two protective coats of UV-resistant varnish to guard against light exposure, humidity, and household dust."
    },
    {
      step: "04",
      title: "Attentive Studio Packaging",
      desc: "Hand-wrapped in archival glassine paper, corner guards, and multi-layered bubble cushion to ensure safe arrival at your home."
    }
  ];

  return (
    <section id="story" className="py-20 lg:py-28 bg-[#faf9f6] border-t border-b border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid: Portrait & Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-24">
          
          {/* Left: Studio Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm lg:max-w-none">
              
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-stone-200/80 bg-stone-100">
                <img
                  src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1000&q=80"
                  alt="Akshatha Gopalkar in Art Studio"
                  className="w-full aspect-[4/5] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent"></div>
              </div>

            </div>
          </div>

          {/* Right: Artist Narrative */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="text-[10px] uppercase tracking-[0.25em] text-stone-400 font-medium block">
              About the Artist
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-stone-900 font-normal leading-[1.18]">
              "Honest, soulful art handcrafted for homes that love tradition and quiet beauty."
            </h2>

            <div className="space-y-4 text-stone-600 text-sm sm:text-base leading-relaxed font-light">
              <p>
                Hello, I am <strong>Akshatha Gopalkar</strong>. As a solo artist stepping out with my first public collection, painting is my quiet meditation and life's creative calling.
              </p>
              <p>
                My work explores two interconnected worlds: the ancient storytelling and geometric tribal harmony of <strong>traditional Indian Warli folk art</strong>, alongside <strong>expressive original oil paintings</strong> capturing landscapes, blossoms, and twilight horizons.
              </p>
              <p className="italic font-serif text-stone-800 text-lg border-l-2 border-stone-300 pl-4 py-1">
                "Because I manage every detail personally, I keep my collection intentionally small and my prices genuinely accessible. I want everyday art lovers and first-time collectors to be able to own authentic handmade art with confidence."
              </p>
            </div>

            {/* Signature & Studio Details */}
            <div className="pt-6 border-t border-stone-200/60 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-signature text-3xl text-stone-900 font-bold">
                  Akshatha Gopalkar
                </p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-light mt-0.5">
                  Independent Artist & Solo Creator
                </p>
              </div>

              <button
                onClick={() => setIsCommissionOpen(true)}
                className="bg-stone-900 hover:bg-black text-white text-xs uppercase tracking-[0.15em] font-medium px-6 py-3 rounded-full transition"
              >
                Request Custom Piece
              </button>
            </div>

          </div>

        </div>

        {/* Studio Craftsmanship Process */}
        <div className="space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-stone-400 font-medium">
              Studio Methodology
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal">
              How Every Original Piece is Crafted
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {studioSteps.map((st) => (
              <div 
                key={st.step}
                className="bg-white rounded-xl p-6 border border-stone-200/70 relative space-y-2.5"
              >
                <span className="font-mono text-xs text-stone-400 font-medium block">
                  {st.step}
                </span>
                <h4 className="font-serif text-base text-stone-900 font-medium">
                  {st.title}
                </h4>
                <p className="text-xs text-stone-500 font-light leading-relaxed">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
