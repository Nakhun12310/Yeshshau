let keys = {}; // { key: timestamp }

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const newKey = Math.random().toString(36).substring(2, 10).toUpperCase();
    const expiryTime = Date.now() + (24 * 60 * 60 * 1000); // 24 hours

    keys[newKey] = expiryTime;

    res.status(200).json({ key: newKey });
  } else if (req.method === 'POST') {
    const { key } = req.body;
    if (key && keys[key] && Date.now() < keys[key]) {
      res.status(200).json({ valid: true });
    } else {
      res.status(403).json({ valid: false });
    }
  } else {
    res.status(405).end();
  }
}
