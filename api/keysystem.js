// /api/keysystem.js

import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'database.json');

function loadDatabase() {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, '{}');
  }
  return JSON.parse(fs.readFileSync(dbPath));
}

function saveDatabase(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

function generateKey() {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
}

export default async function handler(req, res) {
  const { type, key, discordId } = req.query;
  let database = loadDatabase();

  if (type === 'create') {
    const newKey = generateKey();
    const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
    database[newKey] = { discordId, expiresAt };
    saveDatabase(database);
    return res.status(200).json({ success: true, key: newKey });
  }

  if (type === 'check') {
    if (!database[key]) {
      return res.status(403).json({ success: false, reason: "Invalid key" });
    }
    if (Date.now() > database[key].expiresAt) {
      delete database[key];
      saveDatabase(database);
      return res.status(403).json({ success: false, reason: "Key expired" });
    }
    return res.status(200).json({ success: true });
  }

  return res.status(400).json({ success: false });
}
