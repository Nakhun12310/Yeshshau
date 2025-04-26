export default function handler(req, res) {
  const userAgent = req.headers['user-agent'] || '';

  if (userAgent.includes('Roblox') || userAgent === '') {
    // Real Roblox request (no browser)
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(`
print("Script loaded!")
loadstring(game:HttpGet("https://raw.githubusercontent.com/Nakhun12310/CookieHub/main/OldFluentFisch.lua"))()
    `);
  } else {
    // Browser trying to access
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send('WHAT ARE YOU DOING');
  }
}
