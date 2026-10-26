import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  Send, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Settings
} from 'lucide-react';

export const Footer = () => {
  const { artistSettings, setIsAdminOpen, showToast } = useShop();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    showToast('✨ Thank you for subscribing! You will receive early previews of new studio releases.', 'success');
    setEmail('');
  };

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Minimalist Newsletter Box */}
        <div className="border border-stone-800 rounded-2xl p-8 sm:p-10 mb-16 text-center max-w-xl mx-auto space-y-3.5">
          <span className="text-[10px] uppercase tracking-[0.25em] text-stone-400 font-light block">
            Studio Newsletter
          </span>
          <h3 className="font-serif text-2xl text-white font-normal">
            Early Previews of New Artwork Drops
          </h3>
          <p className="text-xs text-stone-400 font-light max-w-sm mx-auto leading-relaxed">
            As a solo creator, originals are 1 of 1 and release in small batches. Subscribe for early access before pieces are released publicly.
          </p>

          <form onSubmit={handleSubscribe} className="flex gap-2 pt-2 max-w-sm mx-auto">
            <input
              type="email"
              required
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-stone-800/80 border border-stone-700 rounded-full px-4 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-stone-500"
            />
            <button
              type="submit"
              className="bg-white hover:bg-stone-100 text-stone-900 px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-medium transition"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Links & Studio Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-stone-800/80 text-xs font-light">
          
          {/* Brand Col */}
          <div className="space-y-3">
            <span className="font-serif text-xl font-normal text-white tracking-tight block">
              Akshatha Gopalkar
            </span>
            <p className="text-stone-400 leading-relaxed">
              An independent solo art studio specializing in handcrafted Warli folk art and original oil paintings, offered at honest, accessible studio pricing.
            </p>
            <div className="flex items-center space-x-1.5 text-stone-400 pt-1 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-stone-300" />
              <span>Certified 100% Original Fine Art</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-medium text-stone-400">Art Forms</h4>
            <ul className="space-y-2 text-stone-400">
              <li><a href="#gallery" className="hover:text-white transition">Traditional Warli Folk Art</a></li>
              <li><a href="#gallery" className="hover:text-white transition">Original Oil Paintings</a></li>
              <li><a href="#gallery" className="hover:text-white transition">Warli Folk Fusion</a></li>
              <li><a href="#gallery" className="hover:text-white transition">Desk Miniatures with Easel</a></li>
            </ul>
          </div>

          {/* Studio & Care */}
          <div className="space-y-2.5">
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-medium text-stone-400">Studio & Care</h4>
            <ul className="space-y-2 text-stone-400">
              <li><a href="#story" className="hover:text-white transition">About Akshatha</a></li>
              <li><a href="#care" className="hover:text-white transition">Art Care & Cleaning</a></li>
              <li><a href="#care" className="hover:text-white transition">Safe Protective Packaging</a></li>
              <li><a href="#care" className="hover:text-white transition">Certificate of Provenance</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-2.5">
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-medium text-stone-400">Studio Inquiries</h4>
            <div className="space-y-2 text-stone-400">
              <p className="flex items-start space-x-2">
                <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
                <span>{artistSettings.location}</span>
              </p>
              <p className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                <span>{artistSettings.email}</span>
              </p>
              <p className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                <span>{artistSettings.whatsappDisplay}</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Admin Toggle */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Art by Akshatha (Akshatha Gopalkar). All Rights Reserved.</p>
          
          <div className="flex items-center space-x-4">
            <a 
              href="/privacy.html" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-stone-400 hover:text-white transition"
            >
              Privacy Policy
            </a>
            <span className="text-stone-700">•</span>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="text-stone-400 hover:text-white transition flex items-center space-x-1"
            >
              <Settings className="w-3 h-3" />
              <span>Studio Owner Portal</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
