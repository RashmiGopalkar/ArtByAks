import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: "How are delicate original artworks packaged for safe transit?",
    a: "We take immense personal care in our packaging. Each painting is first wrapped in protective acid-free glassine paper, enveloped in thick shock-absorbent bubble wrap, reinforced with sturdy corner protectors, and securely boxed in a heavy-duty corrugated cardboard box to ensure safe delivery across India."
  },
  {
    q: "How do I care for and dust an original textured painting?",
    a: "All paintings are finished with two layers of archival UV-resistant varnish that repels dust and ambient moisture. To clean, simply use a soft, dry natural bristle paintbrush or microfiber cloth to gently flick away dust. Never use water, chemical cleaning sprays, or wet wipes on original canvas."
  },
  {
    q: "Can I request custom canvas dimensions or custom color palettes?",
    a: "Absolutely! Custom commissions represent a major part of our studio work. You can click 'Bespoke Order' to select your ideal dimensions, interior color palette, and framing style. Akshatha works closely with you, providing milestone progress updates before final varnishing."
  },
  {
    q: "Does the painting arrive ready to hang on the wall?",
    a: "Yes! Every single original piece comes with pre-installed hanging hooks and hanging wire on the back, along with complementary wall hanging pins included inside your package. You can unbox and hang it immediately."
  },
  {
    q: "What is your transit damage guarantee and authenticity policy?",
    a: "In the rare event of transit damage, please take unboxing photos and message us within 48 hours for an immediate studio replacement or full refund. Every original artwork also arrives with a hand-signed Certificate of Authenticity."
  }
];

export const ArtCareFAQ = () => {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section id="care" className="py-20 bg-[#faf9f6] border-b border-stone-200/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-2 mb-12">
          <span className="text-[10px] uppercase tracking-[0.25em] text-stone-400 font-medium block">
            Collector Guidance
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal">
            Care, Packaging & FAQs
          </h2>
        </div>

        {/* Minimal Accordion List */}
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div 
                key={idx}
                className="border border-stone-200/80 rounded-xl overflow-hidden bg-white transition-all"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between transition-colors hover:bg-stone-50/50"
                >
                  <span className="font-serif text-base sm:text-lg text-stone-900 font-normal pr-4">
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-stone-800' : ''}`} />
                </button>

                {isOpen && (
                  <div className="p-4 sm:p-5 pt-0 text-stone-600 text-xs sm:text-sm font-light leading-relaxed border-t border-stone-100 animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
