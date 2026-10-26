import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  X, 
  Palette, 
  Sparkles, 
  Calculator, 
  Send, 
  MessageCircle, 
  CheckCircle,
  HelpCircle,
  Clock,
  ShieldCheck
} from 'lucide-react';

const COMMISSION_STYLES = [
  { id: "warli-traditional", name: "Traditional Warli Folk Art (Canvas / Board)", baseRate: 3.2 },
  { id: "warli-fusion", name: "Warli Folk Fusion & Terracotta Study", baseRate: 3.6 },
  { id: "oil-landscape", name: "Original Oil Landscape & Sunset Study", baseRate: 4.8 },
  { id: "oil-floral", name: "Oil Floral / Botanical Still Life", baseRate: 4.2 },
  { id: "mini-easel", name: "Desk Miniature with Wooden Easel", baseRate: 2.8 }
];

const CANVAS_SIZES = [
  { label: "8 x 10 in (Desk / Nook)", width: 8, height: 10 },
  { label: "12 x 16 in (Most Popular)", width: 12, height: 16 },
  { label: "16 x 20 in (Wall Canvas)", width: 16, height: 20 },
  { label: "20 x 24 in (Statement Piece)", width: 20, height: 24 },
  { label: "Custom Dimensions", width: 14, height: 18, isCustom: true }
];

