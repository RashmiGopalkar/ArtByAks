# 🎨 Art by Aks — Original Fine Art Studio & E-Commerce Web App

A bespoke, luxury e-commerce web application tailored specifically for independent artists to sell handcrafted original paintings, manage bespoke custom commissions, and run an art business.

---

## ✨ Features Built Specifically for an Art Business

### 1. 🖼️ Fine Art Gallery Storefront
- **Original 1-of-1 Catalog**: Built specifically for original handmade art (not prints). Once a painting is bought, it automatically updates to "Sold / Archive".
- **Real-Time Filtering**: Filter by Category (*Abstract, Landscape, Floral, Minimalist, Figurative, Miniatures*), Size (*Small, Medium, Large*), and Availability (*Available vs Sold*).
- **Search Bar**: Instant keyword lookup across painting titles, mediums, and tags.
- **Detailed Artwork Inspector**: High-resolution zoom, medium & substrate specifications, creation year, and the personal story behind every piece.

### 2. 🛋️ Interactive "Hang on Your Wall" AR Room Simulator
- Art buyers often hesitate because they don't know how a painting looks in their home.
- This app features an interactive **Room Visualizer** allowing collectors to:
  - Select room settings (*Living Room above sofa, Master Bedroom, Modern Office Desk, Dining Credenza*).
  - Test real wall colors (*Alabaster Linen, Nordic Sage, Terracotta, Charcoal Navy, Greige, Gallery White*).
  - Preview custom wood frames in real time.
  - Scale & adjust height on the wall with 1 click!

### 3. 📜 Digital & Printable Certificate of Authenticity (COA)
- Each artwork includes an official serialized Certificate of Provenance with:
  - Unique Serial ID (e.g. `COA-AKS-2026-ART-01`)
  - Medium & archival lightfast certification
  - Artist's monogram signature and official studio seal
  - Direct 1-click **Print / Save as PDF** option.

### 4. 🎨 Bespoke Custom Commission Studio
- Custom orders are the highest-margin revenue stream for artists.
- Built-in **Commission Studio** with a **Live Price Estimator** calculating investment ranges based on canvas size, style (*Textured Impasto, Gold Leaf, Plaster Relief, Oil Floral*), custom dimensions, and color palette preferences.
- Clients can submit directly to the artist portal or send a pre-filled WhatsApp brief with 1 tap.

### 5. 💳 Small-Business Friendly Checkout & Payments
- **Direct UPI / QR Code Payment**: Displays your custom UPI ID with 1-click copy, dynamic QR code generation, and UTR transaction reference capture.
- **WhatsApp 1-Click Checkout**: Formats the entire cart, selected framing, and delivery address into a WhatsApp message directly to the artist.
- **Card / NetBanking Simulator**: Simulated seamless card transaction.
- **Studio Pickup / COD**: Optional inspection upon delivery.
- **Celebratory Confetti & Printable Order Invoices**: Post-purchase confirmation with order ID and tracking timeline.

### 6. 🛠️ Complete Artist Studio Portal (Admin Dashboard)
- Seamlessly toggle between "Collector Storefront" and "Artist Mode":
  - **Artwork Inventory Management**: Add new paintings, set custom prices, update dimensions, or mark originals as sold.
  - **Orders & White-Glove Dispatch**: Review buyer delivery addresses, update shipment tracking status (*Pending -> Packing & Varnishing -> Shipped -> Delivered*).
  - **Commissions Inbox**: Review custom art briefs and message clients on WhatsApp.
  - **Financial Metrics**: Track total revenue, catalog valuation, and pieces sold.
  - **Studio Settings**: Customize UPI ID, WhatsApp number, free shipping threshold, and artist bio.
  - **Persistent Storage**: All inventory, orders, settings, and commissions are preserved via `localStorage`.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ or v24)
- npm

### Installation & Launch

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your web browser.

3. **Build for Production**:
   ```bash
   npm run build
   ```
   The optimized production bundle will be generated in `dist/`.

---

## 📁 Project Structure

```
ArtbyAks/
├── src/
│   ├── components/
│   │   ├── AdminDashboard.jsx       # Studio owner portal (Inventory, Orders, Settings)
│   │   ├── ArtCareFAQ.jsx           # Art preservation guide & packaging FAQ
│   │   ├── ArtistStory.jsx          # "Behind the Easel" story & studio steps
│   │   ├── CartDrawer.jsx           # Slide-over cart with free shipping bar
│   │   ├── CertificateModal.jsx     # Museum-grade Certificate of Authenticity
│   │   ├── CheckoutModal.jsx        # Multi-option checkout (UPI QR, WhatsApp, Card)
│   │   ├── CommissionModal.jsx      # Bespoke custom painting order builder
│   │   ├── Footer.jsx               # VIP Collector's Club & studio details
│   │   ├── Hero.jsx                 # Gallery hero banner & featured showcase
│   │   ├── Navbar.jsx               # Navigation bar, search, wishlist & admin toggle
│   │   ├── OrderSuccessModal.jsx    # Celebration confetti & order receipt
│   │   ├── ProductCard.jsx          # Fine art gallery card with hover actions
│   │   ├── ProductModal.jsx         # Artwork inspector with zoom & framing options
│   │   ├── RoomVisualizerModal.jsx  # Interactive AR wall hanging simulator
│   │   ├── Testimonials.jsx         # Reviews from verified private collectors
│   │   └── Toast.jsx                # Notification banners
│   ├── context/
│   │   └── ShopContext.jsx          # Central state & localStorage synchronization
│   ├── data/
│   │   ├── paintings.js             # Initial curated collection of original art
│   │   └── reviews.js               # Collector testimonials & artist defaults
│   ├── App.jsx                      # Main app composition
│   ├── index.css                    # Luxury fonts & styling
│   └── main.jsx                     # Vite entry point
├── package.json
└── vite.config.js
```

---

## 💡 Customizing for Your Art Business

1. **Change Your UPI ID & WhatsApp**:
   - Open the app, click the **"Artist Portal"** button in the top navigation or footer.
   - Go to **"Studio & Payment Settings"**.
   - Enter your own UPI ID (e.g. `yourname@okhdfcbank`) and WhatsApp number (e.g. `+919876543210`).
   - Click **Save Settings**!
2. **Add Your Own Paintings**:
   - In the Artist Portal under **"Paintings Inventory"**, click **"+ Add New Artwork"**.
   - Enter your title, dimensions, medium, price, and paste your photo URL.
   - It will immediately appear in your public gallery store!
