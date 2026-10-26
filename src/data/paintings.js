import inventoryData from './inventory.json';

export const SAMPLE_DEMO_PAINTINGS = [
  {
    id: "art-01",
    title: "Tarpa Dance of Joy",
    category: "Warli Art",
    medium: "Fine White Pigment & Acrylic on Terracotta Textured Canvas",
    dimensions: "12 x 16 inches (30 x 40 cm)",
    sizeCategory: "Small",
    year: "2026",
    price: 1450,
    originalPrice: 1800,
    status: "available",
    isFeatured: true,
    rating: 5.0,
    reviewCount: 4,
    description: "Authentic traditional Warli folk art depicting village dancers moving in spiraling harmony around the Tarpa player. Represents the circle of life, unity, and seasonal celebration.",
    story: "Handmade by Akshatha Gopalkar. Warli art has always fascinated me for how deeply it captures community, nature, and pure joy using simple, timeless geometric figures of triangles and circles.",
    details: {
      varnish: "Double archival protective matte sealant",
      edges: "Stretched canvas with finished painted edges, ready to hang",
      authenticity: "Hand-signed by Akshatha Gopalkar with Certificate of Authenticity",
      weight: "0.6 kg"
    },
    images: [
      "https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["Warli Art", "Folk Art", "Tarpa Dance", "Terracotta", "Handmade", "Traditional"]
  },
  {
    id: "art-02",
    title: "Whispering Pines at Sunset",
    category: "Oil Paintings",
    medium: "Original Oil on Stretched Linen Canvas",
    dimensions: "14 x 18 inches (35 x 45 cm)",
    sizeCategory: "Medium",
    year: "2026",
    price: 2800,
    originalPrice: 3400,
    status: "available",
    isFeatured: true,
    rating: 4.9,
    reviewCount: 6,
    description: "A calming landscape oil study capturing evening pine silhouettes against a warm gradient of coral, lavender, and dusky amber light.",
    story: "Painted with slow, patient layers of artist-grade oils over several days. I wanted to capture the tranquil quiet that settles over forest ridges right before twilight falls.",
    details: {
      varnish: "Archival satin gloss UV varnish",
      edges: "Wrapped canvas edges painted continuously",
      authenticity: "Hand-signed on front & reverse with Certificate",
      weight: "0.9 kg"
    },
    images: [
      "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1579783928621-7a13d66a62d1?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["Oil Painting", "Landscape", "Sunset", "Forest", "Calm"]
  },
  {
    id: "art-03",
    title: "Tree of Life & Birds of Joy",
    category: "Folk Fusion",
    medium: "Acrylic & Warli Motifs with Champagne Gold Accents on Canvas",
    dimensions: "16 x 20 inches (40 x 50 cm)",
    sizeCategory: "Medium",
    year: "2026",
    price: 2450,
    originalPrice: 2900,
    status: "available",
    isFeatured: true,
    rating: 5.0,
    reviewCount: 5,
    description: "A contemporary fusion blending traditional Indian Warli tribal motifs with warm earthy textures. Features a grand banyan tree sheltering playful birds, deer, and village life.",
    story: "The Tree of Life is a universal symbol of grounding, family roots, and growth. Each branch and bird is hand-drawn with fine tip brushes with immense love.",
    details: {
      varnish: "Protective archival clear coat",
      edges: "1 inch gallery profile with finished sides",
      authenticity: "Hand-signed with Certificate of Authenticity",
      weight: "1.0 kg"
    },
    images: [
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["Tree of Life", "Warli Fusion", "Bespoke", "Handmade", "Indian Art"]
  },
  {
    id: "art-04",
    title: "Morning Marigold in Clay Pot",
    category: "Oil Paintings",
    medium: "Buttery Oil on Wood Cradle Panel",
    dimensions: "12 x 12 inches (30 x 30 cm)",
    sizeCategory: "Small",
    year: "2026",
    price: 2200,
    originalPrice: 2600,
    status: "available",
    isFeatured: false,
    rating: 4.8,
    reviewCount: 3,
    description: "A joyful and intimate still life study of cheerful marigold blooms tucked inside a rustic Indian earthenware pot, bathed in soft morning sunshine.",
    story: "Marigolds hold a sacred, festive place in our homes. This piece was painted to bring positive warmth and a touch of cheerful color into compact living spaces.",
    details: {
      varnish: "Dammar protective gloss coat",
      edges: "Solid birch cradle with raw exposed natural wood sides",
      authenticity: "Hand-signed by Akshatha Gopalkar",
      weight: "0.7 kg"
    },
    images: [
      "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1579783928621-7a13d66a62d1?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["Oil Still Life", "Marigold", "Warm Sunlight", "Home Decor"]
  },
  {
    id: "art-05",
    title: "Village Harvest & Paddy Rhythms",
    category: "Warli Art",
    medium: "White Ink & Natural Mineral Pigments on Textured Card",
    dimensions: "10 x 14 inches (25 x 35 cm)",
    sizeCategory: "Small",
    year: "2026",
    price: 1150,
    originalPrice: 1400,
    status: "available",
    isFeatured: false,
    rating: 5.0,
    reviewCount: 2,
    description: "Intricate folk storytelling depicting farmers harvesting golden crops, threshing paddy, and village women celebrating abundance. Perfect for a cozy entryway or gallery wall.",
    story: "Created using delicate 0.3mm nibs and traditional white rice-inspired ink on earthy rust textured board. An ode to farmers and traditional Indian rural harmony.",
    details: {
      varnish: "Fixative UV sealed",
      edges: "Mounted on archival backboard ready for standard 10x14 inch frame",
      authenticity: "Signed original with Certificate",
      weight: "0.4 kg"
    },
    images: [
      "https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["Warli Art", "Harvest", "Folk Story", "Affordable Art"]
  },
  {
    id: "art-06",
    title: "Dusk Horizon Mini Easel Study",
    category: "Miniatures",
    medium: "Oil on Archival Canvas Board (Includes Wooden Display Easel)",
    dimensions: "6 x 8 inches (15 x 20 cm)",
    sizeCategory: "Small",
    year: "2026",
    price: 950,
    originalPrice: 1200,
    status: "available",
    isFeatured: true,
    rating: 5.0,
    reviewCount: 7,
    description: "An intimate, pocket-sized original oil painting capturing golden clouds dissolving into dusk purple. Comes accompanied by a solid natural pine wood tabletop display easel.",
    story: "Created as an accessible, friendly piece so anyone can begin their original art collection without breaking the bank. Ideal for study desks, bedside tables, or bookshelf nooks.",
    details: {
      varnish: "Protective satin varnish",
      edges: "Includes mini 7-inch solid pine display easel",
      authenticity: "Hand-signed on reverse by Akshatha Gopalkar",
      weight: "0.3 kg"
    },
    images: [
      "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["Miniature", "Oil Painting", "Desk Art", "Gift Ready", "Budget Friendly"]
  }
];

// Single source of truth: whatever is in inventory.json (your actual store inventory)
export const INITIAL_PAINTINGS = (inventoryData && Array.isArray(inventoryData.paintings))
  ? inventoryData.paintings
  : [];

export const ART_CATEGORIES = [
  "All",
  "Warli Art",
  "Oil Paintings",
  "Folk Fusion",
  "Miniatures"
];

export const FRAMING_OPTIONS = [
  {
    id: "none",
    name: "Stretched / Ready to Hang (No Extra Frame)",
    price: 0,
    description: "Clean finished edges with pre-installed hanging hook"
  },
  {
    id: "natural-wood",
    name: "Natural Pine Wood Frame",
    price: 450,
    description: "Warm minimal raw pine frame, complements Warli and oils"
  },
  {
    id: "sleek-black",
    name: "Classic Matte Black Frame",
    price: 400,
    description: "Sleek contrast border that makes folk art colors pop"
  },
  {
    id: "warm-teak",
    name: "Warm Teak Finish Wood Frame",
    price: 550,
    description: "Traditional rich brown wooden finish for home walls"
  }
];
