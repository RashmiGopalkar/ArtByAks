import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  Truck, 
  ShieldCheck
} from 'lucide-react';

export const CartDrawer = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    removeFromCart, 
    cartSubtotal, 
    discountAmount, 
    shippingFee, 
    cartFinalTotal, 
    appliedCoupon, 
    applyCouponCode, 
    removeCoupon, 
    setIsCheckoutOpen,
    artistSettings
  } = useShop();

  const [promoInput, setPromoInput] = useState('');

  if (!isCartOpen) return null;

  const freeShippingThreshold = artistSettings.freeShippingAbove;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoInput) return;
    if (applyCouponCode(promoInput)) {
      setPromoInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-xs flex justify-end animate-fadeIn">
      {/* Drawer Container */}
      <div 
        className="w-full max-w-md bg-[#faf9f6] h-full shadow-2xl flex flex-col border-l border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-200/80 bg-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-4 h-4 text-stone-800 stroke-[1.5]" />
            <h3 className="font-serif text-lg text-stone-900 font-normal">
              Collector's Bag ({cart.length})
            </h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1 rounded-full text-stone-400 hover:text-stone-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-stone-50 border-b border-stone-200 px-6 py-3 text-xs">
          <div className="flex items-center justify-between mb-1.5 text-stone-600 font-light">
            <span className="flex items-center space-x-1.5">
              <Truck className="w-3.5 h-3.5 text-stone-500" />
              <span>
                {remainingForFreeShipping === 0 
                  ? 'Qualified for Free Safe Pan-India Delivery' 
                  : `Add ${artistSettings.currency}${remainingForFreeShipping.toLocaleString()} for Free Delivery`}
              </span>
            </span>
            <span className="font-mono text-stone-900">{Math.round(freeShippingProgress)}%</span>
          </div>
          <div className="w-full bg-stone-200 rounded-full h-1 overflow-hidden">
            <div 
              className="bg-stone-900 h-full rounded-full transition-all duration-500" 
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3.5">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-stone-400 my-auto">
              <ShoppingBag className="w-10 h-10 stroke-[1.2] text-stone-300" />
              <div>
                <p className="font-serif text-lg text-stone-800 font-normal">Your Bag is Empty</p>
                <p className="text-xs text-stone-500 font-light max-w-xs mt-1 leading-relaxed">
                  Discover handcrafted original paintings by Akshatha to bring character into your home.
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="bg-stone-900 hover:bg-black text-white text-xs uppercase tracking-wider font-medium px-5 py-2.5 rounded-full transition"
              >
                Browse Gallery
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div 
                key={item.cartItemId}
                className="bg-white rounded-xl p-3.5 border border-stone-200/80 shadow-xs flex gap-3.5"
              >
                {/* Artwork Thumbnail */}
                <div className="w-18 h-22 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <h4 className="font-serif text-sm font-medium text-stone-900 line-clamp-1">
                        {item.title}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-stone-400 hover:text-rose-600 transition p-0.5"
                        title="Remove Artwork"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-stone-500 mt-0.5 font-light line-clamp-1">
                      {item.medium}
                    </p>

                    <p className="text-[10px] text-stone-500 mt-1 font-mono">
                      Frame: {item.framingName}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 mt-2">
                    <span className="text-[10px] text-stone-500 uppercase tracking-wider">
                      Original 1 of 1
                    </span>
                    <span className="font-mono font-semibold text-xs text-stone-900">
                      {artistSettings.currency}{item.totalItemPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary & Checkout */}
        {cart.length > 0 && (
          <div className="p-6 bg-white border-t border-stone-200 space-y-4">
            
            {/* Promo Code Input */}
            <div>
              {appliedCoupon ? (
                <div className="bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 flex items-center justify-between text-xs text-stone-800">
                  <div className="flex items-center space-x-1.5 font-light">
                    <Tag className="w-3.5 h-3.5 text-stone-500" />
                    <span>Coupon <strong>{appliedCoupon.code}</strong> applied ({appliedCoupon.discountPercent}% OFF)</span>
                  </div>
                  <button 
                    onClick={removeCoupon}
                    className="text-stone-500 hover:text-stone-900 font-medium underline text-[11px]"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Promo code (e.g. FIRSTART10)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs border border-stone-300 rounded-full bg-stone-50/50 uppercase"
                  />
                  <button
                    type="submit"
                    className="bg-stone-900 hover:bg-black text-white text-xs font-medium px-4 py-2 rounded-full transition"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-1.5 text-xs text-stone-600 font-light border-t border-stone-100 pt-3">
              <div className="flex justify-between">
                <span>Subtotal ({cart.length} pieces)</span>
                <span className="font-mono text-stone-900 font-normal">
                  {artistSettings.currency}{cartSubtotal.toLocaleString()}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-stone-700">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span className="font-mono">-{artistSettings.currency}{discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Safe Packaging & Pan-India Shipping</span>
                <span className="font-mono">
                  {shippingFee === 0 ? 'Complimentary' : `${artistSettings.currency}${shippingFee.toLocaleString()}`}
                </span>
              </div>

              <div className="flex justify-between text-sm font-medium text-stone-900 pt-2 border-t border-stone-200 font-mono">
                <span>Total Amount</span>
                <span>{artistSettings.currency}{cartFinalTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
              className="w-full bg-stone-900 hover:bg-black text-white py-3.5 px-4 rounded-full font-medium text-xs tracking-[0.15em] uppercase transition shadow-sm flex items-center justify-center space-x-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center justify-center space-x-3 text-[10px] text-stone-400 text-center uppercase tracking-wider">
              <span>Authentic 1 of 1</span>
              <span>•</span>
              <span>Signed Certificate</span>
              <span>•</span>
              <span>Safe Delivery</span>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
