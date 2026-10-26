import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ART_CATEGORIES } from '../data/paintings';
import { persistPaintings } from '../utils/storage';
import { 
  Palette, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Settings, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  Clock, 
  Truck, 
  MessageCircle, 
  PhoneCall, 
  Mail, 
  Sparkles, 
  X, 
  Save, 
  DollarSign, 
  Package, 
  RotateCcw, 
  AlertTriangle,
  Download,
  Upload,
  RefreshCw,
  Cloud
} from 'lucide-react';

export const AdminDashboard = () => {
  const { 
    paintings, 
    updatePainting, 
    deletePainting, 
    clearAllPaintings,
    resetToSamplePaintings,
    openAddPaintingModal,
    openEditPaintingModal,
    orders, 
    setOrders, 
    commissions, 
    setCommissions, 
    artistSettings, 
    setArtistSettings, 
    setIsAdminOpen,
    showToast
  } = useShop();

  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'orders' | 'commissions' | 'settings'

  // Settings form state
  const [settingsForm, setSettingsForm] = useState(artistSettings);

  // Financial calculations
  const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);
  const totalArtworksCount = paintings.length;
  const availableCount = paintings.filter(p => p.status === 'available').length;
  const soldCount = paintings.filter(p => p.status === 'sold').length;
  const inventoryValue = paintings
    .filter(p => p.status === 'available')
    .reduce((acc, p) => acc + (p.price || 0), 0);

  // Update order status
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    showToast(`Order #${orderId} marked as ${newStatus}`, 'success');
  };

  // Update commission status
  const handleUpdateCommissionStatus = (comId, newStatus) => {
    setCommissions(prev => prev.map(c => c.id === comId ? { ...c, status: newStatus } : c));
    showToast(`Commission #${comId} updated to ${newStatus}`, 'success');
  };

  // Save Settings
  const handleSaveSettings = (e) => {
    e.preventDefault();
    setArtistSettings(settingsForm);
    showToast('Studio & Payment Settings saved successfully!', 'success');
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to remove all sample paintings? You will have a fresh, clean gallery ready to upload only your paintings!")) {
      clearAllPaintings();
    }
  };

  const handleRestoreSamples = () => {
    if (window.confirm("Restore the sample paintings for reference?")) {
      resetToSamplePaintings();
    }
  };

  const handleSyncToServer = async () => {
    await persistPaintings(paintings, true);
    showToast('Inventory synced to central server! Available on all browsers and devices.', 'success');
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(paintings, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `artbyakshatha-inventory-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Downloaded inventory backup file (.json)', 'success');
  };

  const handleImportJson = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        const list = Array.isArray(parsed) ? parsed : (parsed.paintings || []);
        if (Array.isArray(list)) {
          persistPaintings(list, true);
          window.location.reload();
        } else {
          alert('Invalid inventory JSON format.');
        }
      } catch (err) {
        alert('Could not read JSON file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col">
      {/* Top Admin Navigation Header */}
      <header className="bg-stone-950 border-b border-stone-800 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-600 flex items-center justify-center text-white shadow-lg">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-serif text-lg font-bold text-white">Akshatha Gopalkar • Studio Suite</h1>
              <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                Owner Mode
              </span>
            </div>
            <p className="text-xs text-stone-400">Manage Your Paintings, Client Orders & Commissions</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={openAddPaintingModal}
            className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Add Your Painting</span>
          </button>

          <button
            onClick={() => setIsAdminOpen(false)}
            className="bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition border border-stone-700"
          >
            <Eye className="w-4 h-4 text-amber-400" />
            <span>View Public Store</span>
          </button>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 w-full flex-1 space-y-6">
        
        {/* Quick KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-stone-800/80 border border-stone-700/80 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
              <span>Total Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-white">
              {artistSettings.currency}{totalRevenue.toLocaleString()}
            </p>
            <p className="text-[11px] text-emerald-400 mt-1 font-medium">{orders.length} Orders Placed</p>
          </div>

          <div className="bg-stone-800/80 border border-stone-700/80 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
              <span>Your Artworks</span>
              <Palette className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-white">
              {availableCount} <span className="text-xs text-stone-400 font-normal">available</span>
            </p>
            <p className="text-[11px] text-amber-400 mt-1 font-medium">{soldCount} Sold Originals</p>
          </div>

          <div className="bg-stone-800/80 border border-stone-700/80 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
              <span>Gallery Stock Value</span>
              <TrendingUp className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-white">
              {artistSettings.currency}{inventoryValue.toLocaleString()}
            </p>
            <p className="text-[11px] text-stone-400 mt-1">Available for sale</p>
          </div>

          <div className="bg-stone-800/80 border border-stone-700/80 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
              <span>Custom Inquiries</span>
              <MessageCircle className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-white">
              {commissions.length}
            </p>
            <p className="text-[11px] text-amber-300 mt-1 font-medium">Bespoke Requests</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 border-b border-stone-800 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition shrink-0 ${
              activeTab === 'inventory' 
                ? 'bg-amber-600 text-white shadow' 
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Paintings Inventory ({paintings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition shrink-0 ${
              activeTab === 'orders' 
                ? 'bg-amber-600 text-white shadow' 
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Customer Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('commissions')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition shrink-0 ${
              activeTab === 'commissions' 
                ? 'bg-amber-600 text-white shadow' 
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Commission Inquiries ({commissions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition shrink-0 ${
              activeTab === 'settings' 
                ? 'bg-amber-600 text-white shadow' 
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Studio Profile & Payment UPI</span>
          </button>
        </div>

        {/* TAB 1: INVENTORY MANAGEMENT */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            
            {/* Multi-Device Server Sync Bar */}
            <div className="bg-stone-800/60 border border-stone-700/60 rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2 text-stone-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-medium text-stone-200">Shared Central Inventory:</span>
                <span className="text-stone-400">Saved to project disk (`src/data/inventory.json`) and shared across all visitors & browsers.</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleSyncToServer}
                  className="bg-stone-800 hover:bg-stone-700 text-stone-200 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition border border-stone-700"
                  title="Push current inventory to central server"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sync to Server</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportJson}
                  className="bg-stone-800 hover:bg-stone-700 text-stone-200 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition border border-stone-700"
                  title="Download inventory backup file (.json)"
                >
                  <Download className="w-3.5 h-3.5 text-stone-400" />
                  <span>Export JSON</span>
                </button>

                <label className="bg-stone-800 hover:bg-stone-700 text-stone-200 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition border border-stone-700 cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-stone-400" />
                  <span>Import JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportJson}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Quick Action Banner for replacing paintings */}
            <div className="bg-gradient-to-r from-amber-950/60 via-stone-800/90 to-amber-950/60 border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-serif font-bold text-base text-amber-200 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Ready to add your own paintings?</span>
                </h4>
                <p className="text-xs text-stone-300">
                  Upload high-res photos from your phone or computer, set your pricing, and remove the demo paintings.
                </p>
              </div>

              <div className="flex items-center space-x-2.5 shrink-0">
                <button
                  onClick={openAddPaintingModal}
                  className="bg-amber-500 hover:bg-amber-400 text-stone-950 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow flex items-center space-x-1.5"
                >
                  <Plus className="w-4 h-4 text-stone-900" />
                  <span>Add Your Painting</span>
                </button>

                <button
                  onClick={handleClearAll}
                  className="bg-stone-900/90 hover:bg-rose-950/90 text-rose-300 border border-rose-800/60 hover:border-rose-600 px-3 py-2.5 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5"
                  title="Remove all demo paintings with 1 click"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Remove Demo Art</span>
                </button>

                {paintings.length === 0 && (
                  <button
                    onClick={handleRestoreSamples}
                    className="bg-stone-800 hover:bg-stone-700 text-stone-300 px-3 py-2.5 rounded-xl text-xs font-semibold transition flex items-center space-x-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restore Samples</span>
                  </button>
                )}
              </div>
            </div>

            {/* Inventory List */}
            {paintings.length === 0 ? (
              <div className="p-12 text-center bg-stone-800/60 rounded-3xl border border-dashed border-stone-700 space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
                  <Palette className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-white">Your Gallery is Fresh & Empty!</h3>
                  <p className="text-xs text-stone-400 max-w-md mx-auto mt-1">
                    All demo artworks have been removed. Click below to upload your first handmade painting and start selling!
                  </p>
                </div>
                <button
                  onClick={openAddPaintingModal}
                  className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition shadow-lg inline-flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload Your First Painting</span>
                </button>
              </div>
            ) : (
              <div className="bg-stone-800/80 border border-stone-700/80 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-900/80 text-stone-400 uppercase tracking-wider text-[10px] border-b border-stone-700">
                      <tr>
                        <th className="py-3.5 px-4">Artwork</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4">Dimensions & Medium</th>
                        <th className="py-3.5 px-4">Price</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-700/60">
                      {paintings.map((art) => (
                        <tr key={art.id} className="hover:bg-stone-750/50 transition">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center space-x-3">
                              <img 
                                src={art.images?.[0] || art.image} 
                                alt="" 
                                className="w-12 h-14 object-cover rounded-lg border border-stone-700 shrink-0" 
                              />
                              <div>
                                <p className="font-bold text-white text-sm font-serif">{art.title}</p>
                                <p className="text-[11px] text-stone-400">{art.year} • 1 of 1 Edition</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-stone-300">
                            <span className="bg-stone-900 px-2.5 py-1 rounded-md text-[11px] border border-stone-700">
                              {art.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-stone-300">
                            <p className="font-medium text-white">{art.dimensions}</p>
                            <p className="text-[11px] text-stone-400 truncate max-w-xs">{art.medium}</p>
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="font-bold text-amber-400 text-sm">
                              {artistSettings.currency}{art.price?.toLocaleString()}
                            </p>
                            {art.originalPrice > art.price && (
                              <p className="text-[10px] text-stone-500 line-through">
                                {artistSettings.currency}{art.originalPrice?.toLocaleString()}
                              </p>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <select
                              value={art.status}
                              onChange={(e) => updatePainting({ ...art, status: e.target.value })}
                              className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold border focus:outline-none ${
                                art.status === 'available' 
                                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700' 
                                : 'bg-rose-950/60 text-rose-300 border-rose-700'
                              }`}
                            >
                              <option value="available">Available in Studio</option>
                              <option value="sold">Sold (Archive)</option>
                            </select>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => openEditPaintingModal(art)}
                                className="p-1.5 rounded-lg bg-stone-700 hover:bg-stone-600 text-stone-200 transition"
                                title="Edit Artwork"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete "${art.title}"?`)) {
                                    deletePainting(art.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg bg-rose-900/50 hover:bg-rose-900 text-rose-300 transition"
                                title="Delete Artwork"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-white">Client Orders & White-Glove Dispatch</h3>
              <p className="text-xs text-stone-400">Track incoming customer orders and shipping status.</p>
            </div>

            {orders.length === 0 ? (
              <div className="p-12 text-center bg-stone-800/80 rounded-2xl border border-stone-700 text-stone-400">
                No orders placed yet. They will appear here immediately upon customer checkout.
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div key={ord.id} className="bg-stone-800/80 border border-stone-700/80 rounded-2xl p-5 space-y-4 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-700 pb-3">
                      <div className="flex items-center space-x-3">
                        <span className="font-mono font-bold text-amber-400 text-sm">#{ord.id}</span>
                        <span className="text-stone-400 text-xs">Placed on: {ord.date}</span>
                        <span className="bg-stone-900 px-2 py-0.5 rounded text-[10px] text-stone-300 border border-stone-700">
                          {ord.paymentMethod}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-stone-400 font-medium">Status:</span>
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                          className="bg-stone-900 border border-stone-700 text-stone-200 text-xs rounded-lg px-2.5 py-1 focus:outline-none"
                        >
                          <option value="Pending">Pending Review</option>
                          <option value="Varnishing & Packing">Varnishing & Packing</option>
                          <option value="Shipped">Shipped / Dispatched</option>
                          <option value="Delivered">Delivered & Verified</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                      {/* Customer Address */}
                      <div className="md:col-span-5 bg-stone-900/60 p-3.5 rounded-xl border border-stone-700/60 space-y-1">
                        <p className="font-bold text-white text-sm">{ord.customer.name}</p>
                        <p className="text-stone-400 leading-relaxed">{ord.customer.address}</p>
                        <div className="flex items-center space-x-3 pt-1 text-stone-300">
                          <span className="flex items-center space-x-1">
                            <PhoneCall className="w-3 h-3 text-amber-400" />
                            <span>{ord.customer.phone}</span>
                          </span>
                          {ord.customer.email && (
                            <span className="flex items-center space-x-1">
                              <Mail className="w-3 h-3 text-amber-400" />
                              <span>{ord.customer.email}</span>
                            </span>
                          )}
                        </div>
                        {ord.paymentProof && (
                          <p className="text-[11px] text-amber-300 font-mono pt-1">
                            UPI Ref: {ord.paymentProof}
                          </p>
                        )}
                      </div>

                      {/* Purchased Art Pieces */}
                      <div className="md:col-span-7 flex flex-col justify-between">
                        <div className="space-y-2">
                          {ord.items.map((it, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-stone-900/40 p-2.5 rounded-xl border border-stone-700/40">
                              <div className="flex items-center space-x-2.5">
                                <img src={it.image} alt="" className="w-10 h-12 object-cover rounded border border-stone-700" />
                                <div>
                                  <p className="font-bold text-white font-serif">{it.title}</p>
                                  <p className="text-[10px] text-stone-400">{it.framingName}</p>
                                </div>
                              </div>
                              <span className="font-bold text-amber-400">
                                {artistSettings.currency}{it.totalItemPrice?.toLocaleString() || it.price?.toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-2 flex items-center justify-between border-t border-stone-700/60 mt-2">
                          <span className="text-stone-400">Total Order Value:</span>
                          <span className="text-base font-bold text-white">
                            {artistSettings.currency}{ord.total?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CUSTOM COMMISSIONS INBOX */}
        {activeTab === 'commissions' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-white">Custom Commission Inquiries</h3>
              <p className="text-xs text-stone-400">Client briefs for custom sizes and interior colors.</p>
            </div>

            {commissions.length === 0 ? (
              <div className="p-12 text-center bg-stone-800/80 rounded-2xl border border-stone-700 text-stone-400">
                No commission requests currently. Inquiries will appear here when submitted.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {commissions.map((com) => (
                  <div key={com.id} className="bg-stone-800/80 border border-stone-700/80 rounded-2xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-stone-700 pb-2.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-amber-400 text-xs">#{com.id}</span>
                          <span className="text-stone-400 text-[11px]">{com.date}</span>
                        </div>
                        <select
                          value={com.status}
                          onChange={(e) => handleUpdateCommissionStatus(com.id, e.target.value)}
                          className="bg-stone-900 border border-stone-700 text-stone-200 text-[11px] font-semibold rounded-lg px-2 py-0.5 focus:outline-none"
                        >
                          <option value="New">New Request</option>
                          <option value="In Discussion">In Discussion</option>
                          <option value="Deposit Paid">Deposit Paid (Confirmed)</option>
                          <option value="In Studio">Underway on Easel</option>
                          <option value="Completed">Completed & Shipped</option>
                        </select>
                      </div>

                      <div>
                        <h4 className="font-serif text-base font-bold text-white">{com.name}</h4>
                        <p className="text-xs text-stone-400 flex items-center space-x-3 mt-0.5">
                          <span>Ph: {com.phone}</span>
                          {com.email && <span>• {com.email}</span>}
                        </p>
                      </div>

                      <div className="bg-stone-900/60 p-3 rounded-xl border border-stone-700/60 text-xs space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-stone-400">Style / Medium:</span>
                          <span className="font-medium text-amber-300">{com.style}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-400">Dimensions:</span>
                          <span className="font-medium text-white">{com.dimensions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-400">Budget Range:</span>
                          <span className="font-medium text-white">{com.budget}</span>
                        </div>
                        <div className="pt-1.5 border-t border-stone-700/60">
                          <span className="text-stone-400 block mb-0.5">Color Palette & Notes:</span>
                          <p className="text-stone-200 italic font-mono text-[11px]">"{com.colorPalette}"</p>
                          {com.notes && <p className="text-stone-300 mt-1">"{com.notes}"</p>}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => {
                          const cleanNumber = com.phone.replace(/[^0-9]/g, '');
                          const message = encodeURIComponent(
                            `Hello ${com.name}! This is Aks from Art by Aks. I reviewed your commission inquiry for a ${com.dimensions} ${com.style} artwork. I would love to discuss your custom canvas concept with you!`
                          );
                          window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
                        }}
                        className="w-full bg-emerald-700 hover:bg-emerald-600 text-white py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition shadow"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Reply on WhatsApp</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: STUDIO & PAYMENT SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-stone-800/80 border border-stone-700/80 rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="font-serif text-lg font-bold text-white">Studio Profile & Payment Gateway Settings</h3>
              <p className="text-xs text-stone-400">Set your personal UPI ID, WhatsApp number, and artist bio.</p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-stone-300 font-medium block mb-1">Artist Name</label>
                  <input
                    type="text"
                    value={settingsForm.name}
                    onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-stone-300 font-medium block mb-1">Brand / Studio Name</label>
                  <input
                    type="text"
                    value={settingsForm.brandName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, brandName: e.target.value })}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-stone-300 font-medium block mb-1">Direct UPI ID (for QR Code & Transfers)</label>
                  <input
                    type="text"
                    value={settingsForm.upiId}
                    onChange={(e) => setSettingsForm({ ...settingsForm, upiId: e.target.value })}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-stone-300 font-medium block mb-1">WhatsApp Business Phone</label>
                  <input
                    type="text"
                    value={settingsForm.whatsappNumber}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-stone-300 font-medium block mb-1">Currency Symbol</label>
                  <input
                    type="text"
                    value={settingsForm.currency}
                    onChange={(e) => setSettingsForm({ ...settingsForm, currency: e.target.value })}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-stone-300 font-medium block mb-1">Free Shipping Threshold</label>
                  <input
                    type="number"
                    value={settingsForm.freeShippingAbove}
                    onChange={(e) => setSettingsForm({ ...settingsForm, freeShippingAbove: Number(e.target.value) })}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-stone-300 font-medium block mb-1">Artist Statement / Bio</label>
                <textarea
                  rows={4}
                  value={settingsForm.bio}
                  onChange={(e) => setSettingsForm({ ...settingsForm, bio: e.target.value })}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-500 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center space-x-2 transition shadow-lg"
              >
                <Save className="w-4 h-4" />
                <span>Save Settings</span>
              </button>
            </form>
          </div>
        )}

      </div>

    </div>
  );
};
