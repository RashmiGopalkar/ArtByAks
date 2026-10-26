/**
 * Store Inventory & Synchronization Engine:
 * Single Source of Truth: Central Server Disk (src/data/inventory.json) & Bundled inventory.json.
 * Client caching uses versioned key (artbyaks_paintings_v2) to prevent stale demo paintings from ever resurrecting.
 */

const DB_NAME = 'ArtByAkshathaDB_v2';
const DB_VERSION = 1;
const STORE_NAME = 'paintings_store';

// Open or initialize IndexedDB
const openDB = () => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      console.warn('IndexedDB open error:', event.target.error);
      resolve(null);
    };
  });
};

export const setIDB = async (key, val) => {
  try {
    const db = await openDB();
    if (!db) return false;
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(val, key);
      request.onsuccess = () => resolve(true);
      request.onerror = () => resolve(false);
    });
  } catch (err) {
    return false;
  }
};

export const getIDB = async (key) => {
  try {
    const db = await openDB();
    if (!db) return null;
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);
      request.onsuccess = (event) => resolve(event.target.result || null);
      request.onerror = () => resolve(null);
    });
  } catch (err) {
    return null;
  }
};

/**
 * Fetch paintings from the centralized server
 */
export const fetchServerInventory = async () => {
  try {
    const res = await fetch('/api/paintings');
    if (!res.ok) return null;
    const data = await res.json();
    return data;
  } catch (err) {
    return null;
  }
};

/**
 * Upload an image to the server disk in public/uploads/
 */
export const uploadImageToServer = async (base64Data, filename) => {
  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Data, name: filename })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.url) {
        return data.url;
      }
    }
  } catch (e) {
    console.warn('Upload API unavailable, using direct photo:', e);
  }
  return base64Data;
};

/**
 * Universal safe persistent save for paintings inventory
 * 1. Writes to central server disk (/api/paintings -> src/data/inventory.json)
 * 2. Saves to local IndexedDB and LocalStorage for fast offline reloads
 */
export const persistPaintings = async (paintingsList, isCustom = true) => {
  // 1. Central Server Save
  try {
    await fetch('/api/paintings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isCustom, paintings: paintingsList })
    });
  } catch (err) {
    console.warn('Could not reach central server, saving locally:', err);
  }

  // 2. Client IndexedDB Save
  await setIDB('paintings_v2', paintingsList);

  // 3. Client LocalStorage Save with v2 key
  try {
    localStorage.setItem('artbyaks_paintings_v2', JSON.stringify(paintingsList));
    localStorage.setItem('artbyaks_inventory_saved_v2', 'true');
    // Clean up any legacy keys
    localStorage.removeItem('artbyaks_paintings');
    localStorage.removeItem('artbyaks_inventory_saved');
    localStorage.removeItem('artbyaks_inventory_custom');
  } catch (e) {
    console.warn('LocalStorage save notice:', e);
  }
};

/**
 * Safe synchronous load from LocalStorage
 * Automatically purges any legacy demo paintings cache
 */
export const loadSyncPaintings = (fallbackDefaults) => {
  try {
    // Purge old stale cache keys that hold demo paintings
    localStorage.removeItem('artbyaks_paintings');
    localStorage.removeItem('artbyaks_inventory_saved');
    localStorage.removeItem('artbyaks_inventory_custom');

    const isSaved = localStorage.getItem('artbyaks_inventory_saved_v2');
    const raw = localStorage.getItem('artbyaks_paintings_v2');
    if (isSaved === 'true' && raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading from localStorage:', e);
  }
  return fallbackDefaults;
};

/**
 * Sync orders with server
 */
export const syncServerOrder = async (order) => {
  try {
    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
  } catch (e) {}
};

/**
 * Sync commission with server
 */
export const syncServerCommission = async (commission) => {
  try {
    await fetch('/api/commissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(commission)
    });
  } catch (e) {}
};

/**
 * Sync settings with server
 */
export const syncServerSettings = async (settings) => {
  try {
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
  } catch (e) {}
};