export const CommissionModal = () => {
  const { isCommissionOpen, setIsCommissionOpen, submitCommission, artistSettings } = useShop();

  const [style, setStyle] = useState(COMMISSION_STYLES[0].name);
  const [selectedSize, setSelectedSize] = useState(CANVAS_SIZES[1]);
  const [customWidth, setCustomWidth] = useState(12);
  const [customHeight, setCustomHeight] = useState(16);
  const [colorPalette, setColorPalette] = useState('Terracotta Red, White Rice Ink, Ochre & Warm Neutrals');
  const [deadline, setDeadline] = useState('2-3 Weeks (Studio timeline)');
  const [notes, setNotes] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');

  if (!isCommissionOpen) return null;

  // Calculate live estimate
  const effectiveWidth = selectedSize.isCustom ? customWidth : selectedSize.width;
  const effectiveHeight = selectedSize.isCustom ? customHeight : selectedSize.height;
  const sqInches = effectiveWidth * effectiveHeight;
  
  const currentStyleObj = COMMISSION_STYLES.find(s => s.name === style) || COMMISSION_STYLES[0];
  const calculatedEstimate = Math.round((sqInches * currentStyleObj.baseRate) / 50) * 50;
  const estimateMin = Math.max(950, Math.round(calculatedEstimate * 0.95));
  const estimateMax = Math.round(calculatedEstimate * 1.15);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!clientName || !clientPhone) {
      alert('Please fill in your name and phone number so Akshatha can reach out!');
      return;
    }

    const payload = {
      name: clientName,
      email: clientEmail,
      phone: clientPhone,
      style,
      dimensions: `${effectiveWidth} x ${effectiveHeight} inches`,
      colorPalette,
      budget: `${artistSettings.currency}${estimateMin.toLocaleString()} - ${artistSettings.currency}${estimateMax.toLocaleString()}`,
      deadline,
      notes
    };

    submitCommission(payload);
  };

  const handleWhatsAppInquiry = () => {
    const cleanNumber = artistSettings.whatsappNumber.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hello Akshatha! I would like to inquire about a custom commission artwork:\n• Name: ${clientName || 'Art Lover'}\n• Medium: ${style}\n• Size: ${effectiveWidth}x${effectiveHeight} inches\n• Palette: ${colorPalette}\n• Estimate: ${artistSettings.currency}${estimateMin.toLocaleString()} - ${artistSettings.currency}${estimateMax.toLocaleString()}\n• Notes: ${notes || 'Looking forward to hearing from you!'}`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div 
        className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-stone-200 relative my-6 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-stone-200 bg-[#faf9f6]">
          <div className="flex items-center space-x-3">
            <Palette className="w-5 h-5 text-stone-700" />
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-light text-stone-900 tracking-tight">
                Commission a Custom Painting
              </h3>
              <p className="text-[11px] text-stone-500 tracking-wide uppercase mt-0.5">
                Handcrafted for your home by Akshatha Gopalkar
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCommissionOpen(false)}
            className="w-8 h-8 rounded-full border border-stone-200 hover:border-stone-900 flex items-center justify-center text-stone-400 hover:text-stone-900 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[80vh]">
          
          {/* Step 1: Artwork Style */}
          <div className="space-y-2">
            <label className="text-[11px] font-medium uppercase tracking-wider text-stone-500 block">
              1. Choose Medium / Art Form
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {COMMISSION_STYLES.map((s) => (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => setStyle(s.name)}
                  className={`p-3 rounded-xl border text-left text-xs transition ${
                    style === s.name 
                      ? 'border-stone-900 bg-stone-50 font-medium text-stone-900 ring-1 ring-stone-900' 
                      : 'border-stone-200 hover:border-stone-300 text-stone-700'
                  }`}
                >
                  <p>{s.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Dimensions & Live Calculator */}
          <div className="space-y-3">
            <label className="text-[11px] font-medium uppercase tracking-wider text-stone-500 flex items-center justify-between">
              <span>2. Dimensions</span>
              <span className="text-stone-400 font-normal">Stretched Canvas or Wood Board</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CANVAS_SIZES.map((sz, idx) => (
                <label
                  key={idx}
                  className={`flex items-center space-x-2.5 p-3 rounded-xl border cursor-pointer text-xs transition ${
                    selectedSize.label === sz.label 
                      ? 'border-stone-900 bg-stone-50 font-medium text-stone-900' 
                      : 'border-stone-200 hover:border-stone-300 text-stone-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="canvas-size"
                    checked={selectedSize.label === sz.label}
                    onChange={() => setSelectedSize(sz)}
                    className="accent-stone-900"
                  />
                  <span>{sz.label}</span>
                </label>
              ))}
            </div>

            {selectedSize.isCustom && (
              <div className="flex gap-4 p-3 bg-stone-50 rounded-xl border border-stone-200">
                <div className="flex-1">
                  <label className="text-[11px] text-stone-500 block mb-1">Width (inches)</label>
                  <input
                    type="number"
                    min="6"
                    max="60"
                    value={customWidth}
                    onChange={(e) => setCustomWidth(Number(e.target.value))}
                    className="w-full bg-white border border-stone-200 rounded-lg p-2 text-xs focus:outline-none focus:border-stone-900"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[11px] text-stone-500 block mb-1">Height (inches)</label>
                  <input
                    type="number"
                    min="6"
                    max="60"
                    value={customHeight}
                    onChange={(e) => setCustomHeight(Number(e.target.value))}
                    className="w-full bg-white border border-stone-200 rounded-lg p-2 text-xs focus:outline-none focus:border-stone-900"
                  />
                </div>
              </div>
            )}

            {/* Price Estimate Banner */}
            <div className="p-4 bg-stone-900 text-white rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-stone-800 flex items-center justify-center text-stone-300 shrink-0">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-stone-400">
                    Estimated Studio Price
                  </p>
                  <p className="text-lg font-serif font-light text-white tracking-wide">
                    {artistSettings.currency}{estimateMin.toLocaleString()} – {artistSettings.currency}{estimateMax.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="text-right text-[11px] text-stone-400 hidden sm:block">
                <span>Includes archival canvas,</span><br />
                <span>UV varnish & safe bubble-wrap packaging</span>
              </div>
            </div>
          </div>

          {/* Step 3: Color Palette & Room Inspiration */}
          <div className="space-y-2">
            <label className="text-[11px] font-medium uppercase tracking-wider text-stone-500 block">
              3. Color Palette & Room Inspiration
            </label>
            <input
              type="text"
              value={colorPalette}
              onChange={(e) => setColorPalette(e.target.value)}
              placeholder="e.g. Earthy red, ivory, ochre tones, or soft sage green"
              className="w-full border border-stone-200 rounded-lg p-3 text-xs focus:outline-none focus:border-stone-900 bg-stone-50/40 transition"
            />
          </div>

          {/* Step 4: Notes & Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider text-stone-500 block mb-1">
                Preferred Timeline
              </label>
              <select
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full border border-stone-200 rounded-lg p-2.5 text-xs bg-stone-50/40 focus:outline-none focus:border-stone-900 transition"
              >
                <option value="2-3 Weeks (Standard studio schedule)">2-3 Weeks (Standard Studio Timeline)</option>
                <option value="1-2 Weeks (Express Request)">1-2 Weeks (Priority Express Request)</option>
                <option value="Flexible / Within 1-2 Months">Flexible (Within 1-2 Months)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider text-stone-500 block mb-1">
                Notes for Akshatha
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Specific motifs, wall placement, gift notes..."
                className="w-full border border-stone-200 rounded-lg p-2.5 text-xs bg-stone-50/40 focus:outline-none focus:border-stone-900 transition"
              />
            </div>
          </div>

          {/* Step 5: Contact Information */}
          <div className="pt-2 border-t border-stone-200 space-y-3">
            <span className="text-[11px] font-medium uppercase tracking-wider text-stone-500 block">
              5. Your Contact Details
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <input
                  type="text"
                  required
                  placeholder="Your Name *"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full border border-stone-200 rounded-lg p-2.5 text-xs bg-stone-50/40 focus:outline-none focus:border-stone-900 transition"
                />
              </div>

              <div>
                <input
                  type="tel"
                  required
                  placeholder="Phone / WhatsApp Number *"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full border border-stone-200 rounded-lg p-2.5 text-xs bg-stone-50/40 focus:outline-none focus:border-stone-900 transition"
                />
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full border border-stone-200 rounded-lg p-2.5 text-xs bg-stone-50/40 focus:outline-none focus:border-stone-900 transition"
                />
              </div>
            </div>
          </div>

          {/* Guarantee proof */}
          <div className="bg-[#faf9f6] border border-stone-200 rounded-xl p-3.5 text-xs text-stone-700 flex items-center space-x-3">
            <ShieldCheck className="w-5 h-5 text-stone-600 shrink-0" />
            <span className="text-[11px] text-stone-600 leading-relaxed">
              <strong>Direct Collaboration:</strong> Akshatha shares progress photos at pencil sketch, first color block, and final varnish stages so you approve every step before packaging.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              className="flex-1 bg-stone-900 hover:bg-stone-800 text-white py-3.5 px-6 rounded-full font-medium text-xs uppercase tracking-wider transition flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4 text-stone-300" />
              <span>Submit Inquiry</span>
            </button>

            <button
              type="button"
              onClick={handleWhatsAppInquiry}
              className="sm:w-auto bg-stone-100 hover:bg-stone-200 text-stone-900 border border-stone-200 py-3.5 px-5 rounded-full font-medium text-xs uppercase tracking-wider transition flex items-center justify-center space-x-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-700" />
              <span>Inquire on WhatsApp</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
