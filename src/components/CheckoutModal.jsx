import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  X, 
  ShieldCheck, 
  Copy, 
  Check, 
  CreditCard, 
  QrCode, 
  MessageCircle, 
  Banknote, 
  Lock,
  Truck,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CheckoutModal = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    cartSubtotal, 
    discountAmount, 
    shippingFee, 
    cartFinalTotal, 
    placeOrder, 
    artistSettings,
    showToast
  } = useShop();

  const [paymentMethod, setPaymentMethod] = useState('UPI Direct'); // 'UPI Direct' | 'WhatsApp Direct' | 'Card' | 'COD'
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Customer form fields
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    deliveryNotes: ''
  });

  if (!isCheckoutOpen || cart.length === 0) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(artistSettings.upiId);
    setCopiedUpi(true);
    showToast('UPI ID copied to clipboard', 'info');
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.address || !formData.pincode) {
      alert('Please fill out all required shipping fields.');
      return;
    }

    if (paymentMethod === 'UPI Direct' && !utrNumber) {
      alert('Please enter your UPI Transaction ID / UTR reference number after completing the payment so we can verify your order.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // ignore
      }

      const orderData = {
        customer: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`
        },
        paymentMethod,
        paymentProof: utrNumber || null,
        notes: formData.deliveryNotes
      };

      const placed = placeOrder(orderData);
      setIsSubmitting(false);

      if (paymentMethod === 'WhatsApp Direct') {
        const cleanNumber = artistSettings.whatsappNumber.replace(/[^0-9]/g, '');
        const itemsList = cart.map(i => `• ${i.title} (${artistSettings.currency}${i.totalItemPrice.toLocaleString()})`).join('\n');
        const text = encodeURIComponent(
          `Hello Akshatha! I have placed an order (#${placed.id}) on your studio website:\n\n${itemsList}\n\nTotal: ${artistSettings.currency}${cartFinalTotal.toLocaleString()}\nShipping to: ${formData.name}, ${formData.address}, ${formData.city} - ${formData.pincode}\nPhone: ${formData.phone}`
        );
        window.open(`https://wa.me/${cleanNumber}?text=${text}`, '_blank');
      }
    }, 700);
  };

  const upiQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    `upi://pay?pa=${artistSettings.upiId}&pn=${encodeURIComponent(artistSettings.name)}&am=${cartFinalTotal}&cu=INR&tn=${encodeURIComponent('Art by Akshatha Original Painting')}`
  )}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-stone-200 relative my-6 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-stone-200 bg-[#faf9f6]">
          <div className="flex items-center space-x-3">
            <Lock className="w-4 h-4 text-stone-600" />
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-light text-stone-900 tracking-tight">
                Checkout & Delivery
              </h3>
              <p className="text-[11px] text-stone-500 tracking-wide uppercase mt-0.5">
                Direct from the artist's studio
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="w-8 h-8 rounded-full border border-stone-200 hover:border-stone-900 flex items-center justify-center text-stone-400 hover:text-stone-900 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Checkout Body Form */}
        <form onSubmit={handleSubmitOrder} className="p-6 sm:p-8 overflow-y-auto max-h-[82vh] space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Shipping Address */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="border-b border-stone-200 pb-3">
                <h4 className="font-serif text-base font-medium text-stone-900 flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-stone-600" />
                  <span>1. Safe Delivery Address</span>
                </h4>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  Every artwork is personally inspected by Akshatha and safely bubble-wrapped with rigid cardboard corner guards in a sturdy box.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div className="sm:col-span-2">
                  <label className="font-medium text-stone-700 block mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Radhika Sharma"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-stone-200 rounded-lg p-2.5 bg-stone-50/40 focus:outline-none focus:border-stone-900 transition"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">Phone / WhatsApp Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border border-stone-200 rounded-lg p-2.5 bg-stone-50/40 focus:outline-none focus:border-stone-900 transition"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="For tracking & invoice"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-stone-200 rounded-lg p-2.5 bg-stone-50/40 focus:outline-none focus:border-stone-900 transition"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-medium text-stone-700 block mb-1">Complete Delivery Address *</label>
                  <input
                    type="text"
                    name="address"
                    required
                    placeholder="Flat / House No., Apartment, Street"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full border border-stone-200 rounded-lg p-2.5 bg-stone-50/40 focus:outline-none focus:border-stone-900 transition"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="e.g. Bengaluru"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full border border-stone-200 rounded-lg p-2.5 bg-stone-50/40 focus:outline-none focus:border-stone-900 transition"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">State *</label>
                  <input
                    type="text"
                    name="state"
                    required
                    placeholder="e.g. Karnataka"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full border border-stone-200 rounded-lg p-2.5 bg-stone-50/40 focus:outline-none focus:border-stone-900 transition"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">PIN / Postal Code *</label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    placeholder="e.g. 560066"
                    value={formData.pincode}
                    onChange={handleChange}
                    className="w-full border border-stone-200 rounded-lg p-2.5 bg-stone-50/40 focus:outline-none focus:border-stone-900 transition"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">Delivery Notes (Optional)</label>
                  <input
                    type="text"
                    name="deliveryNotes"
                    placeholder="e.g. Ring bell, fragile artwork"
                    value={formData.deliveryNotes}
                    onChange={handleChange}
                    className="w-full border border-stone-200 rounded-lg p-2.5 bg-stone-50/40 focus:outline-none focus:border-stone-900 transition"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="pt-4 space-y-3">
                <div className="border-b border-stone-200 pb-2">
                  <h4 className="font-serif text-base font-medium text-stone-900 flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-stone-600" />
                    <span>2. Select Payment Method</span>
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI Direct')}
                    className={`p-3 rounded-xl border text-left text-xs transition ${
                      paymentMethod === 'UPI Direct' 
                        ? 'border-stone-900 bg-stone-50 font-medium text-stone-900 ring-1 ring-stone-900' 
                        : 'border-stone-200 hover:border-stone-300 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <QrCode className="w-4 h-4 text-stone-800" />
                      <span className="font-medium">Direct UPI / QR</span>
                    </div>
                    <span className="text-[10px] text-stone-500 block mt-0.5">Google Pay, PhonePe, Paytm, BHIM</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('WhatsApp Direct')}
                    className={`p-3 rounded-xl border text-left text-xs transition ${
                      paymentMethod === 'WhatsApp Direct' 
                        ? 'border-stone-900 bg-stone-50 font-medium text-stone-900 ring-1 ring-stone-900' 
                        : 'border-stone-200 hover:border-stone-300 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="w-4 h-4 text-emerald-700" />
                      <span className="font-medium">Order via WhatsApp</span>
                    </div>
                    <span className="text-[10px] text-stone-500 block mt-0.5">Direct chat with Akshatha</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Card')}
                    className={`p-3 rounded-xl border text-left text-xs transition ${
                      paymentMethod === 'Card' 
                        ? 'border-stone-900 bg-stone-50 font-medium text-stone-900 ring-1 ring-stone-900' 
                        : 'border-stone-200 hover:border-stone-300 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4 text-stone-700" />
                      <span className="font-medium">Card / NetBanking</span>
                    </div>
                    <span className="text-[10px] text-stone-500 block mt-0.5">Card payment simulator</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-3 rounded-xl border text-left text-xs transition ${
                      paymentMethod === 'COD' 
                        ? 'border-stone-900 bg-stone-50 font-medium text-stone-900 ring-1 ring-stone-900' 
                        : 'border-stone-200 hover:border-stone-300 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Banknote className="w-4 h-4 text-stone-700" />
                      <span className="font-medium">Cash on Delivery</span>
                    </div>
                    <span className="text-[10px] text-stone-500 block mt-0.5">Pay upon delivery / handover</span>
                  </button>
                </div>

                {/* UPI Instructions & QR Details */}
                {paymentMethod === 'UPI Direct' && (
                  <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-3 mt-3">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="w-28 h-28 bg-white p-2 rounded-lg border border-stone-200 shadow-sm shrink-0 flex items-center justify-center">
                        <img src={upiQrUrl} alt="UPI QR Code" className="w-full h-full object-contain" />
                      </div>

                      <div className="space-y-1.5 text-xs text-stone-700 text-center sm:text-left">
                        <p className="font-medium text-stone-900">
                          Scan & Pay via any UPI App or transfer to ID:
                        </p>
                        
                        <div className="inline-flex items-center space-x-2 bg-white px-3 py-1.5 rounded-md border border-stone-200 font-mono text-xs text-stone-900">
                          <span>{artistSettings.upiId}</span>
                          <button
                            type="button"
                            onClick={copyToClipboard}
                            className="p-1 hover:text-stone-600 transition"
                            title="Copy UPI ID"
                          >
                            {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        <p className="text-[11px] text-stone-500">
                          Amount to pay: <strong>{artistSettings.currency}{cartFinalTotal.toLocaleString()}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-stone-200">
                      <label className="text-[11px] font-medium text-stone-800 block mb-1">
                        Enter UPI Transaction ID / UTR Number *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 429381920381 (from your UPI payment screen)"
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-lg p-2.5 text-xs font-mono focus:outline-none focus:border-stone-900"
                      />
                    </div>
                  </div>
                )}

                {/* WhatsApp Direct helper notice */}
                {paymentMethod === 'WhatsApp Direct' && (
                  <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1">
                    <p className="font-medium flex items-center space-x-1.5">
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Direct WhatsApp Order with Akshatha</span>
                    </p>
                    <p className="text-[11px] text-emerald-800/90 leading-relaxed">
                      Placing your order will automatically compose a WhatsApp message with your selected artwork and delivery address. You can chat directly with the artist.
                    </p>
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-5 bg-[#faf9f6] rounded-2xl p-5 sm:p-6 border border-stone-200 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h4 className="font-serif text-lg font-light text-stone-900 border-b border-stone-200 pb-2">
                  Order Summary ({cart.length} Artworks)
                </h4>

                {/* Cart mini items */}
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.cartItemId} className="flex items-center space-x-3 text-xs">
                      <img src={item.image} alt="" className="w-12 h-14 object-cover rounded-md border border-stone-200 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-serif text-sm font-medium text-stone-900 truncate">{item.title}</p>
                        <p className="text-[11px] text-stone-500 truncate">{item.framingName}</p>
                        <p className="text-[11px] text-stone-900 font-medium">{artistSettings.currency}{item.totalItemPrice.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cost Breakdown */}
                <div className="space-y-2 border-t border-stone-200 pt-3 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{artistSettings.currency}{cartSubtotal.toLocaleString()}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Discount</span>
                      <span>-{artistSettings.currency}{discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Safe Protective Shipping</span>
                    <span>
                      {shippingFee === 0 ? <strong className="text-emerald-700 uppercase text-[10px]">Free</strong> : `${artistSettings.currency}${shippingFee.toLocaleString()}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-base font-serif font-medium text-stone-900 pt-2 border-t border-stone-200">
                    <span>Total Amount</span>
                    <span className="font-sans font-medium">{artistSettings.currency}{cartFinalTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Guarantee */}
                <div className="bg-white p-3.5 rounded-xl border border-stone-200 space-y-1.5 text-[11px] text-stone-600">
                  <div className="flex items-center space-x-1.5 font-medium text-stone-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-stone-700" />
                    <span>Every Order Includes:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-stone-500 pl-1">
                    <li>Hand-signed Certificate of Authenticity</li>
                    <li>Pre-installed hanging hooks or mini easel stand</li>
                    <li>Careful multi-layer bubble-wrap packaging</li>
                  </ul>
                </div>
              </div>

              {/* Submit CTA */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-stone-900 hover:bg-stone-800 text-white py-3.5 px-6 rounded-full font-medium text-xs tracking-wider uppercase transition flex items-center justify-center space-x-2 disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <span>Securing Your Art...</span>
                  ) : (
                    <>
                      <span>Confirm & Place Order</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>

        </form>
      </div>
    </div>
  );
};
