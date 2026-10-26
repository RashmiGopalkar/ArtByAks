import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { ART_CATEGORIES } from '../data/paintings';
import { compressImageFile } from '../utils/imageHelper';
import { uploadImageToServer } from '../utils/storage';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Sparkles, 
  Check, 
  Palette,
  Layers,
  DollarSign,
  Maximize2
} from 'lucide-react';

export const ArtworkFormModal = () => {
  const { 
    isArtModalOpen, 
    setIsArtModalOpen, 
    editingArtwork, 
    addPainting, 
    updatePainting, 
    artistSettings,
    showToast
  } = useShop();

  const [form, setForm] = useState({
    title: '',
    category: 'Warli Art',
    medium: 'Fine White Pigment on Terracotta Canvas',
    dimensions: '12 x 16 inches (30 x 40 cm)',
    sizeCategory: 'Small',
    price: 1450,
    originalPrice: 1800,
    status: 'available',
    isFeatured: true,
    images: [],
    description: '',
    story: ''
  });

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Populate when editing
  useEffect(() => {
    if (editingArtwork) {
      setForm({
        ...editingArtwork,
        images: editingArtwork.images || (editingArtwork.image ? [editingArtwork.image] : [])
      });
    } else {
      setForm({
        title: '',
        category: 'Warli Art',
        medium: 'Fine White Pigment on Terracotta Canvas',
        dimensions: '12 x 16 inches (30 x 40 cm)',
        sizeCategory: 'Small',
        price: 1500,
        originalPrice: 1800,
        status: 'available',
        isFeatured: true,
        images: [],
        description: 'Original handmade painting crafted by Akshatha Gopalkar with archival pigments and fine brushes.',
        story: 'Handmade with patience and love to bring warmth and authentic folk art to your home.'
      });
    }
    setImageUrlInput('');
  }, [editingArtwork, isArtModalOpen]);

  if (!isArtModalOpen) return null;

  // Handle local image file upload from device
  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
    setIsProcessingImage(true);
    try {
      const processedImages = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          const compressed = await compressImageFile(file, 1200, 1500, 0.82);
          // Save directly to server disk in public/uploads/ (with base64 fallback)
          const finalUrl = await uploadImageToServer(compressed, file.name);
          processedImages.push(finalUrl);
        }
      }
      setForm(prev => ({
        ...prev,
        images: [...prev.images, ...processedImages]
      }));
      showToast(`Loaded ${processedImages.length} photo(s) of your painting!`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Could not process photo. Please try a different image.', 'error');
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setForm(prev => ({
      ...prev,
      images: [...prev.images, imageUrlInput.trim()]
    }));
    setImageUrlInput('');
    showToast('Image URL added!', 'success');
  };

  const handleRemoveImage = (indexToRemove) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert('Please enter a title for your painting.');
      return;
    }
    if (!form.price || form.price <= 0) {
      alert('Please enter a valid price for your painting.');
      return;
    }
    if (form.images.length === 0) {
      alert('Please upload or provide at least one photo of your painting.');
      return;
    }

    if (editingArtwork) {
      updatePainting({ ...form, id: editingArtwork.id });
    } else {
      addPainting(form);
    }
    setIsArtModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-stone-200 relative my-6 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-full bg-amber-600/10 border border-amber-600/30 flex items-center justify-center text-amber-800">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                {editingArtwork ? `Edit "${editingArtwork.title}"` : 'Add Your Handmade Painting'}
              </h3>
              <p className="text-xs text-stone-500">
                Upload photos of your artwork and set pricing to publish in your store
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsArtModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 overflow-y-auto max-h-[82vh] space-y-6">
          
          {/* Section 1: Photos Upload */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <ImageIcon className="w-4 h-4 text-amber-700" />
                <span>1. Artwork Photos *</span>
              </span>
              <span className="text-[11px] text-stone-500 font-normal">
                Upload from Computer or Phone
              </span>
            </label>

            {/* Drag & Drop Upload Zone */}
            <div
              onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(true); }}
              onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); }}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                dragActive 
                  ? 'border-amber-600 bg-amber-50/80 scale-[1.01]' 
                  : 'border-stone-300 hover:border-amber-500 bg-stone-50/60'
              }`}
            >
              <input
                type="file"
                id="artwork-photo-upload"
                multiple
                accept="image/*"
                onChange={(e) => handleFiles(e.target.files)}
                className="hidden"
              />

              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-amber-100/80 text-amber-800 flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <label
                    htmlFor="artwork-photo-upload"
                    className="cursor-pointer text-xs sm:text-sm font-bold text-amber-900 hover:text-amber-700 underline underline-offset-2"
                  >
                    Click to browse your photos
                  </label>
                  <span className="text-xs text-stone-500"> or drag & drop images here</span>
                </div>
                <p className="text-[11px] text-stone-400">
                  JPEG, PNG, WEBP (Photos are automatically optimized for crisp high-speed web display)
                </p>
              </div>
            </div>

            {/* Image Preview Grid */}
            {form.images.length > 0 && (
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-semibold text-stone-600">Attached Photos ({form.images.length})</span>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {form.images.map((img, idx) => (
                    <div key={idx} className="relative w-24 h-28 rounded-xl overflow-hidden border border-stone-300 shadow-sm shrink-0 group">
                      <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute bottom-1 left-1 bg-stone-900/80 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                          Cover
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-rose-600/90 text-white rounded-full opacity-90 group-hover:opacity-100 transition shadow"
                        title="Remove photo"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Optional URL Input */}
            <div className="pt-1 flex gap-2">
              <input
                type="text"
                placeholder="Or paste an external image link (e.g. Unsplash, Imgur, Cloudinary)..."
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                className="flex-1 border border-stone-300 rounded-xl px-3 py-2 text-xs bg-stone-50/50 focus:outline-none focus:border-amber-600"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold px-4 py-2 rounded-xl"
              >
                Add Link
              </button>
            </div>
          </div>

          {/* Section 2: Artwork Basic Info */}
          <div className="space-y-3 pt-3 border-t border-stone-200">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-800 block">
              2. Painting Details
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div className="sm:col-span-2">
                <label className="font-semibold text-stone-700 block mb-1">Painting Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Whispers of the Horizon No. 4"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-stone-300 rounded-xl p-2.5 bg-stone-50/50 focus:outline-none focus:border-amber-600 font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-stone-300 rounded-xl p-2.5 bg-stone-50/50 focus:outline-none focus:border-amber-600 font-medium"
                >
                  {ART_CATEGORIES.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Size Classification</label>
                <select
                  value={form.sizeCategory}
                  onChange={(e) => setForm({ ...form, sizeCategory: e.target.value })}
                  className="w-full border border-stone-300 rounded-xl p-2.5 bg-stone-50/50 focus:outline-none focus:border-amber-600 font-medium"
                >
                  <option value="Small">Small (&lt; 12 inches)</option>
                  <option value="Medium">Medium (12 to 24 inches)</option>
                  <option value="Large">Large (24+ inches)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Exact Dimensions</label>
                <input
                  type="text"
                  placeholder="e.g. 24 x 36 inches (61 x 91 cm)"
                  value={form.dimensions}
                  onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
                  className="w-full border border-stone-300 rounded-xl p-2.5 bg-stone-50/50 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Medium & Substrate</label>
                <input
                  type="text"
                  placeholder="e.g. Heavy Impasto Oil on Linen Canvas"
                  value={form.medium}
                  onChange={(e) => setForm({ ...form, medium: e.target.value })}
                  className="w-full border border-stone-300 rounded-xl p-2.5 bg-stone-50/50 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Selling Price ({artistSettings.currency}) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="12000"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  className="w-full border border-stone-300 rounded-xl p-2.5 bg-stone-50/50 font-bold text-amber-950 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Original Price (optional strike-through)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="14500"
                  value={form.originalPrice}
                  onChange={(e) => setForm({ ...form, originalPrice: Number(e.target.value) })}
                  className="w-full border border-stone-300 rounded-xl p-2.5 bg-stone-50/50 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Availability Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full border border-stone-300 rounded-xl p-2.5 bg-stone-50/50 font-semibold focus:outline-none focus:border-amber-600"
                >
                  <option value="available">Available for Purchase</option>
                  <option value="sold">Sold (Keep in Gallery Archive)</option>
                </select>
              </div>

              <div className="flex items-center space-x-2 pt-5">
                <label className="flex items-center space-x-2 cursor-pointer font-semibold text-stone-700">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    className="w-4 h-4 accent-amber-800 rounded"
                  />
                  <span>Mark as Featured Masterpiece</span>
                </label>
              </div>
            </div>
          </div>

          {/* Section 3: Story & Description */}
          <div className="space-y-3 pt-3 border-t border-stone-200 text-xs">
            <span className="font-bold uppercase tracking-wider text-stone-800 block">
              3. The Artist's Story (Why this piece is special)
            </span>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Inspiration Behind This Canvas</label>
              <textarea
                rows={3}
                placeholder="What emotion, memory, or studio experiment inspired this piece? Art lovers cherish reading this!"
                value={form.story}
                onChange={(e) => setForm({ ...form, story: e.target.value })}
                className="w-full border border-stone-300 rounded-xl p-2.5 bg-stone-50/50 focus:outline-none focus:border-amber-600 leading-relaxed"
              />
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsArtModalOpen(false)}
              className="px-5 py-2.5 text-stone-600 hover:text-stone-900 text-xs font-semibold"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isProcessingImage}
              className="bg-stone-900 hover:bg-amber-950 text-white px-7 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-xl flex items-center space-x-2 disabled:opacity-70"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{editingArtwork ? 'Save Changes' : 'Publish Painting to Store'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
