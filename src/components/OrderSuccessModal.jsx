import React from 'react';
import { useShop } from '../context/ShopContext';
import { 
  CheckCircle2, 
  Sparkles, 
  Printer, 
  MessageCircle, 
  Truck, 
  PackageCheck,
  ShieldCheck,
  X
} from 'lucide-react';

export const OrderSuccessModal = () => {
  const { lastPlacedOrder, setLastPlacedOrder, artistSettings } = useShop();

  if (!lastPlacedOrder) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    const cleanNumber = artistSettings.whatsappNumber.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hello Akshatha! I have placed order #${lastPlacedOrder.id} for ${artistSettings.currency}${lastPlacedOrder.total.toLocaleString()}. Please let me know once it is packaged for dispatch!`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 relative my-6 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Minimal Banner */}
        <div className="bg-[#faf9f6] border-b border-stone-200 p-8 sm:p-10 text-center relative">
          <button
            onClick={() => setLastPlacedOrder(null)}
            className="w-8 h-8 rounded-full border border-stone-200 hover:border-stone-900 flex items-center justify-center text-stone-400 hover:text-stone-900 transition absolute top-4 right-4"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-12 h-12 rounded-full bg-stone-900 text-stone-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-6 h-6 text-stone-100" />
          </div>

          <span className="text-[10px] uppercase tracking-[0.25em] text-stone-500 font-medium block">
            Order Confirmed
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-stone-900 mt-1">
            Thank You
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto mt-2 leading-relaxed">
            Your handmade painting has been reserved. Akshatha Gopalkar is preparing your original piece with protective bubble wrap for safe delivery.
          </p>

          <div className="inline-block mt-4 bg-white border border-stone-200 px-4 py-1.5 rounded-full text-xs font-mono text-stone-700">
            Order ID: {lastPlacedOrder.id}
          </div>
        </div>

        {/* Order Details Body */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[60vh]">
          
          {/* Simple 3-step progress */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-stone-900 font-medium">
                <PackageCheck className="w-4 h-4 text-emerald-700" />
                <span>1. Reserved</span>
              </div>
              <div className="flex items-center space-x-2 text-stone-600">
                <Sparkles className="w-4 h-4 text-stone-500" />
                <span>2. Final Inspection</span>
              </div>
              <div className="flex items-center space-x-2 text-stone-400">
                <Truck className="w-4 h-4 text-stone-400" />
                <span>3. Bubble-wrap Dispatch</span>
              </div>
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-medium uppercase tracking-wider text-stone-500">
              Purchased Original Artworks
            </h4>
            <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden bg-white">
              {lastPlacedOrder.items.map((item, idx) => (
                <div key={idx} className="p-3.5 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <img src={item.image} alt="" className="w-12 h-14 object-cover rounded-md border border-stone-200 shrink-0" />
                    <div>
                      <p className="font-serif text-sm font-medium text-stone-900">{item.title}</p>
                      <p className="text-[11px] text-stone-500">{item.medium}</p>
                      <p className="text-[10px] text-stone-600 mt-0.5">Frame: {item.framingName}</p>
                    </div>
                  </div>
                  <span className="font-medium text-stone-900">{artistSettings.currency}{item.totalItemPrice.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address Recap */}
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 text-xs space-y-1">
            <p className="font-medium text-stone-900">Delivery Recipient</p>
            <p className="text-stone-700">{lastPlacedOrder.customer.name} • {lastPlacedOrder.customer.phone}</p>
            <p className="text-stone-500">{lastPlacedOrder.customer.address}</p>
          </div>

        </div>

        {/* Footer actions */}
        <div className="p-5 bg-[#faf9f6] border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-4 py-2.5 rounded-full border border-stone-300 hover:border-stone-900 text-stone-700 hover:text-stone-900 text-xs font-medium flex items-center justify-center space-x-1.5 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={handleWhatsApp}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium flex items-center justify-center space-x-1.5 transition"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Message Akshatha</span>
            </button>

            <button
              onClick={() => setLastPlacedOrder(null)}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition"
            >
              Return to Gallery
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
