import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PAINTINGS, SAMPLE_DEMO_PAINTINGS, FRAMING_OPTIONS } from '../data/paintings';
import { ARTIST_INFO } from '../data/reviews';
import { 
  persistPaintings, 
  loadSyncPaintings, 
  getIDB, 
  setIDB,
  fetchServerInventory,
  syncServerOrder,
  syncServerCommission,
  syncServerSettings
} from '../utils/storage';

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  // 1. Paintings State: Synchronously loads your real paintings (from inventory.json / cache)
  const [paintings, setPaintings] = useState(() => {
    return loadSyncPaintings(INITIAL_PAINTINGS);
  });

  // Central Server Hydration: Automatically fetches latest paintings from disk
  useEffect(() => {
    let isMounted = true;

    const hydrateCentralInventory = async () => {
      try {
        const serverData = await fetchServerInventory();
        if (isMounted && serverData && Array.isArray(serverData.paintings)) {
          setPaintings(serverData.paintings);
          setIDB('paintings_v2', serverData.paintings);
          try {
            localStorage.setItem('artbyaks_paintings_v2', JSON.stringify(serverData.paintings));
            localStorage.setItem('artbyaks_inventory_saved_v2', 'true');
          } catch (e) {}
          return;
        }

        // Offline IndexedDB check
        const localIDB = await getIDB('paintings_v2');
        if (isMounted && localIDB && Array.isArray(localIDB) && localIDB.length > 0) {
          setPaintings(localIDB);
        }
      } catch (err) {
        console.warn('[ShopContext] Sync notice:', err);
      }
    };

    hydrateCentralInventory();
    return () => { isMounted = false; };
  }, []);

  // 2. Artist Settings
  const [artistSettings, setArtistSettingsState] = useState(() => {
    try {
      const saved = localStorage.getItem('artbyaks_settings');
      return saved ? JSON.parse(saved) : ARTIST_INFO;
    } catch (e) {
      return ARTIST_INFO;
    }
  });

  const setArtistSettings = (newSettings) => {
    setArtistSettingsState(newSettings);
    syncServerSettings(newSettings);
    try {
      localStorage.setItem('artbyaks_settings', JSON.stringify(newSettings));
    } catch (e) {
      console.warn('Failed to save settings:', e);
    }
  };

  // 3. Cart State
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('artbyaks_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // 4. Wishlist State (starts empty or with real paintings, not deleted demos)
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('artbyaks_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // 5. Orders State
  const [orders, setOrdersState] = useState(() => {
    try {
      const saved = localStorage.getItem('artbyaks_orders');
      if (saved) return JSON.parse(saved);
      return [];
    } catch (e) {
      return [];
    }
  });

  const setOrders = (updater) => {
    setOrdersState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try {
        localStorage.setItem('artbyaks_orders', JSON.stringify(next));
      } catch (e) {
        console.warn('Failed to save orders:', e);
      }
      return next;
    });
  };

  // 6. Commission Requests State
  const [commissions, setCommissionsState] = useState(() => {
    try {
      const saved = localStorage.getItem('artbyaks_commissions');
      if (saved) return JSON.parse(saved);
      return [];
    } catch (e) {
      return [];
    }
  });

  const setCommissions = (updater) => {
    setCommissionsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try {
        localStorage.setItem('artbyaks_commissions', JSON.stringify(next));
      } catch (e) {
        console.warn('Failed to save commissions:', e);
      }
      return next;
    });
  };

  // 7. Active Modals & Selected States
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [isRoomVisualizerOpen, setIsRoomVisualizerOpen] = useState(false);
  const [visualizerArtwork, setVisualizerArtwork] = useState(null);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [certificateArtwork, setCertificateArtwork] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCommissionOpen, setIsCommissionOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isArtModalOpen, setIsArtModalOpen] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState(null);

  // Studio Mode Toggle
  const [isArtistMode, setIsArtistModeState] = useState(() => {
    return localStorage.getItem('artbyaks_studio_mode') === 'true';
  });

  const setIsArtistMode = (mode) => {
    setIsArtistModeState(mode);
    localStorage.setItem('artbyaks_studio_mode', mode ? 'true' : 'false');
  };

  const [lastPlacedOrder, setLastPlacedOrder] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // 8. Promo Code
  const [appliedCoupon, setAppliedCoupon] = useState({ code: "FIRSTART10", discountPercent: 10 });

  // Sync Cart and Wishlist to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('artbyaks_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('artbyaks_wishlist', JSON.stringify(wishlist));
    } catch (e) {}
  }, [wishlist]);

  // Toast Helper
  const showToast = (message, type = 'info') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage((current) => (current?.id ? null : current));
    }, 3500);
  };

  // Cart Operations
  const addToCart = (artwork, framingOptionId = 'none') => {
    const existingIndex = cart.findIndex(item => item.id === artwork.id && item.framingId === framingOptionId);
    const frameObj = FRAMING_OPTIONS.find(f => f.id === framingOptionId) || FRAMING_OPTIONS[0];

    if (existingIndex > -1) {
      showToast(`"${artwork.title}" is an original 1-of-1 piece and is already in your bag!`, 'warning');
      setIsCartOpen(true);
      return;
    }

    const newItem = {
      cartItemId: `${artwork.id}-${framingOptionId}-${Date.now()}`,
      id: artwork.id,
      title: artwork.title,
      medium: artwork.medium,
      dimensions: artwork.dimensions,
      price: artwork.price,
      image: artwork.images?.[0] || artwork.image,
      framingId: frameObj.id,
      framingName: frameObj.name,
      framingPrice: frameObj.price,
      totalItemPrice: artwork.price + frameObj.price
    };

    setCart(prev => [...prev, newItem]);
    showToast(`Added "${artwork.title}" to your bag`, 'success');
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
    showToast('Removed artwork from bag', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist Operations
  const toggleWishlist = (artworkId) => {
    setWishlist(prev => {
      const exists = prev.includes(artworkId);
      if (exists) {
        showToast('Removed from favorites', 'info');
        return prev.filter(id => id !== artworkId);
      } else {
        showToast('Saved to your favorites', 'success');
        return [...prev, artworkId];
      }
    });
  };

  // Calculations
  const cartSubtotal = cart.reduce((acc, item) => acc + (item.totalItemPrice || 0), 0);
  const discountAmount = appliedCoupon ? Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100) : 0;
  const shippingFee = cartSubtotal >= artistSettings.freeShippingAbove || cart.length === 0 ? 0 : artistSettings.standardShippingFee;
  const cartFinalTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  // Apply Coupon
  const applyCouponCode = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'FIRSTART10') {
      setAppliedCoupon({ code: 'FIRSTART10', discountPercent: 10 });
      showToast('10% First Art Collector discount applied!', 'success');
      return true;
    } else if (clean === 'COLLECTOR15') {
      setAppliedCoupon({ code: 'COLLECTOR15', discountPercent: 15 });
      showToast('15% VIP Collector discount applied!', 'success');
      return true;
    } else if (clean === 'FREESHIP') {
      setAppliedCoupon({ code: 'FREESHIP', discountPercent: 0, freeShipping: true });
      showToast('Free Shipping coupon applied!', 'success');
      return true;
    } else {
      showToast('Invalid promo code. Try "FIRSTART10"', 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Promo code removed', 'info');
  };

  // ==========================================
  // INVENTORY OPERATIONS (CENTRAL & PERSISTENT)
  // ==========================================

  // Add Painting
  const addPainting = (newArt) => {
    const artWithId = {
      ...newArt,
      id: `art-${Date.now()}`,
      rating: 5.0,
      reviewCount: 0,
      year: newArt.year || new Date().getFullYear().toString(),
      images: newArt.images?.length ? newArt.images : ["https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=1200&q=80"]
    };

    setPaintings(prev => {
      const nextList = [artWithId, ...prev];
      persistPaintings(nextList, true);
      return nextList;
    });

    showToast(`Artwork "${artWithId.title}" published & saved to your store!`, 'success');
  };

  // Update Painting
  const updatePainting = (updatedArt) => {
    setPaintings(prev => {
      const nextList = prev.map(art => art.id === updatedArt.id ? updatedArt : art);
      persistPaintings(nextList, true);
      return nextList;
    });

    showToast(`Updated "${updatedArt.title}" details`, 'success');
  };

  // Delete Painting
  const deletePainting = (id) => {
    const art = paintings.find(p => p.id === id);
    setPaintings(prev => {
      const nextList = prev.filter(p => p.id !== id);
      persistPaintings(nextList, true);
      return nextList;
    });

    showToast(`Removed "${art?.title || 'painting'}" from store`, 'info');
  };

  // 1-Click Clear All Paintings (Guaranteed clean slate)
  const clearAllPaintings = () => {
    setPaintings([]);
    persistPaintings([], true);
    showToast('Cleared all sample paintings. Clean store ready for your art!', 'info');
  };

  // 1-Click Reset to Initial Demo Paintings (Only if explicitly requested)
  const resetToSamplePaintings = () => {
    setPaintings(SAMPLE_DEMO_PAINTINGS);
    persistPaintings(SAMPLE_DEMO_PAINTINGS, false);
    showToast('Restored sample gallery paintings', 'success');
  };

  // Open Add Artwork Modal helper
  const openAddPaintingModal = () => {
    setEditingArtwork(null);
    setIsArtModalOpen(true);
  };

  const openEditPaintingModal = (artwork) => {
    setEditingArtwork(artwork);
    setIsArtModalOpen(true);
  };

  // Place Order
  const placeOrder = (orderData) => {
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: orderId,
      date: new Date().toISOString().split('T')[0],
      customer: orderData.customer,
      items: cart,
      subtotal: cartSubtotal,
      discount: discountAmount,
      shipping: shippingFee,
      total: cartFinalTotal,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentMethod === 'UPI Direct' ? 'Payment Proof Submitted' : 'Paid',
      status: 'Pending',
      paymentProof: orderData.paymentProof || null,
      notes: orderData.notes || ''
    };

    // Mark purchased original artworks as sold & persist centrally
    const purchasedIds = cart.map(i => i.id);
    setPaintings(prev => {
      const nextList = prev.map(art => {
        if (purchasedIds.includes(art.id)) {
          return { ...art, status: 'sold' };
        }
        return art;
      });
      persistPaintings(nextList, true);
      return nextList;
    });

    setOrders(prev => [newOrder, ...prev]);
    syncServerOrder(newOrder);
    setLastPlacedOrder(newOrder);
    clearCart();
    setIsCheckoutOpen(false);
    return newOrder;
  };

  // Submit Commission
  const submitCommission = (commissionData) => {
    const comId = `COM-${Math.floor(100 + Math.random() * 900)}`;
    const newCommission = {
      id: comId,
      date: new Date().toISOString().split('T')[0],
      ...commissionData,
      status: 'New'
    };
    setCommissions(prev => [newCommission, ...prev]);
    syncServerCommission(newCommission);
    showToast('Your custom commission inquiry has been sent to Akshatha!', 'success');
    setIsCommissionOpen(false);
    return newCommission;
  };

  const openRoomVisualizer = (artwork) => {
    setVisualizerArtwork(artwork);
    setIsRoomVisualizerOpen(true);
  };

  const openCertificate = (artwork) => {
    setCertificateArtwork(artwork);
    setIsCertificateOpen(true);
  };

  return (
    <ShopContext.Provider
      value={{
        paintings,
        setPaintings,
        artistSettings,
        setArtistSettings,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        wishlist,
        toggleWishlist,
        cartSubtotal,
        discountAmount,
        shippingFee,
        cartFinalTotal,
        appliedCoupon,
        applyCouponCode,
        removeCoupon,
        orders,
        setOrders,
        commissions,
        setCommissions,
        selectedArtwork,
        setSelectedArtwork,
        isRoomVisualizerOpen,
        setIsRoomVisualizerOpen,
        visualizerArtwork,
        openRoomVisualizer,
        isCertificateOpen,
        setIsCertificateOpen,
        certificateArtwork,
        openCertificate,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isCommissionOpen,
        setIsCommissionOpen,
        isAdminOpen,
        setIsAdminOpen,
        isArtistMode,
        setIsArtistMode,
        isArtModalOpen,
        setIsArtModalOpen,
        editingArtwork,
        openAddPaintingModal,
        openEditPaintingModal,
        lastPlacedOrder,
        setLastPlacedOrder,
        placeOrder,
        submitCommission,
        addPainting,
        updatePainting,
        deletePainting,
        clearAllPaintings,
        resetToSamplePaintings,
        toastMessage,
        showToast
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
