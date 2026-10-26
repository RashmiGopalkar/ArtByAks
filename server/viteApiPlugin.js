import fs from 'fs';
import path from 'path';

/**
 * Vite Dev Server API Plugin
 * Provides persistent server-side REST API endpoints for inventory, image uploads,
 * orders, and settings.
 * Ensures changes made in any browser/device are centrally stored on disk
 * and shared across all visitors, phones, and browsers!
 */

export function viteApiPlugin() {
  const rootDir = process.cwd();
  const dataDir = path.join(rootDir, 'src', 'data');
  const inventoryFile = path.join(dataDir, 'inventory.json');
  const ordersFile = path.join(dataDir, 'orders.json');
  const commissionsFile = path.join(dataDir, 'commissions.json');
  const settingsFile = path.join(dataDir, 'settings.json');
  const uploadsDir = path.join(rootDir, 'public', 'uploads');

  // Ensure directories exist
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  const readJson = (filePath, fallback) => {
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(content);
      }
    } catch (err) {
      console.warn(`[API] Error reading ${filePath}:`, err);
    }
    return fallback;
  };

  const writeJson = (filePath, data) => {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
      return true;
    } catch (err) {
      console.error(`[API] Error writing ${filePath}:`, err);
      return false;
    }
  };

  const parseBody = (req) => {
    return new Promise((resolve, reject) => {
      let body = '';
      req.on('data', chunk => {
        body += chunk;
        if (body.length > 50 * 1024 * 1024) { // 50MB safety limit
          req.connection.destroy();
          reject(new Error('Payload too large'));
        }
      });
      req.on('end', () => {
        try {
          resolve(body ? JSON.parse(body) : {});
        } catch (e) {
          resolve({});
        }
      });
      req.on('error', reject);
    });
  };

  const sendJson = (res, statusCode, data) => {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.end(JSON.stringify(data));
  };

  return {
    name: 'vite-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url.split('?')[0];

        // CORS preflight
        if (req.method === 'OPTIONS') {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
          res.statusCode = 200;
          res.end();
          return;
        }

        // 1. GET /api/paintings
        if (url === '/api/paintings' && req.method === 'GET') {
          const inv = readJson(inventoryFile, { isCustom: false, paintings: [] });
          return sendJson(res, 200, inv);
        }

        // 2. POST /api/paintings
        if (url === '/api/paintings' && req.method === 'POST') {
          try {
            const body = await parseBody(req);
            let paintingsList = [];
            let isCustom = true;

            if (Array.isArray(body)) {
              paintingsList = body;
            } else if (body && Array.isArray(body.paintings)) {
              paintingsList = body.paintings;
              if (body.isCustom !== undefined) isCustom = body.isCustom;
            }

            const dataToSave = {
              updatedAt: new Date().toISOString(),
              isCustom,
              paintings: paintingsList
            };

            writeJson(inventoryFile, dataToSave);

            // Also sync to dist if dist exists
            const distInventory = path.join(rootDir, 'dist', 'data', 'inventory.json');
            if (fs.existsSync(path.dirname(distInventory))) {
              writeJson(distInventory, dataToSave);
            }

            console.log(`[API] Saved ${paintingsList.length} painting(s) centrally to inventory.json`);
            return sendJson(res, 200, { success: true, count: paintingsList.length, updatedAt: dataToSave.updatedAt });
          } catch (err) {
            console.error('[API] Failed to save paintings:', err);
            return sendJson(res, 500, { success: false, error: err.message });
          }
        }

        // 3. POST /api/upload
        if (url === '/api/upload' && req.method === 'POST') {
          try {
            const body = await parseBody(req);
            const { image, name } = body;

            if (!image || !image.startsWith('data:image/')) {
              return sendJson(res, 400, { success: false, error: 'Invalid image format' });
            }

            // Extract base64
            const matches = image.match(/^data:image\/([a-zA-Z0-9.+]+);base64,(.+)$/);
            if (!matches) {
              return sendJson(res, 400, { success: false, error: 'Could not parse base64' });
            }

            const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
            const buffer = Buffer.from(matches[2], 'base64');
            const cleanName = (name || 'art').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 20);
            const filename = `${cleanName}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`;
            const targetPath = path.join(uploadsDir, filename);

            fs.writeFileSync(targetPath, buffer);

            // Also copy to dist/uploads if dist exists
            const distUploads = path.join(rootDir, 'dist', 'uploads');
            if (fs.existsSync(distUploads)) {
              fs.writeFileSync(path.join(distUploads, filename), buffer);
            }

            const publicUrl = `/uploads/${filename}`;
            console.log(`[API] Saved uploaded image to ${publicUrl}`);
            return sendJson(res, 200, { success: true, url: publicUrl });
          } catch (err) {
            console.error('[API] Upload error:', err);
            return sendJson(res, 500, { success: false, error: err.message });
          }
        }

        // 4. GET & POST /api/orders
        if (url === '/api/orders' && req.method === 'GET') {
          const orders = readJson(ordersFile, []);
          return sendJson(res, 200, orders);
        }
        if (url === '/api/orders' && req.method === 'POST') {
          try {
            const body = await parseBody(req);
            const orders = readJson(ordersFile, []);
            orders.unshift(body);
            writeJson(ordersFile, orders);
            return sendJson(res, 200, { success: true, count: orders.length });
          } catch (err) {
            return sendJson(res, 500, { success: false, error: err.message });
          }
        }

        // 5. GET & POST /api/commissions
        if (url === '/api/commissions' && req.method === 'GET') {
          const commissions = readJson(commissionsFile, []);
          return sendJson(res, 200, commissions);
        }
        if (url === '/api/commissions' && req.method === 'POST') {
          try {
            const body = await parseBody(req);
            const commissions = readJson(commissionsFile, []);
            commissions.unshift(body);
            writeJson(commissionsFile, commissions);
            return sendJson(res, 200, { success: true, count: commissions.length });
          } catch (err) {
            return sendJson(res, 500, { success: false, error: err.message });
          }
        }

        // 6. GET & POST /api/settings
        if (url === '/api/settings' && req.method === 'GET') {
          const settings = readJson(settingsFile, null);
          return sendJson(res, 200, settings);
        }
        if (url === '/api/settings' && req.method === 'POST') {
          try {
            const body = await parseBody(req);
            writeJson(settingsFile, body);
            return sendJson(res, 200, { success: true });
          } catch (err) {
            return sendJson(res, 500, { success: false, error: err.message });
          }
        }

        next();
      });
    }
  };
}
