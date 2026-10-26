import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { FRAMING_OPTIONS } from '../data/paintings';
import { 
  X, 
  ShoppingBag, 
  Check, 
  RotateCcw, 
  Layers, 
  Palette, 
  Sparkles,
  Maximize2,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

const ROOM_PRESETS = [
  {
    id: "living-room",
    name: "Living Room",
    furnitureSvg: "sofa",
    desc: "Above a 3-seater modern sofa"
  },
  {
    id: "bedroom",
    name: "Master Bedroom",
    furnitureSvg: "bed",
    desc: "Above upholstered bed headboard"
  },
  {
    id: "office",
    name: "Modern Studio / Office",
    furnitureSvg: "desk",
    desc: "Above minimalist wooden desk"
  },
  {
    id: "dining",
    name: "Dining Credenza",
    furnitureSvg: "credenza",
    desc: "Above teak sideboard"
  }
];

const WALL_COLORS = [
  { name: "Alabaster Linen", hex: "#f3ede3", textDark: true },
  { name: "Nordic Sage", hex: "#d8e2dc", textDark: true },
  { name: "Warm Terracotta", hex: "#d29079", textDark: true },
  { name: "Deep Charcoal Navy", hex: "#232b38", textDark: false },
  { name: "Soft Clay Greige", hex: "#b8ada4", textDark: false },
  { name: "Gallery Off-White", hex: "#fcfbfa", textDark: true }
];

export const RoomVisualizerModal = () => {
  const { 
    isRoomVisualizerOpen, 
    setIsRoomVisualizerOpen, 
    visualizerArtwork, 
    addToCart,
    artistSettings
  } = useShop();

  const [activeRoom, setActiveRoom] = useState(ROOM_PRESETS[0].id);
  const [activeWallColor, setActiveWallColor] = useState(WALL_COLORS[0].hex);
  const [selectedFrameId, setSelectedFrameId] = useState('none');
  const [scaleFactor, setScaleFactor] = useState(1); // 0.8 to 1.3
  const [posY, setPosY] = useState(0); // Offset up or down

  if (!isRoomVisualizerOpen || !visualizerArtwork) return null;

  const chosenFrame = FRAMING_OPTIONS.find(f => f.id === selectedFrameId) || FRAMING_OPTIONS[0];
  const totalPrice = visualizerArtwork.price + chosenFrame.price;

  // Frame styling simulation classes
  const getFrameStyling = () => {
    switch (selectedFrameId) {
      case 'scandi-oak':
        return 'border-[12px] border-[#cbb393] shadow-[0_25px_50px_rgba(0,0,0,0.35)] ring-4 ring-[#8b7355]/30';
      case 'sleek-black':
        return 'border-[12px] border-[#18181b] shadow-[0_25px_50px_rgba(0,0,0,0.45)] ring-4 ring-black/40';
      case 'antique-gold':
        return 'border-[14px] border-[#cbb06d] shadow-[0_25px_50px_rgba(0,0,0,0.35)] ring-4 ring-[#887037]/40';
      default:
        // Raw stretched canvas with subtle 3D edge shadow
        return 'border-[2px] border-stone-300 shadow-[0_20px_40px_rgba(0,0,0,0.3)]';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div 
        className="bg-stone-900 text-stone-100 rounded-3xl max-w-6xl w-full h-[95vh] overflow-hidden shadow-2xl border border-stone-800 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-900/90">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white flex items-center space-x-2">
                <span>View On Your Wall Simulator</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-stone-800 text-amber-400 font-sans font-medium">Interactive Preview</span>
              </h3>
              <p className="text-xs text-stone-400">
                "{visualizerArtwork.title}" • {visualizerArtwork.dimensions}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsRoomVisualizerOpen(false)}
            className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Center Stage: Interactive Wall and Room */}
        <div className="flex-1 relative overflow-hidden flex flex-col justify-end" style={{ backgroundColor: activeWallColor }}>
          
          {/* Wall texture / ambient lighting shadow */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/25 pointer-events-none"></div>

          {/* Scale & Position Reset Control HUD */}
          <div className="absolute top-4 left-4 z-20 bg-stone-900/80 backdrop-blur-md border border-stone-700 p-2 rounded-xl flex items-center space-x-2 text-xs">
            <button
              onClick={() => setScaleFactor(prev => Math.max(0.7, prev - 0.1))}
              className="p-1.5 hover:bg-stone-800 rounded text-stone-300 hover:text-white"
              title="Scale Down"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="font-mono text-amber-300 text-[11px] px-1">{Math.round(scaleFactor * 100)}%</span>
            <button
              onClick={() => setScaleFactor(prev => Math.min(1.4, prev + 0.1))}
              className="p-1.5 hover:bg-stone-800 rounded text-stone-300 hover:text-white"
              title="Scale Up"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setScaleFactor(1); setPosY(0); }}
              className="p-1.5 hover:bg-stone-800 rounded text-stone-400 hover:text-white ml-1 border-l border-stone-700 pl-2"
              title="Reset Position & Scale"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Wall Hanging Painting Element */}
          <div 
            className="absolute left-1/2 -translate-x-1/2 transition-all duration-300 z-10 cursor-grab active:cursor-grabbing"
            style={{ 
              top: `calc(18% + ${posY}px)`,
              transform: `translateX(-50%) scale(${scaleFactor})` 
            }}
          >
            <div className={`relative transition-all duration-300 max-w-[280px] sm:max-w-[360px] md:max-w-[420px] aspect-[4/5] bg-stone-900 rounded-sm overflow-hidden ${getFrameStyling()}`}>
              <img
                src={visualizerArtwork.images?.[0] || visualizerArtwork.image}
                alt={visualizerArtwork.title}
                className="w-full h-full object-cover"
                draggable={false}
              />
              {/* Natural spotlight reflection on canvas */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none"></div>
            </div>

            {/* Subtle hanging cord wire (artistic detail) */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-4 h-6 border-b-2 border-stone-700/60 pointer-events-none"></div>
          </div>

          {/* Floor & Furniture Simulation Overlay */}
          <div className="relative w-full z-20 pointer-events-none flex flex-col items-center">
            
            {/* Realistic stylized furniture vector overlay */}
            {activeRoom === 'living-room' && (
              <div className="w-full max-w-2xl px-4 flex flex-col items-center">
                {/* Modern Sofa Graphic */}
                <div className="w-full h-36 sm:h-48 bg-stone-800/90 border-t-8 border-stone-700/80 rounded-t-3xl shadow-2xl relative flex items-end justify-center pb-2">
                  {/* Sofa cushions */}
                  <div className="w-5/6 h-20 bg-stone-800/95 rounded-t-xl border border-stone-700/50 flex justify-between px-4">
                    <div className="w-12 h-14 bg-amber-900/60 rounded-md -mt-4 border border-amber-700/50 rotate-6 shadow-md"></div>
                    <div className="w-12 h-14 bg-stone-700/70 rounded-md -mt-4 border border-stone-600/50 -rotate-3 shadow-md"></div>
                  </div>
                </div>
              </div>
            )}

            {activeRoom === 'bedroom' && (
              <div className="w-full max-w-2xl px-4 flex flex-col items-center">
                {/* Upholstered Bed Headboard Graphic */}
                <div className="w-full h-32 sm:h-44 bg-[#3d3834] border-t-4 border-[#524c47] rounded-t-2xl shadow-2xl relative flex flex-col justify-end items-center">
                  <div className="w-4/5 h-16 bg-[#e8e4df] rounded-t-xl shadow-inner border border-stone-300 flex justify-center space-x-6 pt-2">
                    <div className="w-20 h-10 bg-white rounded shadow-sm border border-stone-200"></div>
                    <div className="w-20 h-10 bg-white rounded shadow-sm border border-stone-200"></div>
                  </div>
                </div>
              </div>
            )}

            {activeRoom === 'office' && (
              <div className="w-full max-w-2xl px-4 flex flex-col items-center">
                {/* Minimalist Wooden Desk & Laptop Graphic */}
                <div className="w-full h-24 sm:h-32 bg-[#4a3525] border-t-8 border-[#5e432f] rounded-t-lg shadow-2xl relative flex justify-center items-start pt-2">
                  <div className="w-16 h-10 bg-stone-300 rounded-sm shadow-md border border-stone-400 flex items-center justify-center">
                    <div className="w-12 h-7 bg-stone-800 rounded-xs"></div>
                  </div>
                </div>
              </div>
            )}

            {activeRoom === 'dining' && (
              <div className="w-full max-w-2xl px-4 flex flex-col items-center">
                {/* Teak Credenza Graphic */}
                <div className="w-full h-28 sm:h-36 bg-[#2f2218] border-t-6 border-[#3e2e21] rounded-t-lg shadow-2xl relative flex justify-between px-8 pt-3">
                  <div className="w-8 h-14 bg-amber-100/40 rounded-full border border-amber-200/40"></div>
                  <div className="w-6 h-10 bg-stone-700 rounded-md"></div>
                </div>
              </div>
            )}

            {/* Hardwood Flooring */}
            <div className="w-full h-10 sm:h-14 bg-gradient-to-b from-[#291e17] to-[#1a130e] border-t border-black/40"></div>
          </div>

        </div>

        {/* Bottom Control Dock: Wall Colors, Framing, Room Preset, and Add to Bag */}
        <div className="bg-stone-900 border-t border-stone-800 p-4 sm:p-5 flex flex-col md:flex-row gap-5 items-center justify-between">
          
          {/* Left Controls: Room preset & Wall Color */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            
            {/* Room Selector */}
            <div>
              <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block mb-1.5">
                Room Setting
              </span>
              <div className="flex gap-1.5">
                {ROOM_PRESETS.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => setActiveRoom(room.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      activeRoom === room.id 
                        ? 'bg-amber-600 text-white font-semibold shadow' 
                        : 'bg-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {room.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Wall Paint Swatches */}
            <div>
              <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block mb-1.5">
                Wall Color
              </span>
              <div className="flex items-center space-x-2">
                {WALL_COLORS.map((col) => (
                  <button
                    key={col.hex}
                    onClick={() => setActiveWallColor(col.hex)}
                    className={`w-7 h-7 rounded-full border-2 transition-transform ${
                      activeWallColor === col.hex ? 'scale-125 border-amber-400 shadow-md ring-2 ring-amber-500/30' : 'border-stone-700 hover:scale-110'
                    }`}
                    style={{ backgroundColor: col.hex }}
                    title={col.name}
                  />
                ))}
              </div>
            </div>

            {/* Frame Style Switcher */}
            <div>
              <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block mb-1.5">
                Frame Choice
              </span>
              <select
                value={selectedFrameId}
                onChange={(e) => setSelectedFrameId(e.target.value)}
                className="bg-stone-800 border border-stone-700 text-stone-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-500 font-medium"
              >
                {FRAMING_OPTIONS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.price === 0 ? 'Included' : `+${artistSettings.currency}${f.price}`})
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Right Action: Investment & Add to Cart */}
          <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-stone-800 pt-3 md:pt-0">
            <div>
              <span className="text-[11px] text-stone-400 block">Total Investment</span>
              <span className="text-xl font-bold text-amber-400">
                {artistSettings.currency}{totalPrice.toLocaleString()}
              </span>
            </div>

            <button
              onClick={() => {
                addToCart(visualizerArtwork, selectedFrameId);
                setIsRoomVisualizerOpen(false);
              }}
              className="bg-amber-600 hover:bg-amber-500 text-white px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition shadow-lg flex items-center space-x-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Collect with this Frame</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
